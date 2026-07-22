'use client';

import { useState } from 'react';
import { createClient } from '../../../lib/supabase';

const CATEGORIES = [
  'pothole', 'crack', 'flooded_road', 'broken_sign',
  'fallen_tree', 'accident', 'damaged_bridge', 'obstruction',
];

export default function ReportPage() {
  const supabase = createClient();

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  function getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported on this device'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to submit a report.');
        return;
      }

      setStatus('locating');
      const { lat, lng } = await getLocation();

      let image_url = null;
      if (file) {
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('report-images')
          .upload(path, file);
        if (uploadError) throw uploadError;
        image_url = supabase.storage.from('report-images').getPublicUrl(path).data.publicUrl;
      }

      let ai_prediction = null;
      let ai_confidence = null;
      let aiSeverity = 'unrated';

      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const aiResponse = await fetch('http://127.0.0.1:8000/ai/detect', {
            method: 'POST',
            body: formData,
          });
          const aiResult = await aiResponse.json();
          if (aiResult.detections && aiResult.detections.length > 0) {
            ai_prediction = aiResult.detections[0].class;
            ai_confidence = aiResult.detections[0].confidence;
            aiSeverity = aiResult.severity;
          }
        } catch (aiError) {
          console.warn('AI detection failed, continuing without it:', aiError);
        }
      }

      setStatus('submitting');
      const { error: insertError } = await supabase.from('reports').insert({
        user_id: user.id,
        category,
        description,
        latitude: lat,
        longitude: lng,
        image_url,
        ai_prediction,
        ai_confidence,
        severity: aiSeverity,
      });
      if (insertError) throw insertError;

      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="page-container">
        <div className="card text-center">
          <div className="text-4xl mb-2">✅</div>
          <h1 className="text-xl font-bold mb-1">Report submitted</h1>
          <p className="text-gray-600">Thank you for helping keep Gambian roads safe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="text-xl font-bold mb-4">Report a road hazard</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Hazard type</span>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace('_', ' ')}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Description</span>
            <textarea
              className="input-field"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Photo</span>
            <input
              className="input-field"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={status === 'locating' || status === 'submitting'}
          >
            {status === 'locating' && 'Getting your location…'}
            {status === 'submitting' && 'Submitting…'}
            {(status === 'idle' || status === 'error') && 'Submit report'}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
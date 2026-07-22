'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase';

const STATUS_LABEL = {
  submitted: 'Submitted',
  ai_processing: 'AI Processing',
  verified: 'Verified',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export default function MyReportsPage() {
  const supabase = createClient();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMyReports() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to see your reports.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setReports(data);
      setLoading(false);
    }
    loadMyReports();
  }, []);

  if (loading) return <div className="page-container"><p style={{ color: '#4a463f' }}>Loading your reports…</p></div>;
  if (error) return <div className="page-container"><p className="text-red-600">{error}</p></div>;

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <h1 className="font-display" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>My reports</h1>
      {reports.length === 0 && (
        <div className="card text-center" style={{ color: '#4a463f' }}>You haven't submitted any reports yet.</div>
      )}
      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <strong className="capitalize">{r.category.replace('_', ' ')}</strong>
              <span className={`badge badge-${r.status}`}>{STATUS_LABEL[r.status] ?? r.status}</span>
            </div>
            {r.description && <p className="mb-2" style={{ color: '#4a463f' }}>{r.description}</p>}
            <p className="text-xs mb-2" style={{ color: '#8a8478', fontFamily: 'var(--font-mono)' }}>
              {new Date(r.created_at).toLocaleDateString()} · Severity: {r.severity}
            </p>
            {r.image_url && (
              <img src={r.image_url} alt={r.category} className="rounded-lg max-h-64 object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
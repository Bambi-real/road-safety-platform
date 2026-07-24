'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase';

const STATUSES = [
  'submitted', 'ai_processing', 'verified', 'assigned',
  'in_progress', 'resolved', 'closed',
];

export default function AdminDashboard() {
  const supabase = createClient();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  async function checkAdminAndLoad() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') {
      setError('You do not have access to this page.');
      setLoading(false);
      return;
    }
    loadReports();
  }
  checkAdminAndLoad();
}, []);
  async function loadReports() {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else { setReports(data); setError(null); }
    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
    const { error } = await supabase.from('reports').update({ status: newStatus }).eq('id', id);
    if (error) { alert('Failed to update: ' + error.message); return; }
    loadReports();
  }

  if (loading) return <div className="page-container"><p style={{ color: '#4a463f' }}>Loading reports…</p></div>;
  if (error) return <div className="page-container"><p className="text-red-600">{error}</p></div>;

  const total = reports.length;
  const open = reports.filter(r => !['resolved', 'closed'].includes(r.status)).length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const critical = reports.filter(r => r.severity === 'critical').length;

  const stats = [
    { label: 'Total', value: total, color: 'var(--ink)' },
    { label: 'Open', value: open, color: 'var(--teal)' },
    { label: 'Resolved', value: resolved, color: '#0a7a3e' },
    { label: 'Critical', value: critical, color: 'var(--laterite)' },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <h1 className="font-display" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Admin dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="card text-center">
            <div className="text-sm" style={{ color: '#8a8478', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
            <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <h2 className="font-display" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>All reports</h2>
      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <strong className="capitalize">{r.category.replace('_', ' ')}</strong>
              <span className={`badge badge-${r.status}`}>{r.status.replace('_', ' ')}</span>
            </div>
            {r.description && <p className="mb-2" style={{ color: '#4a463f' }}>{r.description}</p>}
            <p className="text-xs mb-3" style={{ color: '#8a8478', fontFamily: 'var(--font-mono)' }}>
              {new Date(r.created_at).toLocaleDateString()} · Severity: {r.severity}
              {r.ai_prediction && ` · AI: ${r.ai_prediction} (${Math.round(r.ai_confidence * 100)}%)`}
            </p>
            <label className="text-sm font-medium">
              Update status:
              <select className="input-field mt-1" value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
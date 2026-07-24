'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

const STATUS_COLORS = {
  Resolved: '#0a7a3e',
  Pending: '#B5451B',
};

export default function AnalyticsPage() {
  const supabase = createClient();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('reports').select('*');
      if (!error) setReports(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="page-container"><p style={{ color: '#4a463f' }}>Loading analytics…</p></div>;

  const categoryCounts = {};
  reports.forEach(r => { categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1; });
  const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
    category: category.replace('_', ' '), count,
  }));

  const dayCounts = {};
  reports.forEach(r => {
    const day = new Date(r.created_at).toLocaleDateString();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const trendData = Object.entries(dayCounts)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  const resolvedCount = reports.filter(r => ['resolved', 'closed'].includes(r.status)).length;
  const pendingCount = reports.length - resolvedCount;
  const statusData = [
    { name: 'Resolved', value: resolvedCount },
    { name: 'Pending', value: pendingCount },
  ];

  // Hotspot areas: group reports by rounded coordinates (roughly neighborhood-level)
  const hotspotCounts = {};
  reports.forEach(r => {
    const key = `${r.latitude.toFixed(2)}, ${r.longitude.toFixed(2)}`;
    hotspotCounts[key] = (hotspotCounts[key] || 0) + 1;
  });
  const hotspots = Object.entries(hotspotCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <h1 className="font-display" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <h2 className="font-display" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Resolved vs pending</h2>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="font-display" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Hazard hotspots</h2>
          {hotspots.length === 0 && <p style={{ color: '#8a8478' }}>No reports yet.</p>}
          <div className="space-y-2">
            {hotspots.map((h, i) => (
              <div key={h.location} className="flex items-center justify-between text-sm" style={{ borderBottom: i < hotspots.length - 1 ? '1px solid #C9BFA6' : 'none', paddingBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{h.location}</span>
                <span className="badge" style={{ background: '#f3eee2', color: 'var(--laterite)' }}>{h.count} reports</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-display" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Reports by hazard type</h2>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C9BFA6" />
              <XAxis dataKey="category" fontSize={12} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#B5451B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="font-display" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Reports over time</h2>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C9BFA6" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0E6B63" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
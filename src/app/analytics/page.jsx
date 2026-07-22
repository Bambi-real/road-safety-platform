'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

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

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <h1 className="font-display" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Analytics</h1>

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
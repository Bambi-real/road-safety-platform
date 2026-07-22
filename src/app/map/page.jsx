'use client';

import { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { createClient } from '../../../lib/supabase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
export const dynamicParams = true;
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
// Leaflet needs the browser window, so load the map with SSR turned off
const MapContainer = nextDynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = nextDynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = nextDynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = nextDynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const SEVERITY_COLOR = {
  unrated: 'gray',
  low: 'green',
  medium: 'orange',
  high: 'red',
  critical: 'darkred',
};

export default function MapPage() {
  const supabase = createClient();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setReports(data);
      setLoading(false);
    }
    loadReports();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading map…</p>;

  // Default center: The Gambia (Banjul area)
  const center = reports.length
    ? [reports[0].latitude, reports[0].longitude]
    : [13.4549, -16.5790];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {reports.map((r) => (
          <Marker key={r.id} position={[r.latitude, r.longitude]}>
            <Popup>
              <strong>{r.category.replace('_', ' ')}</strong><br />
              {r.description}<br />
              Status: {r.status}<br />
              Severity: {r.severity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
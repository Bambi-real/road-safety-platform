'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', (await supabase.auth.getUser()).data.user.id)
  .single();

router.push(profile?.role === 'admin' ? '/admin' : '/report');
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Log in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
        <p className="text-sm mt-4" style={{ color: '#4a463f' }}>
          No account? <a href="/register" style={{ color: 'var(--laterite)', fontWeight: 500 }}>Register</a>
        </p>
      </div>
    </div>
  );
}
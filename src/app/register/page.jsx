'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push('/login');
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Create an account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Full name</span>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </label>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
        <p className="text-sm mt-4" style={{ color: '#4a463f' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--laterite)', fontWeight: 500 }}>Log in</a>
        </p>
      </div>
    </div>
  );
}
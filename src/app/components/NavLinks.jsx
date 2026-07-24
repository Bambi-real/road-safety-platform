'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase';

export default function NavLinks() {
  const supabase = createClient();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    check();
  }, []);

  async function check() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoggedIn(false);
      setChecked(true);
      return;
    }
    setLoggedIn(true);
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    setIsAdmin(profile?.role === 'admin');
    setChecked(true);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setIsAdmin(false);
    router.push('/login');
  }

  return (
    <div className="site-nav__links">
      <a href="/report">Report</a>
      <a href="/map">Map</a>
      <a href="/my-reports">My Reports</a>
      {checked && isAdmin && <a href="/analytics">Analytics</a>}
      {checked && isAdmin && <a href="/admin">Admin</a>}
      {checked && !loggedIn && <a href="/login">Log in</a>}
      {checked && loggedIn && (
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--laterite)', fontFamily: 'var(--font-body)', fontSize: 'inherit' }}
        >
          Log out
        </button>
      )}
    </div>
  );
}
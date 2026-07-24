'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase';

export default function NavLinks() {
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setLoggedIn(true);
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      setIsAdmin(profile?.role === 'admin');
    }
    check();
  }, []);

  return (
    <div className="site-nav__links">
      <a href="/report">Report</a>
      <a href="/map">Map</a>
      <a href="/my-reports">My Reports</a>
      {isAdmin && <a href="/analytics">Analytics</a>}
      {isAdmin && <a href="/admin">Admin</a>}
      {!loggedIn && <a href="/login">Log in</a>}
    </div>
  );
}
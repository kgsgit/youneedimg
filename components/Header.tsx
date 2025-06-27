import React from 'react';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); }
  }, []);

  const handleAuth = async () => {
    if (user) {
      await supabase.auth.signOut();
      window.location.reload(); // 로그아웃 후 새로고침
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-2xl font-bold tracking-tight">YouNeedImg</div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-600">{user.email}</span>
          )}
          <button
            className="text-blue-600 border px-4 py-1 rounded hover:bg-blue-50"
            onClick={handleAuth}
          >
            {user ? '로그아웃' : '로그인'}
          </button>
        </div>
      </div>
    </header>
  );
}

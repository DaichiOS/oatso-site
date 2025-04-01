'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChange listens for authentication events:
    // - SIGNED_IN: User successfully logs in via any method (email/password, OAuth, magic link)
    // - SIGNED_OUT: User logs out or session expires
    // - USER_UPDATED: User profile/data is modified
    // - USER_DELETED: User account is removed
    // - PASSWORD_RECOVERY: Password reset flow initiated
    // - TOKEN_REFRESHED: Auth tokens are automatically renewed
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Only handle hash-based auth (OAuth, magic link)
        if (window.location.hash) {
          window.history.replaceState({}, '', window.location.pathname);
          router.push('/');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null; // This component doesn't render anything
} 
'use client';

import ProfileForm from '@/components/profile/ProfileForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    loadUser();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">Your Profile</h1>
            
            <div className="mb-8 p-4 bg-amber-50 rounded-lg">
              <h2 className="text-xl font-semibold text-amber-900 mb-4">Account Information</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email verified:</span>{' '}
                  {user?.email_confirmed_at ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Last sign in:</span>{' '}
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-amber-900 mb-6">Edit Profile Details</h2>
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
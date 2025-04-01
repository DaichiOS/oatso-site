'use client';

import type { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        () => {
          // Refetch users when any change occurs
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error fetching users');
    } finally {
      setLoading(false);
    }
  }

  async function updateUserRole(userId: string, role: 'user' | 'admin') {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error updating user role');
    }
  }

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="grid gap-4">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="p-4 border rounded-lg shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{user.full_name || 'No name'}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={user.role || 'user'}
                onChange={(e) => updateUserRole(user.id, e.target.value as 'user' | 'admin')}
                className="rounded border p-1"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
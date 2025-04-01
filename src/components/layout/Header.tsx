'use client';

import SignOutButton from '@/components/auth/SignOutButton';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-900">
          Oatso
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/profile" 
            className="text-gray-600 hover:text-amber-600 transition-colors"
          >
            Profile
          </Link>
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
} 
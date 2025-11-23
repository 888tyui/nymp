'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to builder
    router.push('/builder');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">nym</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}



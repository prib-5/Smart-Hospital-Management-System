
'use client';

import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/layout/navbar';
import { LoginForm } from '@/components/auth/login-form';
import { useState, useEffect } from 'react';
import { Skeleton } from "../ui/skeleton";


export function AppClientShell({
  children,
}) {
  const [authUser, setAuthUser] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const storedUser = localStorage.getItem('authUser_medibook');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('authUser_medibook');
      }
    }
  }, []);

  const handleAuthSuccess = (user) => {
    setAuthUser(user);
    localStorage.setItem('authUser_medibook', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem('authUser_medibook');
    // Optionally redirect to login or home page after logout
    // router.push('/'); 
  };

  return (
    <>
      <Navbar 
        isLoggedIn={!!authUser} 
        username={authUser?.name || null} 
        email={authUser?.email || null} 
        onLogout={handleLogout} 
      />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {!hasMounted ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4">
            <Skeleton className="h-12 w-1/2 rounded-md" />
            <Skeleton className="h-8 w-1/3 rounded-md" />
            <Skeleton className="h-32 w-full max-w-md rounded-lg" />
            <p className="text-lg text-muted-foreground">Loading MediBook...</p>
          </div>
        ) : !authUser ? (
          <LoginForm onAuthSuccess={handleAuthSuccess} />
        ) : (
          children
        )}
      </main>
      <Toaster />
    </>
  );
}

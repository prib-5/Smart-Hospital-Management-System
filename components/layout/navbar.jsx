
'use client';

import Link from 'next/link';
import { Hospital, UserCircle, LogOut, CalendarCheck, FlaskConical, Pill, FileText, Video, Star, UserCog, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export function Navbar({ isLoggedIn, username, email, onLogout, appName = "MediBook" }) {
  const profileItems = [
    { label: 'My Appointments', href: '/profile/appointments', icon: CalendarCheck },
    { label: 'My Tests', href: '/profile/tests', icon: FlaskConical },
    { label: 'My Medicine Orders', href: '/profile/medicine-orders', icon: Pill },
    { label: 'My Medical Records', href: '/profile/medical-records', icon: FileText },
    { label: 'My Online Consultations', href: '/profile/online-consultations', icon: Video },
    { label: 'My Feedback', href: '/profile/feedback', icon: Star },
    { label: 'View / Update Profile', href: '/profile/view-update', icon: UserCog },
    { label: 'Settings', href: '/profile/settings', icon: Settings },
  ];

  return (
    <nav className="bg-card shadow-md py-3 px-4 md:px-8 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Hospital className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">{appName}</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0" aria-label="My Profile">
                  <UserCircle className="h-7 w-7 text-secondary" />
                  {username && <span className="text-sm font-medium text-foreground hidden sm:inline">{username}</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="font-semibold">{username || 'User Profile'}</div>
                  {email && <div className="text-xs text-muted-foreground">{email}</div>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profileItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                    <Link href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            null
          )}
        </div>
      </div>
    </nav>
  );
}

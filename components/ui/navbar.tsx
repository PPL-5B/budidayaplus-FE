'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';

// Import Heroicons
import { CheckCircleIcon, UserIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon as CheckCircleIconOutline, UserIcon as UserIconOutline } from '@heroicons/react/24/outline';
import { Home, Fish } from 'lucide-react';

const menuItems = [
  { name: 'Beranda', href: '/', icon: Home, activeIcon: Home },
  { name: 'Kolam', href: '/pond', icon: Fish, activeIcon: Fish },
  { name: 'Tugas', href: '/task', icon: CheckCircleIconOutline, activeIcon: CheckCircleIcon },
  { name: 'Profil', href: '/profile', icon: UserIconOutline, activeIcon: UserIcon },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useProfile();
  const username = profile?.user.phone_number || '';

  const handleNavigation = (href: string) => {
    router.push(href === '/profile' ? `/profile/${username}` : href);
  };

  return (
    <div className="flex justify-center items-center gap-7 bg-[#EAF0FF] px-4 py-3 w-full h-full">
      {menuItems.map((item) => {
        const isActive = pathname === item.href ||
          (item.href === '/profile' && pathname.startsWith('/profile'));
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <button
            key={item.name}
            type="button"
            onClick={() => handleNavigation(item.href)}
            className={`w-16 flex flex-col items-center cursor-pointer ${isActive ? 'text-blue-700' : 'text-neutral-600'}`}
          >
            {/* Icon */}
            <Icon className="w-6 h-6" />

            {/* Text */}
            <div className="text-xs font-medium mt-1">
              {item.name}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Navbar;
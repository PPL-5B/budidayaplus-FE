'use client';

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  const hideNavbarRoutes = [
    "/auth/login", 
    "/auth/register",
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (shouldHideNavbar) {
    return null; 
  }

  return (
    <div className="fixed bottom-0 w-full max-w-[390px] mx-auto left-0 right-0 h-20 bg-[#EAF0FF] z-50 border-t border-gray-200">
      <Navbar />
    </div>
  );
}

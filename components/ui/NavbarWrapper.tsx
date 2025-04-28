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
    <div className="fixed bottom-0 w-full max-w-[390px] h-16 bg-[#2154C5] z-50">
      <Navbar />
    </div>
  );
}
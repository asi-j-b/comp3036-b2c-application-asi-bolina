"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import { LeftMenu } from "../Menu/LeftMenu";
import { Content } from "../Content";
import { SidebarContext } from "@/context/SidebarContext";
import { mockProducts } from "@repo/db/data";

export function AppLayoutClient({
  children,
}: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const syncSidebar = (event?: MediaQueryListEvent) => {
      if ((event?.matches ?? mediaQuery.matches)) {
        setSidebarOpen(false);
      }
    };

    syncSidebar();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncSidebar);

      return () => mediaQuery.removeEventListener("change", syncSidebar);
    }

    mediaQuery.addListener(syncSidebar);

    return () => mediaQuery.removeListener(syncSidebar);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen: sidebarOpen, toggle: () => setSidebarOpen(!sidebarOpen) }}>
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <LeftMenu isOpen={sidebarOpen} products={mockProducts} />
        <Content>
          {children}
        </Content>
      </div>
    </SidebarContext.Provider>
  );
}

"use client";

import { useState, type PropsWithChildren } from "react";
import { LeftMenu } from "../Menu/LeftMenu";
import { Content } from "../Content";
import { SidebarContext } from "@/context/SidebarContext";
import { mockProducts } from "@repo/db/data";

export function AppLayoutClient({
  children,
}: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen: sidebarOpen, toggle: () => setSidebarOpen(!sidebarOpen) }}>
      <div className="flex min-h-screen w-full flex-col">
        <LeftMenu isOpen={sidebarOpen} products={mockProducts} />
        <Content>
          {children}
        </Content>
      </div>
    </SidebarContext.Provider>
  );
}

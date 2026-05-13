"use client";

import { useState, type PropsWithChildren } from "react";
import { LeftMenu } from "../Menu/LeftMenu";
import { Content } from "../Content";
import { SidebarContext } from "@/context/SidebarContext";

export function AppLayoutClient({
  children,
}: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen: sidebarOpen, toggle: () => setSidebarOpen(!sidebarOpen) }}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        <LeftMenu isOpen={sidebarOpen} />
        <Content>
          {children}
        </Content>
      </div>
    </SidebarContext.Provider>
  );
}

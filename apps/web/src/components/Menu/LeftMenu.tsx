"use client";

import { products } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import { useSidebarContext } from "@/context/SidebarContext";

export function LeftMenu({ isOpen }: { isOpen?: boolean }) {
  const { toggle } = useSidebarContext();

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Close sidebar overlay"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] overflow-y-auto border-r border-[var(--ring)] bg-[var(--surface-muted)] shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-wsu text-sm font-bold text-white">
            W
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">Full Stack Store</h1>
          <button
            onClick={toggle}
            className="rounded-md border border-[var(--ring)] px-2 py-1 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu"
            aria-label="Close menu"
          >
            X
          </button>
        </div>

        <nav className="px-4 pb-6">
          <ul role="list" className="space-y-1">
            <CategoryList products={products} />
            <HistoryList products={products} />
            <TagList products={products} />
          </ul>
        </nav>
      </aside>
    </>
  );
}

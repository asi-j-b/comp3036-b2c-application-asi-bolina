"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${search}`);
    },
  );

  return (
    <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form action="#" method="GET" className="grid flex-1 grid-cols-1">
          <label htmlFor="search" className="sr-only">
            Search posts
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
              ⌕
            </span>
            <input
              id="search"
              type="search"
              name="search"
              placeholder="Search"
              defaultValue={query}
              onChange={handleSearch}
              className="w-full max-w-md rounded-lg border border-gray-200 bg-[var(--surface)] py-2 pl-9 pr-4 text-sm text-primary outline-none transition focus:border-gray-400"
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-x-3">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}

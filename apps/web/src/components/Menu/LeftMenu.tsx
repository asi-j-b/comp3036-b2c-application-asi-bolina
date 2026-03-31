import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  return (
    <aside className="w-full border-b border-gray-200 bg-[var(--surface-muted)] lg:h-screen lg:w-[290px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-wsu text-sm font-bold text-white">
          W
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-primary">Full Stack Blog</h1>
      </div>

      <nav className="px-4 pb-6">
        <ul role="list" className="space-y-1">
          <CategoryList posts={posts} />
          <HistoryList posts={posts} />
          <TagList posts={posts} />
        </ul>
      </nav>
    </aside>
  );
}

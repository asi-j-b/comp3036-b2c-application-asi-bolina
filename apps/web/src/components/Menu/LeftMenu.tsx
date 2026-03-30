import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  return (
    <div>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div></div>
        <nav>
          <ul role="list" className="...">
            <CategoryList posts={posts} />
            <TagList posts={posts} />
            <HistoryList posts={posts} />
          </ul>
        </nav>
    </div>
  );
}

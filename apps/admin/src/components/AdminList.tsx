import { AdminFilters } from "./AdminFilters"; // The URL update logic we discussed
import styles from "./AdminList.module.css";

interface Post {
  id: number;
  title: string;
  category: string;
  tags: string;
  active: boolean;
}

export function AdminList({ posts }: { posts: Post[] }) {
  return (
    <section>
      {/* This contains the inputs for 'query' and 'tag' */}
      <AdminFilters />

      <div className={styles.grid}>
        {posts.length === 0 ? (
          <p>No posts found matching your criteria.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className={styles.card}>
              <h2>{post.title}</h2>
              <p>Category: {post.category}</p>
              <p>Tags: {post.tags}</p>
              <div className={styles.controls}>
                <button>{post.active ? "Active" : "Inactive"}</button>
                <button>Edit</button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
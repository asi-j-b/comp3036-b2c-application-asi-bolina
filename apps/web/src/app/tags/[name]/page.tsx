import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;
    const tagName = name.toLowerCase();

    const filteredPosts = posts.filter((post) => {
    const tagName = name.toLowerCase();
    // We split the tags string and check each one
    const postTags = post.tags.split(",").map(t => toUrlPath(t.trim()));
    
    return post.active && postTags.includes(tagName);
    });

    return (
        <AppLayout>
            <Main posts={filteredPosts} />
        </AppLayout>
    );
}
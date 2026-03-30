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
        // 1. Must be active
        // 2. Split tags string and check if any tag matches the URL name
        return (
            post.active &&
            post.tags
                .split(",")
                .some((tag) => toUrlPath(tag.trim()) === tagName)
        );
    });

    return (
        <AppLayout>
            <Main posts={filteredPosts} />
        </AppLayout>
    );
}
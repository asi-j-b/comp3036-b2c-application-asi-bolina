import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { products } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;

    const filteredProducts = products.filter((product) => {
    const tagName = name.toLowerCase();
    // We split the tags string and check each one
    const productTags = product.tags.split(",").map(t => toUrlPath(t.trim()));
    
    return product.active && productTags.includes(tagName);
    });

    return (
        <AppLayout>
            <Main products={filteredProducts} />
        </AppLayout>
    );
}
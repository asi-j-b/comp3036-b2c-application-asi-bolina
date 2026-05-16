import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { mockProducts } from "@repo/db/data";

export default async function Page({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;

    const filteredProducts = mockProducts.filter((product) => {
    const tagName = name.toLowerCase();
    
    return product.active;
    });

    return (
        <AppLayout>
            <Main products={filteredProducts} />
        </AppLayout>
    );
}
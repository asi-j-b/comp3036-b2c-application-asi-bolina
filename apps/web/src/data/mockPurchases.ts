import { mockProducts, type Product } from "./mockProducts";

export type PurchaseRecordItem = {
  product: Product;
  quantity: number;
  price: number;
};

export type PurchaseRecord = {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
  items: PurchaseRecordItem[];
};

function productById(id: number) {
  const product = mockProducts.find((item) => item.id === id);

  if (!product) {
    throw new Error(`Missing mock product ${id}`);
  }

  return product;
}

export const mockPurchases: PurchaseRecord[] = [
  {
    id: "PO-1007",
    date: "2025-05-12",
    status: "Delivered",
    items: [
      { product: productById(1), quantity: 1, price: 219 },
      { product: productById(7), quantity: 2, price: 39 },
    ],
  },
  {
    id: "PO-1008",
    date: "2025-05-20",
    status: "Shipped",
    items: [
      { product: productById(4), quantity: 1, price: 129 },
      { product: productById(6), quantity: 1, price: 52 },
    ],
  },
  {
    id: "PO-1009",
    date: "2025-06-03",
    status: "Processing",
    items: [{ product: productById(2), quantity: 1, price: 349 }],
  },
];

export function getPurchaseTotal(purchase: PurchaseRecord) {
  return purchase.items.reduce((total, item) => total + item.price * item.quantity, 0);
}

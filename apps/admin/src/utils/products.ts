export type AdminProducts = {
  id: number;
  urlId: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  price: number;
  category: string;
  tags: string;
  active: boolean;
};

const content = `
  # Title 1

  Illo **sint voluptas**. Error voluptates culpa eligendi.
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde.
  Sed exercitationem placeat consectetur nulla deserunt vel
  iusto corrupti dicta laboris incididunt.

  ## Subtitle 1

  Illo sint *voluptas*. Error voluptates culpa eligendi.
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde.
  Sed exercitationem placeat consectetur nulla deserunt vel
  iusto corrupti dicta laboris incididunt.
`;

const description = `Illo sint voluptas. Error voluptates culpa eligendi.
Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde.
Sed exercitationem placeat consectetur nulla deserunt vel
iusto corrupti dicta laboris incididunt.`;

const products: AdminProducts[] = [
  {
    id: 1,
    title: "Boost your conversion rate",
    urlId: "boost-your-conversion-rate",
    description,
    content: content + " ... post1",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    category: "Node",
    tags: "Back-End,Databases",
    price: 29.99,
    active: true,
  },
  {
    id: 2,
    title: "Better front ends with Fatboy Slim",
    urlId: "better-front-ends-with-fatboy-slim",
    description,
    content: content + " ... post2",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "React",
    tags: "Front-End,Optimisation",
    price: 39.99,
    active: true,
  },
  {
    id: 3,
    title: "No front end framework is the best",
    urlId: "no-front-end-framework-is-the-best",
    description,
    content: content + " ... post3",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "React",
    tags: "Front-End,Dev Tools",
    price: 29.99,
    active: true,
  },
  {
    id: 4,
    title: "Visual Basic is the future",
    urlId: "visual-basic-is-the-future",
    description,
    content: content + " ... post4",
    imageUrl: "https://m.media-amazon.com/images/I/51NqEfmmBTL.jpg",
    category: "React",
    tags: "Programming,Mainframes",
    price: 29.99,
    active: false,
  },
];

function cloneProduct(product: AdminProducts): AdminProducts {
  return {
    ...product,
  };
}

export function getAllProducts(): AdminProducts[] {
  return products
    .map(cloneProduct)
    .sort((a, b) => b.price - a.price);
}

export function getProductByUrlId(urlId: string): AdminProducts | undefined {
  const found = products.find((product) => product.urlId === urlId);
  return found ? cloneProduct(found) : undefined;
}

# System Audit & B2C Pivot Plan
**Blog Application → B2C Store Application**

---

## 📊 EXECUTIVE SUMMARY
Current State: Next.js monorepo with fully functional Blog application (Posts, Likes, Categories, Tags)
Target State: B2C Store application (Products, Shopping Cart, Purchases, Admin Inventory)
Strategy: Minimize disruption by reusing Auth/JWT infrastructure while replacing domain logic incrementally

---

## PART 1: BLOG CLEANUP LIST
### Files with Post/Like References (Must Be Refactored)

#### **Database Schema** (packages/db/prisma/schema.prisma)
```
CURRENT:
  - model Post (id, urlId, title, description, content, category, imageUrl, date, views, active, Likes[])
  - model Like (postId, userIP, Post relation)

REPLACE WITH:
  - model Product (id, slug, name, description, price, category, imageUrl, stock, sku)
  - model Cart (id, userId, items[], createdAt, updatedAt)
  - model Purchase (id, userId, items[], total, status, createdAt)
  - model PurchaseItem (id, purchaseId, productId, quantity, price)
```

#### **Web App - Frontend Components** (apps/web/src/components/Blog/)
| File | Current Purpose | B2C Replacement |
|------|-----------------|-----------------|
| Blog/List.tsx | Display post list | ProductGrid.tsx - Display products |
| Blog/ListItem.tsx | Single post card | ProductCard.tsx - Single product card |
| Blog/Detail.tsx | Post detail page | ProductDetail.tsx - Product detail with reviews |
| Blog/LikeButton.tsx | Like/Unlike post | AddToCartButton.tsx - Add to cart |

#### **Web App - Route Pages** (apps/web/src/app/)
| Route | Current | B2C Replacement |
|-------|---------|-----------------|
| /post/[id] | Blog post detail | /product/[id] - Product detail page |
| /posts | (implied) All posts | /products - Product listing |
| /category/[name] | Posts by category | /category/[name] - Products by category |
| /search | Search posts | /search - Search products |
| /tags/[tag] | Posts by tag | (Optional) Keep or remove |

#### **Web App - API Routes** (apps/web/src/app/api/)
| Route | Current | B2C Replacement |
|-------|---------|-----------------|
| /api/likes [POST] | Like/Unlike post | /api/cart [POST] - Add to cart |
| /api/seed [GET] | Seed blog data | /api/seed - Seed product data |

#### **Admin App - Components** (apps/admin/src/components/)
| File | Current Purpose | B2C Replacement |
|------|-----------------|-----------------|
| AdminList.tsx | Admin post list UI | AdminInventory.tsx - Inventory management |
| PostEditorForm.tsx | Create/Edit posts | ProductEditorForm.tsx - Create/Edit products |

#### **Admin App - API Routes** (apps/admin/src/app/api/)
| Route | Current | B2C Replacement |
|-------|---------|-----------------|
| /api/posts [POST] | Create post | /api/products [POST] - Create product |
| /api/posts [GET] | List posts | /api/products [GET] - List products |
| /api/posts/[id] [DELETE] | Delete post | /api/products/[id] [DELETE] - Delete product |
| /api/posts/[id] [PUT] | Update post | /api/products/[id] [PUT] - Update product |

#### **Data Types** (packages/db/src/data.ts)
```
CURRENT: Post[] mock data export
REPLACE: Product[] mock data export
```

---

## PART 2: REUSABLE TEMPLATES (Keep As-Is)
### Files That Don't Change (Auth Layer is Universal)

#### **Authentication & Authorization** ✅ REUSABLE
- **packages/env/admin.ts** → JWT_SECRET, PASSWORD env config
- **apps/admin/src/utils/auth.ts** → isLoggedIn() utility (JWT verification)
- **apps/admin/src/app/api/auth/route.ts** → POST/DELETE auth endpoints
  - JWT token generation/validation
  - HTTP-only cookie management
  - 24h expiration
  - Same auth flow works for B2C admin portal

#### **Middleware/Security** ✅ REUSABLE
- JWT verification pattern (no changes needed)
- Cookie-based session storage (secure, httpOnly, sameSite)
- IP tracking pattern from `getRequestIp()` function (can be reused for admin audit logs)

#### **Environment Configuration** ✅ REUSABLE
- **@repo/env** package structure (admin.ts, web.ts)
- T3 Env pattern for runtime validation
- Can extend with new vars (e.g., STRIPE_KEY, PAYMENT_WEBHOOK_SECRET)

#### **Database Client** ✅ REUSABLE
- **packages/db/src/client.ts** → Prisma singleton pattern
- Connection pooling logic
- Global client initialization

#### **Folder Structure** ✅ REUSABLE
```
apps/web/src/
  ├── app/             ← Page routes (modify content, keep structure)
  ├── components/      ← Component library (replace Blog/ with Products/)
  ├── data/            ← Mock data (replace posts with products)
  └── utils/           ← Utilities (create products.ts as needed)

apps/admin/src/
  ├── app/api/         ← Admin endpoints (pattern reusable)
  ├── utils/auth.ts    ← JWT logic (reusable)
  └── components/      ← Admin UI (replace PostEditorForm with ProductForm)

packages/db/
  ├── prisma/          ← Schema (UPDATE schema, keep structure)
  └── src/             ← Types & client (modify Post type, create Product type)
```

---

## PART 3: B2C MAPPING - FEATURE TRANSFORMATION

### Core Feature Mapping

#### **1. Discovery / Browsing**
| Blog Feature | Implementation | B2C Feature | Implementation |
|--------------|-----------------|-------------|-----------------|
| Blog posts list `/post` | BlogList + BlogListItem | Product listing `/products` | ProductGrid + ProductCard |
| Category filtering `/category/[name]` | Filter by category field | Category filtering `/category/[name]` | Filter by product category |
| Search `/search` | Search title + content | Search `/search` | Search product name + description |
| Tag filtering `/tags/[tag]` | Filter by tags field | *Optional: Keep or remove* | Could map to product tags |

#### **2. Detail Pages**
| Blog Feature | Implementation | B2C Feature | Implementation |
|--------------|-----------------|-------------|-----------------|
| Post detail `/post/[id]` | Server-side fetch, increment views | Product detail `/product/[id]` | Server-side fetch, track views/impressions |
| Like button | Client-side + API call | Add to cart button | Client-side + API call |
| Like count display | Real-time via fetch | Stock/Availability display | Real-time via fetch |

#### **3. User Interaction**
| Blog Feature | Implementation | B2C Feature | Implementation |
|--------------|-----------------|-------------|-----------------|
| Like/Unlike (IP-based) | POST /api/likes | Add/Remove from cart | POST /api/cart |
| View count | Increment on page load | Stock tracking | Decrement on purchase |
| *Not implemented* | — | Purchase history | New: GET /api/purchases |

#### **4. Admin Management**
| Blog Feature | Implementation | B2C Feature | Implementation |
|--------------|-----------------|-------------|-----------------|
| Create post | POST /api/posts | Create product | POST /api/products |
| Edit post | PUT /api/posts/[id] | Edit product | PUT /api/products/[id] |
| Delete post | DELETE /api/posts/[id] | Delete product | DELETE /api/products/[id] |
| List posts | Admin page + AdminList | List products | Admin page + InventoryList |
| Status toggle (active/inactive) | Toggle active field | Stock status | Track inventory levels |

---

## PART 4: DETAILED B2C PIVOT ROADMAP

### Phase 1: Foundation (Before Iteration 1 Starts)
**Objective:** Set up mock data bridge without touching database

#### Step 1.1: Create Mock Data Layer
- **Location:** `apps/web/src/data/mockProducts.ts`
- **Purpose:** Define Product interface and static products
- **Content:**
  ```typescript
  export type Product = {
    id: number;
    slug: string;           // URL-friendly ID (electronics-laptop-01)
    name: string;
    description: string;
    price: number;
    category: string;       // "Electronics", "Clothing", etc.
    imageUrl: string;
    stock: number;
    sku: string;            // Unique product code
  }
  ```
- **Example Data:** 5-8 products across 2-3 categories
- **Why This Works:** Identical structure to what Prisma will use later

#### Step 1.2: Document Product Type Interface
- **Location:** `packages/db/src/` (create `types.ts` or update `data.ts`)
- **Content:** Export the Product type for import across apps
- **Benefit:** Single source of truth for product shape

#### Step 1.3: Update Database Schema (Prepare, Don't Run Migration Yet)
- **Location:** `packages/db/prisma/schema.prisma`
- **Changes:**
  - Add Product model with all fields
  - Add Cart, Purchase, PurchaseItem models
  - Keep Post and Like models for now (gradual migration)
- **Status:** Prepared but migration deferred to Iteration 2
- **Why:** Keeps blog functionality intact; clear separation

---

### Phase 2: Iteration 1 Frontend Development (Baby Steps)

#### Step 2.1: Product Card & Grid Components
- **Location:** `apps/web/src/components/Products/`
- **New Files:**
  - ProductCard.tsx (copy Blog/ListItem structure, adapt for products)
  - ProductGrid.tsx (copy Blog/List structure, adapt for products)
- **Key Differences from Blog:**
  - Display price instead of date
  - Show stock status instead of like count
  - Highlight "Add to Cart" button instead of "Like"

#### Step 2.2: Category & Search Filtering Logic
- **Location:** `apps/web/src/components/Products/` + `apps/web/src/app/`
- **Reuse:** Category filtering logic from `/category/[name]`
- **Adapt:** Filter by `product.category` instead of `post.category`
- **New Routes:**
  - `/products` — Main product listing
  - `/category/[category]` — Products by category
  - `/search?q=...` — Search products

#### Step 2.3: Shopping Cart State Management (React Context or Hook)
- **Location:** `apps/web/src/components/Cart/` or `apps/web/src/hooks/`
- **New Files:**
  - `useCart.ts` — Custom hook managing cart state
  - `CartContext.tsx` — (Optional) Context wrapper if needed
- **Storage:** localStorage for Iteration 1 (JSON serialization)
- **State:**
  ```typescript
  type CartItem = { productId: number; quantity: number; price: number };
  type Cart = { items: CartItem[]; total: number };
  ```

#### Step 2.4: Cart UI Components
- **Location:** `apps/web/src/components/Cart/`
- **New Files:**
  - CartIcon.tsx — Header cart button with count badge
  - CartDropdown.tsx — (Optional) Quick view of cart
  - CartPage.tsx — Full cart review page

#### Step 2.5: Product Detail Page
- **Location:** `apps/web/src/app/product/[slug]/page.tsx`
- **Reuse:** `/post/[id]/page.tsx` structure
- **Adapt:** Fetch product instead of post, show price + stock
- **UI:** "Add to Cart" button instead of like

#### Step 2.6: Checkout Flow (Mock Payment)
- **Location:** `apps/web/src/app/checkout/`
- **New Files:**
  - `page.tsx` — Checkout form (shipping, payment info mock)
  - `confirmation/page.tsx` — Order confirmation
- **Mock Payment:** "Confirm Order" button shows success message

---

### Phase 3: API Routes for Iteration 1 (Mock/localStorage)
**Note:** For Iteration 1, these may just be stubs or use localStorage only.

#### Step 3.1: Cart API Endpoint
- **Location:** `apps/web/src/app/api/cart/route.ts`
- **Iteration 1:** Simple endpoint that mirrors client-side cart state
- **POST /api/cart:** Add item to cart (logs to console, returns success)
- **DELETE /api/cart:** Remove item (optional)
- **Why:** Prepares you for database-backed cart in Iteration 2

#### Step 3.2: Products API Endpoint
- **Location:** `apps/web/src/app/api/products/route.ts`
- **Iteration 1:** Returns mock data from `mockProducts.ts`
- **GET /api/products:** Returns all products with optional filters
- **Why:** Same endpoint will query Prisma in Iteration 2

---

### Phase 4: Testing Strategy (No CI Yet)

#### Step 4.1: E2E Test Scaffolding
- **Location:** `tests/playwright/tests/web/`
- **New Tests:**
  - `products.spec.ts` — Product listing, filtering, search
  - `cart.spec.ts` — Add/remove items, cart persistence
  - `checkout.spec.ts` — Checkout flow

#### Step 4.2: Example Test Pattern
```typescript
test('should display products on listing page', async ({ page }) => {
  await page.goto('/products');
  const products = await page.locator('[data-testid="product-card"]').count();
  expect(products).toBeGreaterThan(0);
});

test('should filter products by category', async ({ page }) => {
  await page.goto('/products');
  await page.click('text=Electronics');
  const electronics = await page.locator('[data-testid="product-card"]').all();
  // Verify all shown products have category "Electronics"
});

test('should add product to cart and update header count', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('button', { name: /add to cart/i }).first().click();
  const cartCount = page.getByTestId('cart-count');
  await expect(cartCount).toHaveText('1');
});
```

---

### Phase 5: Admin Portal Changes (Iteration 1 Stub)

#### Step 5.1: Admin Routes
- **Location:** `apps/admin/src/app/`
- **Current:** `/post` and `/posts` pages
- **New (Stub):** `/product` and `/products` pages (same UI structure, different data source)

#### Step 5.2: API Adaptations
- **Current:** `/api/posts`, `/api/posts/[id]`
- **Iteration 1:** Create `/api/products`, `/api/products/[id]` endpoints
- **Behavior:** Return mock data for now (same as web)
- **Why:** Sets up the admin-backend contract early

---

### Phase 6: Iteration 2+ Roadmap (Database & Auth)

#### Iteration 2 Tasks:
1. Run Prisma migration to add Product, Cart, Purchase models
2. Update `/api/products` to query Prisma instead of mock data
3. Implement real cart persistence in database (tied to userId)
4. Add user authentication to web app (currently optional)
5. Implement purchase history and order tracking

#### Iteration 3+ Tasks:
1. Payment gateway integration (Stripe/PayPal mock)
2. Admin dashboard with charts and analytics
3. Email notifications
4. Image upload to cloud storage
5. Advanced filtering (price range, ratings)

---

## PART 5: DETAILED CLEANUP CHECKLIST

### Files to Refactor (Priority Order)

#### 🔴 HIGH PRIORITY (Delete or Transform First)
```
├── packages/db/prisma/schema.prisma
│   └── Remove: Post, Like models
│       Add: Product, Cart, Purchase, PurchaseItem models
│
├── apps/web/src/components/Blog/
│   ├── List.tsx → ProductGrid.tsx (rename, change post→product)
│   ├── ListItem.tsx → ProductCard.tsx (rename, change post→product)
│   ├── Detail.tsx → ProductDetail.tsx (rename)
│   ├── LikeButton.tsx → DELETE (no likes in store)
│   └── (tests) → Update all test files accordingly
│
├── apps/web/src/app/post/[id]/page.tsx
│   → Refactor to product/[slug]/page.tsx
│       - Fetch by slug instead of urlId
│       - Show product details instead of blog content
│
├── apps/admin/src/components/
│   ├── AdminList.tsx → AdminInventory.tsx
│   ├── PostEditorForm.tsx → ProductEditorForm.tsx
│       (same structure, different fields)
│
├── apps/admin/src/app/api/posts/
│   → apps/admin/src/app/api/products/
│       (copy structure, adapt to products)
```

#### 🟡 MEDIUM PRIORITY (Update but Keep Structure)
```
├── apps/web/src/app/category/[name]/
│   └── Keep structure, adapt to filter products by category
│
├── apps/web/src/app/search/
│   └── Keep structure, adapt to search products
│
├── packages/db/src/data.ts
│   └── Replace posts: Post[] with products: Product[]
│       Export Product type
│
├── apps/web/src/app/api/likes/route.ts
│   → apps/web/src/app/api/cart/route.ts
│       (similar pattern, different domain)
```

#### 🟢 LOW PRIORITY (No Changes, Reuse)
```
├── apps/admin/src/utils/auth.ts ✓ Reuse
├── apps/admin/src/app/api/auth/route.ts ✓ Reuse
├── packages/env/ ✓ Reuse (extend if needed)
├── packages/db/src/client.ts ✓ Reuse
├── Folder structures ✓ Reuse
```

---

## PART 6: IMPLEMENTATION TIMELINE ESTIMATE

| Phase | Scope | Estimated Effort | Blockers |
|-------|-------|------------------|----------|
| Phase 1 (Setup) | Mock data, schema prep | 1-2 hours | None |
| Phase 2 (Frontend) | Components, routing, UI | 8-12 hours | Asset design, copy |
| Phase 3 (API Stubs) | Mock endpoints | 2-3 hours | Phase 1 completion |
| Phase 4 (Tests) | E2E test suite | 4-6 hours | Phase 2 completion |
| Phase 5 (Admin) | Admin UI + API | 4-6 hours | Phase 1-2 completion |
| **Total Iteration 1** | **Mock frontend ready** | **20-30 hours** | None expected |

---

## PART 7: RISK MITIGATION

### Risk: Breaking existing blog functionality during pivot
**Mitigation:** Keep Post/Like models in Prisma initially; add Product models alongside. Migrate data/references in Phase 2.

### Risk: Inconsistent naming between products/posts
**Mitigation:** Create unified types in `packages/db/src/` early. Use consistent naming conventions in components.

### Risk: Cart state gets lost on page refresh (localStorage)
**Mitigation:** For Iteration 1, this is acceptable UX. Add warning toast ("Your cart will clear on refresh"). Upgrade in Iteration 2 with database persistence.

### Risk: E2E tests fail due to mock data structure changes
**Mitigation:** Create test fixtures that mirror mock data exactly. Update both together when changing product schema.

---

## SUMMARY: FILE ORGANIZATION FOR B2C

```
Current (Blog):
apps/web/
├── components/Blog/
├── app/post/[id]/
├── app/category/[name]/
├── app/api/likes/

Target (B2C Store):
apps/web/
├── components/
│   ├── Blog/ ← Keep for now (Phase 2: Delete)
│   ├── Products/ ← NEW (Phase 2: Create)
│   ├── Cart/ ← NEW (Phase 2: Create)
│   └── ...
├── app/
│   ├── post/ ← Keep for now (Phase 2: Delete)
│   ├── product/ ← NEW (Phase 2: Create)
│   ├── products/ ← NEW (Phase 2: Create)
│   ├── cart/ ← NEW (Phase 2: Create)
│   ├── checkout/ ← NEW (Phase 2: Create)
│   ├── category/[name]/ ← Keep, adapt
│   ├── search/ ← Keep, adapt
│   └── api/
│       ├── likes/ ← Delete (Phase 2)
│       ├── cart/ ← NEW (Phase 1)
│       └── products/ ← NEW (Phase 1)
├── data/
│   └── mockProducts.ts ← NEW (Phase 1)
│       
apps/admin/
├── app/api/products/ ← NEW (copy /posts structure)
└── components/
    ├── ProductEditorForm.tsx ← NEW (copy PostEditorForm)
    └── AdminInventory.tsx ← NEW (copy AdminList)
```

---

## FINAL NOTES FOR ITERATION 1

✅ **Focus:** Frontend UI + Mock Data  
✅ **Backend:** Minimal (mock endpoints only)  
✅ **Database:** No changes yet  
✅ **Auth:** Reuse existing JWT infrastructure  
✅ **Testing:** E2E test skeleton with mock data  

✗ **Not Doing:** Real database queries, user persistence, payment processing  

This setup positions you to add real database/backend in Iteration 2 with minimal UI refactoring.

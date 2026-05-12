# B2C Store Application - QUICK REFERENCE & SUMMARY

## 📍 WHERE TO FIND EACH DOCUMENT

| Document | Location | Purpose |
|----------|----------|---------|
| **System Audit** | SYSTEM_AUDIT_B2C_PIVOT.md | Complete codebase analysis: what changes, what reuses, file-by-file mapping |
| **GitHub Issues** | ITERATION_1_GITHUB_ISSUES_ROADMAP.md | Detailed GitHub issue templates with acceptance criteria for all features |
| **Phase Breakdown** | ITERATION_1_PHASE_BREAKDOWN.md | Week-by-week implementation timeline with specific tasks and deliverables |
| **THIS FILE** | QUICK_REFERENCE.md | High-level summary for quick lookup |

---

## 🎯 EXECUTIVE SUMMARY (2-Minute Read)

### Current State
- **Blog Application:** Posts, Likes, Categories, Tags
- **Tech Stack:** Next.js, Prisma (SQLite), JWT Auth, TailwindCSS

### Pivot Goal
- **B2C Store Application:** Products, Shopping Cart, Purchases, Checkout
- **Keep All:** Auth infrastructure, folder structure, monorepo setup
- **Replace:** Post → Product, Like → Cart, Blog models → E-commerce models

### Iteration 1 Strategy (Frontend-First)
1. Create mock product data (`mockProducts.ts`)
2. Build product browsing UI (list, search, filter, detail)
3. Implement shopping cart with localStorage persistence
4. Add checkout flow with mock payment
5. Write E2E tests for all user flows
6. **No database changes yet** — all data is static/localStorage

### Timeline
- **Iteration 1:** 4-5 weeks (30-40 hours)
  - Week 1: Setup + Core UI
  - Week 2: Cart + Filtering
  - Week 3: Detail Pages + Checkout
  - Week 4: Testing + Polish
  
- **Iteration 2:** 2-3 weeks (real database, auth, purchase history)
- **Iteration 3:** 2-3 weeks (payment integration, admin dashboard, deployment)

---

## 📁 FILES TO CHANGE (Priority Order)

### 🔴 CREATE (New Files Needed)
```
apps/web/src/
  data/
    └── mockProducts.ts ← Product interface + static data
  components/Products/
    ├── ProductCard.tsx
    ├── ProductGrid.tsx
    ├── ProductDetail.tsx
    ├── SearchInput.tsx
    └── CategoryFilter.tsx
  components/Cart/
    ├── CartIcon.tsx
    ├── CartPage.tsx
    ├── CheckoutForm.tsx
    └── OrderConfirmation.tsx
  hooks/
    └── useCart.ts
  app/
    ├── products/page.tsx
    ├── product/[slug]/page.tsx
    ├── cart/page.tsx
    ├── checkout/page.tsx
    └── api/products/route.ts

packages/db/src/
  └── data.ts (or types.ts - export Product, Cart types)

tests/playwright/tests/web/
  ├── products.spec.ts
  └── cart.spec.ts
```

### 🟡 MODIFY (Keep Structure, Update Content)
```
apps/web/src/
  ├── app/category/[name]/ ← Adapt from blog category filter
  ├── app/search/ ← Adapt from blog search
  ├── app/layout.tsx ← Add CartProvider + CartIcon in header
  └── app/page.tsx ← Link to /products

apps/admin/src/
  └── components/
      └── Update for product management (future)

packages/db/
  └── prisma/schema.prisma ← Plan new models (don't migrate yet)
```

### 🟢 KEEP AS-IS (No Changes Needed)
```
Auth Layer:
  ├── apps/admin/utils/auth.ts
  ├── apps/admin/api/auth/route.ts
  └── packages/env/

Database Client:
  └── packages/db/src/client.ts

Folder Structure:
  └── All existing folder patterns are reusable
```

---

## 🏗️ COMPONENT HIERARCHY

```
Layout (Updated)
  ├── Header
  │   ├── Logo/Nav
  │   └── CartIcon ← NEW
  └── MainContent

ProductsPage (/products)
  ├── SearchInput ← NEW
  ├── CategoryFilter ← NEW
  └── ProductGrid ← NEW
      └── ProductCard ← NEW (map over products)
          └── AddToCart button

ProductDetailPage (/product/[slug])
  ├── ProductDetail ← NEW
  │   ├── Image
  │   ├── Name, Price, Description
  │   └── AddToCart (with quantity)
  └── RelatedProducts ← NEW
      └── ProductCard (x3-4)

CartPage (/cart)
  ├── CartItems (map over cart state)
  │   └── CartItem (image, name, qty, remove)
  ├── CartSummary
  │   ├── Subtotal
  │   ├── Tax
  │   ├── Shipping
  │   └── Total
  └── Buttons (Continue Shopping | Checkout)

CheckoutPage (/checkout)
  ├── OrderSummary (read-only)
  ├── CheckoutForm ← NEW
  │   ├── Shipping (name, email, address)
  │   └── Payment (card, expiry, CVC)
  └── Buttons (Back | Confirm Order)

OrderConfirmationPage (/checkout/confirmation)
  ├── OrderConfirmation ← NEW
  │   ├── Order #
  │   ├── Items
  │   ├── Total
  │   └── Thank you
  └── Button (Continue Shopping)
```

---

## 🔑 KEY TYPES & INTERFACES

```typescript
// Product (mockProducts.ts + packages/db/src/data.ts)
type Product = {
  id: number;
  slug: string;           // "electronics-laptop-01"
  name: string;
  description: string;
  price: number;
  category: string;       // "Electronics", "Clothing", etc.
  imageUrl: string;
  stock: number;
  sku: string;
}

// Cart State (useCart.ts)
type CartItem = {
  productId: number;
  quantity: number;
  price: number;
}

type Cart = {
  items: CartItem[];
  total: number;
}

// useCart Hook API
{
  cart: Cart,
  addToCart: (product: Product, quantity: number) => void,
  removeFromCart: (productId: number) => void,
  updateQuantity: (productId: number, quantity: number) => void,
  clearCart: () => void,
  getCart: () => Cart,
}
```

---

## 🔗 ROUTING MAP

```
User-Facing Routes:
  GET  /                         → Home (link to /products)
  GET  /products                 → All products (searchable, filterable)
  GET  /product/[slug]           → Product detail
  GET  /category/[category]      → Products by category
  GET  /search?q=...            → Search results
  GET  /cart                     → Shopping cart review
  GET  /checkout                 → Checkout form
  GET  /checkout/confirmation    → Order confirmation

Admin Routes (Future):
  GET  /admin/products           → Product list
  GET  /admin/products/[id]      → Product detail (edit)
  POST /admin/products           → Create product
  PUT  /admin/products/[id]      → Update product
  DELETE /admin/products/[id]    → Delete product

API Routes (Backend):
  GET  /api/products             → Returns mock products (Iteration 1) or DB (Iteration 2)
  GET  /api/products?category=X  → Filter by category
  GET  /api/products?search=X    → Search products
  POST /api/cart                 → Stub (Iteration 1), real cart save (Iteration 2)
  GET  /api/purchases            → Get user's orders (Iteration 2)
  POST /api/purchases            → Create order from cart (Iteration 2)
```

---

## 📊 FILE MAPPING: BLOG → B2C

| Blog (Old) | Blog Purpose | B2C (New) | B2C Purpose |
|-----------|--------------|----------|------------|
| Blog/List.tsx | Show all posts | ProductGrid.tsx | Show all products |
| Blog/ListItem.tsx | Single post card | ProductCard.tsx | Single product card |
| Blog/Detail.tsx | Post detail page | ProductDetail.tsx | Product detail page |
| Blog/LikeButton.tsx | Like/Unlike | AddToCartButton.tsx | Add to cart |
| /post/[id] | Post detail route | /product/[slug] | Product detail route |
| /api/likes | Like/Unlike API | /api/cart | Cart API |
| AdminList.tsx | Admin post list | AdminInventory.tsx | Admin product list |
| PostEditorForm.tsx | Create/Edit posts | ProductEditorForm.tsx | Create/Edit products |

---

## 🧪 TEST EXAMPLES

### Product Listing Test
```typescript
test('should display all products on listing page', async ({ page }) => {
  await page.goto('/products');
  const products = await page.locator('[data-testid="product-card"]').count();
  expect(products).toBe(8); // or .toBeGreaterThan(0)
});
```

### Search Test
```typescript
test('should filter products by search query', async ({ page }) => {
  await page.goto('/products');
  await page.fill('[data-testid="search-input"]', 'laptop');
  const products = await page.locator('[data-testid="product-card"]').count();
  expect(products).toBeGreaterThan(0);
});
```

### Cart Persistence Test
```typescript
test('should persist cart after page refresh', async ({ page }) => {
  await page.goto('/products');
  await page.click('button:has-text("Add to Cart")');
  await page.reload();
  const cartCount = await page.locator('[data-testid="cart-count"]').textContent();
  expect(cartCount).toBe('1');
});
```

### Checkout Test
```typescript
test('should complete checkout successfully', async ({ page }) => {
  await page.goto('/checkout');
  await page.fill('[name="fullName"]', 'John Doe');
  await page.fill('[name="email"]', 'john@example.com');
  await page.fill('[name="address"]', '123 Main St');
  await page.fill('[name="cardNumber"]', '4111111111111111');
  await page.click('button:has-text("Confirm Order")');
  await expect(page).toHaveURL('/checkout/confirmation');
});
```

---

## 🔐 AUTH REUSE CHECKLIST

✅ **Keep These Files (No Changes):**
- `apps/admin/utils/auth.ts` — JWT verification utility
- `apps/admin/api/auth/route.ts` — Login/Logout endpoints
- `packages/env/admin.ts` — JWT_SECRET, PASSWORD env vars
- Cookie-based session pattern (httpOnly, secure, sameSite)
- JWT token generation with 24h expiration

❌ **Not Needed for Iteration 1:**
- User registration
- Multi-user support
- Web app auth (only admin portal needs auth)
- OAuth

✅ **For Iteration 2:**
- Web app user auth (login/signup)
- User ID tracking for cart/purchases
- Different auth roles (user vs admin)

---

## 🚨 COMMON PITFALLS TO AVOID

| Pitfall | Impact | How to Avoid |
|---------|--------|-------------|
| Deleting Post/Like models too early | Breaking blog | Keep models; create Product models alongside |
| Hardcoding product data in components | Refactoring nightmare in Iter 2 | Always import from mockProducts.ts |
| Cart not persisting | Poor UX | Use localStorage with JSON.stringify/parse |
| Not writing E2E tests early | Last-minute stress | Test as you build (TDD) |
| Circular dependencies in types | TypeScript errors | Keep types in packages/db/src/data.ts |
| Missing accessibility attributes | Failing requirements | Add data-testid, aria-label, role to all buttons |
| Hardcoded waits in tests | Flaky tests | Use page.waitFor() or expect().toBeVisible() |
| Breaking existing routes | Confusing navigation | Keep /post and /category routes working |
| Not documenting mock data schema | Iteration 2 confusion | Add JSDoc comments to Product type |

---

## 💡 ITERATION 1 SUCCESS CRITERIA

- ✅ Product browsing works (list, search, filter, detail)
- ✅ Shopping cart works (add, remove, persist)
- ✅ Checkout flow works (form validation, mock payment)
- ✅ All E2E tests pass
- ✅ Responsive design tested
- ✅ No console errors
- ✅ Code reviewed and approved
- ✅ Documentation complete
- ✅ Demo video recorded

---

## 🔄 WORKFLOW FOR CREATING FEATURES

**For Each Feature:**

1. **Read:** Check System Audit to understand current blog equivalent
2. **Plan:** Check GitHub Issues Roadmap for acceptance criteria
3. **Create:** Follow Phase Breakdown timeline
4. **Component:** Create new component in appropriate folder
5. **Test:** Add unit test for component logic
6. **E2E:** Add E2E test for user flow
7. **Storybook:** Create story for component
8. **PR:** Submit PR with:
   - Code changes
   - Component story
   - E2E test
   - Updated documentation
   - Demo screenshot/video

---

## 📞 QUICK LOOKUP: WHERE IS X?

**Q: Where do I put the Product type?**
A: `packages/db/src/data.ts` — export it for import across apps

**Q: Where do I store mock products?**
A: `apps/web/src/data/mockProducts.ts` — import in components

**Q: Where is the cart state?**
A: `apps/web/src/hooks/useCart.ts` or `apps/web/src/context/CartContext.tsx`

**Q: Where do I add cart to the header?**
A: `apps/web/src/app/layout.tsx` — wrap with CartProvider, add CartIcon

**Q: Where are tests?**
A: `tests/playwright/tests/web/` — create products.spec.ts, cart.spec.ts

**Q: Where are Storybook stories?**
A: Co-located with components — `ProductCard.stories.tsx` next to `ProductCard.tsx`

**Q: Where do I document features?**
A: `README.md` (root or apps/web) — add to Iteration 1 section

**Q: How do I reuse blog logic?**
A: Study Blog/List.tsx → copy structure → adapt to products (e.g., category filter logic)

---

## 🎯 NEXT STEPS

1. **Now:** Read SYSTEM_AUDIT_B2C_PIVOT.md to understand current state
2. **Then:** Read ITERATION_1_PHASE_BREAKDOWN.md to plan timeline
3. **Next:** Read ITERATION_1_GITHUB_ISSUES_ROADMAP.md to understand each feature
4. **Start:** Create GitHub issues from the roadmap
5. **Build:** Follow Phase Breakdown week-by-week
6. **Track:** Update GitHub issues as you complete features

---

## 📚 DOCUMENT CHEAT SHEET

| Need | Document | Section |
|------|----------|---------|
| File-by-file what changes | System Audit | Part 5 (Cleanup Checklist) |
| Reusable files | System Audit | Part 2 (Templates) |
| Blog → B2C mapping | System Audit | Part 3 (Feature Mapping) |
| Component structure | Phase Breakdown | Architecture Section |
| Week-by-week plan | Phase Breakdown | Phase 1-5 (Days 1-28) |
| Feature details | GitHub Issues | Issue templates for each feature |
| Acceptance criteria | GitHub Issues | "Acceptance Criteria" section |
| Quick answers | This file | Quick Lookup section |

---

## ✨ YOU'RE READY!

You now have:
- ✅ Complete system audit
- ✅ Detailed roadmap (by feature and timeline)
- ✅ GitHub issue templates ready to create
- ✅ Phase breakdown with daily tasks
- ✅ Quick reference guide

**Next Action:** Create the GitHub issues from ITERATION_1_GITHUB_ISSUES_ROADMAP.md and start Phase 1 (Setup) with mockProducts.ts!

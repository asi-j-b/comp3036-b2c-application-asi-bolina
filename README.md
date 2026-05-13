# Assignment 2 - Blog - Client App

The goal of this assignment is to implement all the client side functionality.
Example implementation is in the image below.

## Success Criteria

- ✅ All of the tests must be passing
- ✅ You must be able to explain any code in the codebase

## 👾 Requirements - Assignment 2.1 - Client

> 💡Idea! Create a new issue in your repository, where you can track the completion of these items. Just copy paste them into the issue and mark them as complete as you go. Make sure you copy the source from README.md not the preview text.

### HOME SCREEN

- [ ] User must see only the "active" posts
- [ ] User must see the list of blog post categories, where each category points to UI showing only posts of that category
- [ ] User must see the list of blog post tags, where each tag points to UI showing only posts of that category
- [ ] User must see the history of blog posts, showing month and year, where each moth, year tuple points to UI showing only posts of that category
- [ ] Tags and history items shown are only considered from active posts
- [ ] The list shows the following items:
  - blog title, pointing to detail page
  - short description
  - date
  - image
  - tags
  - likes
  - views
- [ ] User must be able to switch between dark and light theme with a button
      The dark theme setting is stored in the "data-theme" attribute on html element
- [ ] There is a search functionality that filters blogs based on string found in title or description, redirecting to search page

### DETAIL SCREEN

- [ ] Detail page shows the same items as list item, but the short description is replaced by formatted long description
- [ ] Detail text is stored as Markdown, which needs to be converted to HTML

### CATEGORY SCREEN

- [ ] Displays posts from the category from url (e.g. /category/react)
- [ ] Displays "0 Posts" when search does no posts have that category

### HISTORY SCREEN

- [ ] Displays posts from year and month specified in the url (e.g. /history/2024/12)
- [ ] Displays "0 Posts" when no posts are from that given month and year

### TAG SCREEN

- [ ] Displays posts with the tag url (e.g. /tags/dev-tools)
- [ ] Displays "0 Posts" when search does no posts have that tag

### SEARCH SCREEN

- [ ] Displays results based on search string stored in the query string (e.g. /search?q=Fat)
- [ ] Displays "0 Posts" when search does not find anything

## 👾 Requirements - Assignment 2.2 - Admin

> 💡Idea! Create a new issue in your repository, where you can track the completion of these items. Just copy paste them into the issue and mark them as complete as you go. Make sure you copy the source from README.md not the preview text.

### ADMIN HOME SCREEN

- [ ] Shows Login screen if not logged
- [ ] Shows List screen if logged
- [ ] There must be a logout button
- [ ] Clicking the logout button logs the user out
- [ ] Authenticate the current client using a hard-coded password
- [ ] Use a httpOnly cookie and name it "auth_token" to remember the signed-in state.

### ADMIN LIST SCREEN

- [ ] Shows both active and inactive posts
- [ ] Article list is only accessible to logged-in users.
- [ ] There is a filter screen that allows filtering posts by:
  - [ ] Title or content
  - [ ] Tags
  - [ ] Date
  - [ ] Visibility
- [ ] You can combine multiple filters
- [ ] Users can sort posts by name or creation date, both ascending and descending
- [ ] The post list displays a list of filtered items with the following information:
  - [ ] The list post item displays the image, title of the post
  - [ ] The list post items display metadata such as category, tags, and "active" status.
  - [ ] The active status is a button that, on click, just displays a message
- [ ] Clicking on the title takes the user to the MODIFY SCREEN, allowing the user to modify the current post
- [ ] There is a button to create new posts
- [ ] Clicking on the "Create Post" button takes the user to the CREATE SCREEN

### ADMIN CREATE and UPDATE screen

Both create and update screens display the same UI, but the update screen preloads the data into fields.

- [ ] Page is only accessible to logged in user
- [ ] There must be the following fields which must be validated for errors:
  - [ ] Title (`input, string`)
  - [ ] Description (textarea, string, max 200 characters)
  - [ ] Content (`textarea, markdown string`)
  - [ ] Tag List (`input, string`) shows a comma-separated list of tags.
  - [ ] Image URL (`input, URL`)
- [ ] Under the Description is a "Preview" button that replaces the text area with a rendered markdown string and changes the title to "Close Preview".
- [ ] When the preview is closed, the cursor must be in the same position as before opening the preview.
- [ ] Under the image input is an image preview.
- [ ] User can click on the "Save" button that displays an error ui if one of the fields is not specified or valid.

## 👾 Requirements: Assignment 2.3

### BACKEND / CLIENT

- [ ] Data is loaded from the database backend
- [ ] Data filtering is done server side and only filtered data is sent to client
- [ ] Each visit of the page increases the post "views" count by one
- [ ] User can "like" the post on the detail screen, NOT on the list screen (hint, create the `/api/likes/route.ts` route and implement the needed handlers)
- [ ] Liking the post increases the like count by one
- [ ] User can like the post only once (use IP)
- [ ] User can unlike the post, decreasing the like post by one

### BACKEND / ADMIN / AUTHORISATION

> For these two requirements we do not have End 2 End tests and will be checked manually.

- [ ] The password is checked on server in the `/api/auth` route
- [ ] The POST method is used for login
- [ ] The DELETE method is used for logout
- [ ] The admin home page checks for the presence of JWT token and verifies it, if the token does not exist or is invalid, displays the login control.

### BACKEND / ADMIN / LIST SCREEN

- [ ] Logged in user can activate / deactivate a post clicking on the activate button, automatically saving changes

### BACKEND / ADMIN / UPDATE SCREEN

- [ ] Logged in user can save changes to database, if the form is validated

### BACKEND / ADMIN / CREATE SCREEN

- [ ] Logged in user can create a new post to the database, if the form is validated

## Prerequisites

First, make sure that "pnpm" and "turbo" is installed in your computer. If not, please follow installation instructions for pnpm. If turbo is not installed, please install it using pnpm with the following command:

Then, run the following command to install turborepo.

```
pnpm add -g turbo
```

## Installing the project

Once the pnpm is installed, in the root of the project install the packages

```
pnpm i
```

To run end to end tests you need to install headless browsers. Please run the following command in the `tests/playwright-web` directory

```
pnpx playwright install
```

## Environment

In all packages `apps/admin` and `packages/db` find `.env.example` files and copy them to `.env`. Set your environment variables accordingly!

## Running the project

To run the project, run the following command in the root directory of your project:

```
turbo dev
```

This will run:

- Client application at [http://localhost:3001](http://localhost:3001)
- Admin application at [http://localhost:3002](http://localhost:3002)

## Running tests

To run the tests please run, you have two options.

### Running Tests in Console

If you only wish to visualise the test results in console, please run the following command in the root of your project for the first part of the second assignment (i.e. Assignment 2.1):

```
turbo test-1
```

This launches the turbo console UI similar to below, where you can swap between different projects:

![Turbo UI](https://skillpies.s3.ap-southeast-2.amazonaws.com/courses/full-stack-development/sections/assignment-2-1-blog-client-in-advanced-react/Screenshot%202025-02-05%20at%2014.30.45.png)

> ⚠️⚠️ Make sure that ALL tests pass!

If you want to run the tests for second part (i.e. Assignment 2.2) or third part (i.e. Assignment 2.3), run these commands:

```
turbo test-2 // or
turbo test-3
```

If you want to run all tests, please run

```
turbo all:test
```

### Running Tests in UIs

The packaged tests framework also have the possibility of visually represent your tests for nicer view of test results. To see the UIs, run this command instead of `turbo test-1`:

```
turbo dev:test-1
```

This will launch the End to End testing framework Playwright's test UI similar to below, please use the Play buttons to run individual tests:

![Playwright UI](https://skillpies.s3.ap-southeast-2.amazonaws.com/courses/full-stack-development/sections/assignment-2-1-blog-client-in-advanced-react/Screenshot%202025-02-05%20at%2014.40.35.png)

It also launches the unit and integration test framework Vitest's UI, similar to below. Here, you can also use the play buttons to execute individual tests!

![Vitest UI](https://skillpies.s3.ap-southeast-2.amazonaws.com/courses/full-stack-development/sections/assignment-2-1-blog-client-in-advanced-react/Screenshot%202025-02-05%20at%2014.46.31.png)

## 🛍️ Iteration 1: B2C Frontend with Mock Data

This iteration pivots the blog application into a B2C e-commerce store with a focus on frontend-first development using static mock data. The following features have been implemented:

### What's New (Steps 1-4)

#### Step 1: Mock Product Data Layer
- **File**: `apps/web/src/data/mockProducts.ts`
- **Features**:
  - Product type definition with id, name, price, category, stock, imageUrl, rating, and reviews
  - 8 realistic mock products across 6 categories (Electronics, Clothing, Home, Kitchen, Footwear, Accessories)
  - Helper functions: `getCategories()`, `filterByCategory()`, `searchProducts()`, `sortProducts()`
- **Purpose**: Decouples UI from database until backend integration in Iteration 2

#### Step 2: Product Discovery UI
- **Files**: `apps/web/src/components/Products/ProductCard.tsx`, `apps/web/src/components/Products/ProductGrid.tsx`
- **Features**:
  - Responsive grid layout (1 col on mobile → 2 cols on tablet → 3 cols on desktop)
  - Product cards with image, name, category, description, price (AUD format), stock level, and star rating
  - Hero section with category introduction message
  - "Add to Cart" button on each product card
  - "Featured" badge for featured products
- **Purpose**: Provides polished storefront UI for product browsing

#### Step 3: Category & Search Filtering
- **Integrated into**: `apps/web/src/components/Products/ProductGrid.tsx`
- **Features**:
  - Category filter pills (shows all categories + "All" option)
  - Real-time search input (filters by product name and description, case-insensitive)
  - Active filter display showing current selections
  - Empty state message when no products match filters
  - Live product count updates
- **Purpose**: Enables customers to discover products efficiently

#### Step 4: Local Shopping Cart
- **File**: `apps/web/src/hooks/useCart.ts`
- **Features**:
  - React hook managing cart state with `useState`
  - Methods: `addToCart(productId)`, `removeFromCart(productId)`, `clearCart()`
  - Cart summary: `getCartTotal()`, `getCartCount()`, `getCartItems()`
  - Integrated with ProductCard (Add to Cart button triggers cart updates)
- **Purpose**: Provides session-level cart management (persistence to localStorage planned for Iteration 2)

### How to Test Steps 1-4

#### Running B2C Unit Tests

To run only the B2C storefront tests:

```
turbo test-b2c
```

This runs the following test suites:

- **mockProducts.test.ts** (4 tests):
  - ✅ getCategories() returns unique categories
  - ✅ filterByCategory() filters products correctly
  - ✅ searchProducts() matches by name and description
  - ✅ sortProducts() sorts by name, price, and rating

- **ProductCard.test.tsx** (1 browser test):
  - ✅ Renders product card with all details and triggers add-to-cart callback

- **ProductGrid.test.tsx** (2 browser tests):
  - ✅ Renders all products and category filters
  - ✅ Filters products by category when pill is clicked

- **useCart.test.tsx** (1 browser test):
  - ✅ Adds/removes items, calculates total and count correctly

#### Running B2C Tests with UI

To see the tests in the Vitest UI:

```
turbo dev:test-b2c
```

This launches the Vitest and Playwright test interfaces where you can run individual tests with play buttons.

#### Manual Testing in Browser

1. Start the development server:
   ```
   turbo dev
   ```

2. Visit [http://localhost:3001](http://localhost:3001) to see the B2C storefront

3. Test the following scenarios:
   - Browse products in the grid
   - Click category filter pills to filter by category
   - Type in the search box to filter by product name/description
   - Click "Add to Cart" on products (cart count will update)
   - Remove items from cart using the remove button
   - Verify "Featured" badge appears on featured products
   - Check responsive layout on mobile, tablet, and desktop

### New Project Files

```
apps/web/src/
├── data/
│   └── mockProducts.ts                 # Mock product data + helpers
├── components/
│   └── Products/
│       ├── ProductCard.tsx             # Reusable product card component
│       ├── ProductGrid.tsx             # Main discovery UI with filters
│       ├── ProductCard.test.tsx        # Browser tests for ProductCard
│       └── ProductGrid.test.tsx        # Browser tests for ProductGrid
└── hooks/
    ├── useCart.ts                      # Cart state management hook
    └── useCart.test.tsx                # Browser tests for useCart
```

Additionally, `mockProducts.test.ts` provides unit tests for the data layer.

### Next Steps (Iteration 2+)

- Add E2E tests for complete user workflows (browse → filter → add to cart → checkout)
- Persist cart to localStorage for session recovery
- Integrate with backend API for real product data
- Implement checkout flow and payment integration
- Clean up blog components (deferred, doesn't block Iteration 1)

## Project structure

The project is monorepo with the following packages split into three categories:

**Applications**

Contains the following web applications:

- **apps/admin** - Admin Website
- **apps/web** - Client website

**Packages**

Contains the following packages with shared code and configurations:

- **packages/ui** - Library of UI elements shared between admin and client
- **packages/utils** - Library of utility functions shared between other projects
- **packages/db** - Library handling the database connection
- **packages/eslint-config**, **packages/tailwind-config** and **packages/typescript-config** contain configuration files for build pipelines for this project

**Tests**

Contains the following test applications:

- **tests/playwright-admin** - End to End tests for the admin application
- **tests/playwright-web** - End to End tests for the client application
- **tests/storybook** - Configured storybook instance for development and testing of React components in isolation

## Application Structure

The client application comes with pre-defined router (only one route is missing for your learning).
The client application also comes with pre defined structure of components and utilities for you to complete.
Tha admin application is much more bare with most functionality AND structure needed to be completed by you.

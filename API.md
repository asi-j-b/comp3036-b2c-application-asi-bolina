# API Documentation

This document describes the currently implemented API surface for the B2C storefront and admin panel.

## Base URLs
- Storefront API base: `http://localhost:3001/api`
- Admin API base: `http://localhost:3002/api`

## Content Type
- Request JSON body: `application/json`
- Response JSON body: `application/json`

## Authentication

Authentication is cookie-based JWT:
- Storefront cookie: `web_auth_token`
- Admin cookie: `admin_auth_token`

Protected endpoints return `401` for unauthenticated requests.

---

## Storefront Endpoints

### `POST /api/register`
Create a new customer account.

Request body:
```json
{
	"firstName": "Alice",
	"lastName": "Kingsley",
	"email": "alice@example.com",
	"password": "password123",
	"confirmPassword": "password123"
}
```

Success response (`201`):
```json
{ "success": true }
```

Common errors:
- `400` invalid payload
- `403` request origin not allowed
- `409` email already exists

### `POST /api/auth`
Sign in as a customer.

Request body:
```json
{
	"email": "alice@example.com",
	"password": "password123"
}
```

Success response (`200`):
```json
{ "success": true }
```

Common errors:
- `401` invalid credentials
- `400` invalid request

### `GET /api/auth`
Return current customer session.

Success response (`200`):
```json
{
	"id": "clx...",
	"email": "alice@example.com",
	"role": "CUSTOMER"
}
```

Unauthenticated response (`200`):
```json
{ "email": null, "role": null }
```

### `DELETE /api/auth`
Sign out customer.

Success response (`200`):
```json
{ "success": true }
```

### `POST /api/orders`
Create a new order from cart items for authenticated customer.

Request body:
```json
{
	"items": [
		{ "productId": "clx_product_1", "quantity": 2 },
		{ "productId": "clx_product_2", "quantity": 1 }
	]
}
```

Success response (`200`):
```json
{
	"order": {
		"id": "clx_order_1",
		"totalAmount": 787,
		"status": "PENDING",
		"userId": "clx_user_1",
		"items": [
			{
				"id": "clx_item_1",
				"productId": "clx_product_1",
				"quantity": 2,
				"pricePaid": 219,
				"product": {
					"id": "clx_product_1",
					"name": "AeroPulse Smart Watch"
				}
			}
		]
	}
}
```

Common errors:
- `401` unauthorized
- `400` invalid cart items
- `400` cart empty
- `400` unavailable/out-of-stock product

### `GET /api/orders`
Return purchase history for authenticated customer.

Success response (`200`):
```json
{
	"orders": [
		{
			"id": "clx_order_1",
			"totalAmount": 787,
			"status": "PENDING",
			"createdAt": "2026-06-02T10:00:00.000Z",
			"items": [
				{
					"id": "clx_item_1",
					"quantity": 2,
					"pricePaid": 219,
					"product": {
						"id": "clx_product_1",
						"slug": "aeropulse-smart-watch",
						"name": "AeroPulse Smart Watch",
						"imageUrl": "https://...",
						"category": "Electronics"
					}
				}
			]
		}
	]
}
```

Common errors:
- `401` unauthorized

---

## Admin Endpoints

### `POST /api/auth`
Sign in as an admin user.

Request body:
```json
{
	"email": "admin@example.com",
	"password": "AdminPassword"
}
```

Success response (`200`):
```json
{ "message": "Logged in" }
```

Common errors:
- `401` unauthorized
- `400` invalid request

### `GET /api/auth`
Return current admin session.

Success response (`200`):
```json
{ "email": "admin@example.com", "role": "ADMIN" }
```

Unauthenticated response (`200`):
```json
{ "email": null, "role": null }
```

### `DELETE /api/auth`
Sign out admin.

Success response (`200`):
```json
{ "message": "Logged out" }
```

### `POST /api/posts`
Create a product (legacy route name retained, product-backed implementation).

Request body:
```json
{
	"name": "AeroPulse Smart Watch",
	"slug": "aeropulse-smart-watch",
	"description": "Track workouts and sleep",
	"imageUrl": "https://...",
	"category": "Electronics",
	"price": 219,
	"stock": 18,
	"featured": true,
	"active": true
}
```

Success response (`200`):
Returns created product record.

Common errors:
- `401` unauthorized
- `400` invalid request body

### `PATCH /api/posts/:id`
Toggle product active flag.

Request body:
```json
{ "active": false }
```

Success response (`200`):
Returns updated product record.

Common errors:
- `401` unauthorized
- `404` product not found

### `PUT /api/posts/:id`
Update full product details.

Request body:
```json
{
	"name": "Updated Product",
	"slug": "updated-product",
	"description": "Updated description",
	"imageUrl": "https://...",
	"category": "Electronics",
	"price": 249,
	"stock": 12,
	"featured": false,
	"active": true
}
```

Success response (`200`):
Returns updated product record.

Common errors:
- `401` unauthorized
- `400` invalid request/update failure

### `DELETE /api/posts/:id`
Delete a product by id.

Success response (`200`):
```json
{ "success": true }
```

Common errors:
- `401` unauthorized
- `404` product not found

### `GET /api/orders`
Return all orders for admin purchase records.

Success response (`200`):
```json
{
	"orders": [
		{
			"id": "clx_order_1",
			"totalAmount": 787,
			"status": "PENDING",
			"createdAt": "2026-06-02T10:00:00.000Z",
			"user": {
				"id": "clx_user_1",
				"email": "alice@example.com",
				"name": "Alice Kingsley"
			},
			"items": [
				{
					"id": "clx_item_1",
					"quantity": 2,
					"pricePaid": 219,
					"product": {
						"id": "clx_product_1",
						"slug": "aeropulse-smart-watch",
						"name": "AeroPulse Smart Watch",
						"category": "Electronics"
					}
				}
			]
		}
	]
}
```

Common errors:
- `401` unauthorized

---

## Notes
- Monetary values are stored as integer whole units in current implementation.
- Admin product routes currently remain under `/api/posts` for minimum-refactor compatibility with existing UI.
- B2C storefront order creation currently sets initial order status to `PENDING`.

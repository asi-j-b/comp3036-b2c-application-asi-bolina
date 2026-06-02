# API Documentation

## Base URLs
- Storefront API: `http://localhost:3001/api`
- Admin API: `http://localhost:3002/api`

## Content Type
- Request body: `application/json`
- Response body: `application/json`

## Auth Cookies
- Storefront: `web_auth_token`
- Admin: `admin_auth_token`

---

## Storefront Endpoints

### `POST /api/register`
Register customer account.

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

Success: `201`
```json
{ "success": true }
```

### `POST /api/auth`
Customer login.

Request body:
```json
{
	"email": "alice@example.com",
	"password": "password123"
}
```

Success: `200`
```json
{ "success": true }
```

### `GET /api/auth`
Get current customer session.

Authenticated response:
```json
{
	"id": "clx_user_1",
	"email": "alice@example.com",
	"role": "CUSTOMER"
}
```

Unauthenticated response:
```json
{ "email": null, "role": null }
```

### `DELETE /api/auth`
Customer logout.

Success:
```json
{ "success": true }
```

### `GET /api/orders`
Get current customer order history.

Success: `200`
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

### `POST /api/orders`
Create order from cart items.

Request body:
```json
{
	"items": [
		{ "productId": "clx_product_1", "quantity": 2 },
		{ "productId": "clx_product_2", "quantity": 1 }
	]
}
```

Success: `200`
```json
{
	"order": {
		"id": "clx_order_1",
		"totalAmount": 787,
		"status": "PENDING",
		"userId": "clx_user_1"
	}
}
```

Errors:
- `401` unauthorized
- `400` invalid item/cart/stock state

### `GET /api/likes` and `POST /api/likes`
Deprecated endpoint.

Response: `410`
```json
{
	"error": "Deprecated endpoint",
	"message": "Likes endpoint is no longer used. Use cart and orders endpoints instead."
}
```

---

## Admin Endpoints

### `POST /api/auth`
Admin login.

Request body:
```json
{
	"email": "admin@example.com",
	"password": "AdminPassword"
}
```

Success:
```json
{ "message": "Logged in" }
```

### `GET /api/auth`
Get current admin session.

Authenticated response:
```json
{ "email": "admin@example.com", "role": "ADMIN" }
```

Unauthenticated response:
```json
{ "email": null, "role": null }
```

### `DELETE /api/auth`
Admin logout.

Success:
```json
{ "message": "Logged out" }
```

### `POST /api/products`
Create product.

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

### `PATCH /api/products/:id`
Toggle product active status.

Request body:
```json
{ "active": false }
```

### `PUT /api/products/:id`
Update product.

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

### `DELETE /api/products/:id`
Delete product.

Success:
```json
{ "success": true }
```

### `GET /api/orders`
Get all orders for admin purchase records.

Success: `200`
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

### `GET /api/likes` and `POST /api/likes`
Deprecated endpoint.

Response: `410`
```json
{
	"error": "Deprecated endpoint",
	"message": "Likes endpoint is no longer used in admin."
}
```

# Buy & Sell App (React + TypeScript + Redux)

A starter project structure for a marketplace app: browse/list products,
add to cart, check out, view orders, plus login/registration — all wired
up with Redux Toolkit.

## Stack
- React 18 + TypeScript
- Redux Toolkit + React-Redux (typed hooks)
- React Router v6
- Vite

## Getting started

```bash
npm install
npm run dev
```

The app runs on a **mock in-memory API** (`src/api/client.ts`) so it works
immediately with no backend. A demo account is pre-filled on the login page:

```
email: seller@example.com
password: password123
```

Feel free to register a new account instead — anything works.

## Project structure

```
src/
  api/
    client.ts          # mock API — swap these functions for real fetch calls
  app/
    store.ts           # configureStore, root reducer
    hooks.ts           # useAppDispatch / useAppSelector (typed)
  components/
    Navbar.tsx
    ProtectedRoute.tsx  # redirects to /login if not authenticated
  features/
    auth/
      authSlice.ts      # login/register thunks + auth state
      Login.tsx
      Register.tsx
    products/
      productsSlice.ts  # fetch/create product thunks
      ProductList.tsx   # browse + "sell a product" form
      ProductDetail.tsx
    cart/
      cartSlice.ts      # add/remove/update quantity
      Cart.tsx          # checkout -> places an order
    orders/
      ordersSlice.ts    # fetch/place order thunks
      Orders.tsx        # order history
  types/
    index.ts            # shared TS interfaces (User, Product, Order, ...)
  App.tsx                # routes
  main.tsx               # Provider + BrowserRouter + entry point
  index.css
```

## Wiring in a real backend

Everything backend-related lives in `src/api/client.ts`. Replace each
function body with a real `fetch`/`axios` call that hits your API —
the thunks in each slice (`authSlice`, `productsSlice`, `ordersSlice`)
already call these functions, so no other code needs to change as long
as you keep the same function signatures and return shapes.

For real auth, you'll also want to attach the `token` from
`state.auth.token` as an `Authorization` header on protected requests.

## Routes

| Path             | Access     | Description                  |
|-------------------|-----------|-------------------------------|
| `/login`          | public    | Log in                        |
| `/register`       | public    | Create an account             |
| `/products`       | public    | Browse products, list new ones|
| `/products/:id`   | public    | Product detail                |
| `/cart`           | protected | Cart + checkout               |
| `/orders`         | protected | Order history                 |

## Next steps you may want to add
- Persist products/orders to a real database instead of in-memory arrays
- Password hashing + JWT on a real backend (never store plaintext passwords)
- Seller dashboard to manage their own listings and view sales
- Pagination / search / filtering on the product list
- Form validation library (e.g. `react-hook-form` + `zod`)

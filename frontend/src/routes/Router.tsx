import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppShell from "@components/layout/AppShell";
import PageLoading from "@components/loader/PageLoading";

const DashboardPage = lazy(() => import("@pages/DashboardPage"));
const ShopifyProductsPage = lazy(() => import("@pages/shopify/ShopifyProductsPage"));
const ShopifyOrdersPage = lazy(() => import("@pages/shopify/ShopifyOrdersPage"));
const ShopifyShopPage = lazy(() => import("@pages/shopify/ShopifyShopPage"));
const ShopifyCustomersPage = lazy(() => import("@pages/shopify/ShopifyCustomersPage"));
const ShopifyDraftOrdersPage = lazy(() => import("@pages/shopify/ShopifyDraftOrdersPage"));
const ShopifyGiftCardsPage = lazy(() => import("@pages/shopify/ShopifyGiftCardsPage"));
const ShopifyInventoryPage = lazy(() => import("@pages/shopify/ShopifyInventoryPage"));
const ShopifyFulfillmentOrdersPage = lazy(() => import("@pages/shopify/ShopifyFulfillmentOrdersPage"));
const ShopifyProductFeedsPage = lazy(() => import("@pages/shopify/ShopifyProductFeedsPage"));
const ShopifyAnalyticsPage = lazy(() => import("@pages/shopify/ShopifyAnalyticsPage"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppShell />}>
      <Route
        path="/"
        element={
          <Suspense fallback={<PageLoading />}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/products"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyProductsPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/orders"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyOrdersPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/shop"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyShopPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/customers"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyCustomersPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/draft-orders"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyDraftOrdersPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/gift-cards"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyGiftCardsPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/inventory"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyInventoryPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/fulfillment-orders"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyFulfillmentOrdersPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/product-feeds"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyProductFeedsPage />
          </Suspense>
        }
      />
      <Route
        path="/shopify/analytics"
        element={
          <Suspense fallback={<PageLoading />}>
            <ShopifyAnalyticsPage />
          </Suspense>
        }
      />
    </Route>
  )
);

export default router;

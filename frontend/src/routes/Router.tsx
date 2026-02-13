import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppShell from "@components/layout/AppShell";
import PageLoading from "@components/loader/PageLoading";

const DashboardPage = lazy(() => import("@pages/DashboardPage"));
const OrderMenuPage = lazy(() => import("@pages/order/OrderMenuPage"));
const OrderCheckoutPage = lazy(() => import("@pages/order/OrderCheckoutPage"));
const OrderConfirmationPage = lazy(() => import("@pages/order/OrderConfirmationPage"));
const ReservationsPage = lazy(() => import("@pages/order/ReservationsPage"));
const RestoOrdersPage = lazy(() => import("@pages/resto/RestoOrdersPage"));
const RestoLocationsPage = lazy(() => import("@pages/resto/RestoLocationsPage"));
const RestoDeliveryZonesPage = lazy(() => import("@pages/resto/RestoDeliveryZonesPage"));
const RestoServiceHoursPage = lazy(() => import("@pages/resto/RestoServiceHoursPage"));
const RestoHolidaySchedulesPage = lazy(() => import("@pages/resto/RestoHolidaySchedulesPage"));
const RestoReservationsPage = lazy(() => import("@pages/resto/RestoReservationsPage"));
const RestoCategoriesPage = lazy(() => import("@pages/resto/RestoCategoriesPage"));
const RestoProductsPage = lazy(() => import("@pages/resto/RestoProductsPage"));
const RestoModifierGroupsPage = lazy(() => import("@pages/resto/RestoModifierGroupsPage"));
const RestoModifiersPage = lazy(() => import("@pages/resto/RestoModifiersPage"));
const RestoInventoryPage = lazy(() => import("@pages/resto/RestoInventoryPage"));
const RestoProductRecipesPage = lazy(() => import("@pages/resto/RestoProductRecipesPage"));
const RestoMenusPage = lazy(() => import("@pages/resto/RestoMenusPage"));
const RestoMenuItemsPage = lazy(() => import("@pages/resto/RestoMenuItemsPage"));
const POSPage = lazy(() => import("@pages/resto/POSPage"));

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
        path="/order"
        element={
          <Suspense fallback={<PageLoading />}>
            <OrderMenuPage />
          </Suspense>
        }
      />
      <Route
        path="/order/checkout"
        element={
          <Suspense fallback={<PageLoading />}>
            <OrderCheckoutPage />
          </Suspense>
        }
      />
      <Route
        path="/order/confirmation/:id"
        element={
          <Suspense fallback={<PageLoading />}>
            <OrderConfirmationPage />
          </Suspense>
        }
      />
      <Route
        path="/reservations"
        element={
          <Suspense fallback={<PageLoading />}>
            <ReservationsPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/pos"
        element={
          <Suspense fallback={<PageLoading />}>
            <POSPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/orders"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoOrdersPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/locations"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoLocationsPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/categories"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoCategoriesPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/products"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoProductsPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/modifier-groups"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoModifierGroupsPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/modifiers"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoModifiersPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/inventory"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoInventoryPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/product-recipes"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoProductRecipesPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/menus"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoMenusPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/menu-items"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoMenuItemsPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/delivery-zones"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoDeliveryZonesPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/service-hours"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoServiceHoursPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/holidays"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoHolidaySchedulesPage />
          </Suspense>
        }
      />
      <Route
        path="/resto/reservations"
        element={
          <Suspense fallback={<PageLoading />}>
            <RestoReservationsPage />
          </Suspense>
        }
      />
    </Route>
  )
);

export default router;

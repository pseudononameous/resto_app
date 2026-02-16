import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import theme from "./Theme";
import router from "./routes/Router";
import PageLoading from "@components/loader/PageLoading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageLoading />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
      <Notifications position="top-right" />
    </MantineProvider>
  </React.StrictMode>
);

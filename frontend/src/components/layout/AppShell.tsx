import { Link, Outlet, useLocation } from "react-router-dom";
import { AppShell as MantineAppShell, NavLink, Group, Text, ScrollArea } from "@mantine/core";
import {
  IconShoppingBag,
  IconList,
  IconReceipt,
  IconBuildingStore,
  IconUsers,
  IconFileInvoice,
  IconGift,
  IconPackage,
  IconTruck,
  IconRss,
  IconChartBar,
} from "@tabler/icons-react";

const nav = [
  { to: "/", label: "Dashboard", icon: IconBuildingStore },
  { to: "/shopify/shop", label: "Shop Info", icon: IconList },
  { to: "/shopify/products", label: "Products", icon: IconShoppingBag },
  { to: "/shopify/orders", label: "Orders", icon: IconReceipt },
  { to: "/shopify/draft-orders", label: "Draft Orders", icon: IconFileInvoice },
  { to: "/shopify/customers", label: "Customers", icon: IconUsers },
  { to: "/shopify/gift-cards", label: "Gift Cards", icon: IconGift },
  { to: "/shopify/inventory", label: "Inventory", icon: IconPackage },
  { to: "/shopify/fulfillment-orders", label: "Fulfillment", icon: IconTruck },
  { to: "/shopify/product-feeds", label: "Product Feeds", icon: IconRss },
  { to: "/shopify/analytics", label: "Analytics", icon: IconChartBar },
];

export default function AppShell() {
  const location = useLocation();

  return (
    <MantineAppShell
      header={{ height: 56 }}
      navbar={{ width: 220, breakpoint: "sm" }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" gap="sm">
          <Text fw={700} size="lg" component={Link} to="/" c="dark" style={{ textDecoration: "none" }}>
            RestoApp
          </Text>
          <Text size="xs" c="dimmed">Unified API</Text>
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar p="sm">
        <ScrollArea h="calc(100vh - 56px)" type="auto">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              component={Link}
              to={to}
              label={label}
              leftSection={<Icon size={18} />}
              active={location.pathname === to || (to !== "/" && location.pathname.startsWith(to))}
            />
          ))}
        </ScrollArea>
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}

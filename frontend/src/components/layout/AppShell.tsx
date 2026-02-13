import { Link, Outlet, useLocation } from "react-router-dom";
import { AppShell as MantineAppShell, NavLink, Group, Text, ScrollArea } from "@mantine/core";
import {
  IconBuildingStore,
  IconReceipt,
  IconShoppingCart,
  IconCalendar,
  IconMapPin,
  IconTruck,
  IconClock,
  IconCalendarOff,
  IconCash,
  IconCategory,
  IconPackage,
  IconAdjustments,
  IconListDetails,
  IconStack2,
  IconClipboardList,
  IconSalad,
} from "@tabler/icons-react";

const nav = [
  { to: "/", label: "Dashboard", icon: IconBuildingStore },
  { to: "/order", label: "Order Online", icon: IconShoppingCart },
  { to: "/reservations", label: "Reservations", icon: IconCalendar },
  { to: "/resto/pos", label: "POS", icon: IconCash },
  { to: "/resto/orders", label: "Order Management", icon: IconReceipt },
  { to: "/resto/locations", label: "Locations", icon: IconMapPin },
  { to: "/resto/delivery-zones", label: "Delivery Zones", icon: IconTruck },
  { to: "/resto/service-hours", label: "Service Hours", icon: IconClock },
  { to: "/resto/holidays", label: "Holidays", icon: IconCalendarOff },
  { to: "/resto/reservations", label: "Reservations Mgmt", icon: IconCalendar },
  { to: "/resto/categories", label: "Categories", icon: IconCategory },
  { to: "/resto/products", label: "Products", icon: IconPackage },
  { to: "/resto/modifier-groups", label: "Modifier Groups", icon: IconAdjustments },
  { to: "/resto/modifiers", label: "Modifiers", icon: IconListDetails },
  { to: "/resto/inventory", label: "Inventory", icon: IconStack2 },
  { to: "/resto/product-recipes", label: "Product Recipes", icon: IconClipboardList },
  { to: "/resto/menus", label: "Menus", icon: IconSalad },
  { to: "/resto/menu-items", label: "Menu Items", icon: IconClipboardList },
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

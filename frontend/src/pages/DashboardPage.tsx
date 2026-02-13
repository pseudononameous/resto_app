import { Title, Text, Card, Group, Stack, Badge } from "@mantine/core";
import { IconBuildingStore, IconApi, IconShoppingCart, IconCalendar, IconMapPin, IconReceipt } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <Stack gap="lg">
      <Title order={1}>Dashboard</Title>
      <Text c="dimmed">RestoApp unified restaurant commerce platform. Order online, manage orders, and reservations.</Text>

      <Group grow>
        <Card shadow="sm" padding="lg" withBorder component={Link} to="/order" style={{ textDecoration: "none", color: "inherit" }}>
          <Group gap="sm">
            <IconShoppingCart size={32} />
            <Stack gap={2}>
              <Text fw={600}>Order Online</Text>
              <Text size="sm" c="dimmed">Browse menu, add to cart, checkout</Text>
            </Stack>
          </Group>
        </Card>
        <Card shadow="sm" padding="lg" withBorder component={Link} to="/reservations" style={{ textDecoration: "none", color: "inherit" }}>
          <Group gap="sm">
            <IconCalendar size={32} />
            <Stack gap={2}>
              <Text fw={600}>Reservations</Text>
              <Text size="sm" c="dimmed">Book a table</Text>
            </Stack>
          </Group>
        </Card>
        <Card shadow="sm" padding="lg" withBorder component={Link} to="/resto/orders" style={{ textDecoration: "none", color: "inherit" }}>
          <Group gap="sm">
            <IconReceipt size={32} />
            <Stack gap={2}>
              <Text fw={600}>Order Management</Text>
              <Text size="sm" c="dimmed">View & manage orders</Text>
            </Stack>
          </Group>
        </Card>
        <Card shadow="sm" padding="lg" withBorder component={Link} to="/resto/locations" style={{ textDecoration: "none", color: "inherit" }}>
          <Group gap="sm">
            <IconMapPin size={32} />
            <Stack gap={2}>
              <Text fw={600}>Locations</Text>
              <Text size="sm" c="dimmed">Multi-location support</Text>
            </Stack>
          </Group>
        </Card>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        <Title order={3} mb="xs">Quick links</Title>
        <Group>
          <Badge variant="light" size="lg" component={Link} to="/order">Order Online</Badge>
          <Badge variant="light" size="lg" component={Link} to="/reservations">Reservations</Badge>
          <Badge variant="light" size="lg" component={Link} to="/resto/orders">Orders</Badge>
        </Group>
      </Card>
    </Stack>
  );
}

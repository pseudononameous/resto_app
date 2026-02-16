import { Title, Text, Card, Group, Stack, Badge } from "@mantine/core";
import { IconBuildingStore, IconApi } from "@tabler/icons-react";

export default function DashboardPage() {
  return (
    <Stack gap="lg">
      <Title order={1}>Dashboard</Title>
      <Text c="dimmed">RestoApp unified restaurant commerce platform. Shopify is the system of record.</Text>

      <Group grow>
        <Card shadow="sm" padding="lg" withBorder>
          <Group gap="sm">
            <IconBuildingStore size={32} />
            <Stack gap={2}>
              <Text fw={600}>Commerce (Shopify)</Text>
              <Text size="sm" c="dimmed">Products, orders, inventory</Text>
            </Stack>
          </Group>
        </Card>
        <Card shadow="sm" padding="lg" withBorder>
          <Group gap="sm">
            <IconApi size={32} />
            <Stack gap={2}>
              <Text fw={600}>Unified API</Text>
              <Text size="sm" c="dimmed">Laravel backend → 3rd party systems</Text>
            </Stack>
          </Group>
        </Card>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        <Title order={3} mb="xs">Quick links</Title>
        <Group>
          <Badge variant="light" size="lg">Shopify → Products</Badge>
          <Badge variant="light" size="lg">Shopify → Orders</Badge>
          <Badge variant="light" size="lg">Shopify → Shop info</Badge>
        </Group>
      </Card>
    </Stack>
  );
}

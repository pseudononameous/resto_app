import { useQuery } from "@tanstack/react-query";
import { Title, Card, Stack, Text, Loader, Center, Alert, Group, Badge } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyShopPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "shop"],
    queryFn: async () => {
      const res = await shopifyApi.shop();
      return res.data as { shop?: Record<string, unknown>; error?: string };
    },
  });

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || data?.error) {
    return (
      <Alert color="red" title="Error">
        {data?.error ?? (error as Error)?.message ?? "Failed to load shop. Check SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN in the API .env."}
      </Alert>
    );
  }

  const shop = data?.shop as Record<string, unknown> | undefined;
  if (!shop) {
    return (
      <Alert color="yellow" title="No data">Shop object not found in response.</Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Title order={1}>Shop Info</Title>
      <Text c="dimmed">Store details from Shopify (via RestoApp API).</Text>

      <Card withBorder>
        <Stack gap="sm">
          <Group>
            <Text fw={600}>Name</Text>
            <Badge size="lg">{String(shop.name ?? "—")}</Badge>
          </Group>
          <Text><strong>Email:</strong> {String(shop.email ?? "—")}</Text>
          <Text><strong>Domain:</strong> {String(shop.domain ?? shop.myshopify_domain ?? "—")}</Text>
          <Text><strong>Currency:</strong> {String(shop.currency ?? "—")}</Text>
          <Text><strong>Timezone:</strong> {String(shop.timezone ?? "—")}</Text>
          <Text size="sm" c="dimmed">ID: {String(shop.id ?? "—")}</Text>
        </Stack>
      </Card>
    </Stack>
  );
}

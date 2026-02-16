import { useQuery } from "@tanstack/react-query";
import { Title, Card, Table, Text, Stack, Loader, Center, Alert } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyProductFeedsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "product_feeds"],
    queryFn: async () => {
      const res = await shopifyApi.productFeeds({ limit: 50 });
      return res.data as {
        product_feeds?: Array<Record<string, unknown> & { id?: number; name?: string; created_at?: string }>;
        error?: string;
      };
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
        {data?.error ?? (error as Error)?.message ?? "Failed to load product feeds. Check read_product_feeds scope."}
      </Alert>
    );
  }

  const feeds = data?.product_feeds ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Shopify Product Feeds</Title>
      <Text c="dimmed">Product feeds from your Shopify store (read_product_feeds scope).</Text>

      <Card withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {feeds.map((f) => (
              <Table.Tr key={String(f.id ?? f)}>
                <Table.Td>{f.id ?? "—"}</Table.Td>
                <Table.Td>{String(f.name ?? "—")}</Table.Td>
                <Table.Td>{f.created_at ? new Date(f.created_at as string).toLocaleDateString() : "—"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {feeds.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No product feeds found.</Text>
        )}
      </Card>
    </Stack>
  );
}

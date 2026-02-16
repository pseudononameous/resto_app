import { useQuery } from "@tanstack/react-query";
import { Title, Card, Table, Text, Badge, Stack, Loader, Center, Alert } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyProductsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "products"],
    queryFn: async () => {
      const res = await shopifyApi.products({ limit: 50 });
      return res.data as { products?: Array<{ id: number; title: string; status: string; variants?: Array<{ price: string }> }> };
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
        {data?.error ?? (error as Error)?.message ?? "Failed to load products. Check API and Shopify config (.env)."}
      </Alert>
    );
  }

  const products = data?.products ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Shopify Products</Title>
      <Text c="dimmed">Products from your Shopify store (via RestoApp API).</Text>

      <Card withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Price (first variant)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.map((p) => (
              <Table.Tr key={p.id}>
                <Table.Td>{p.id}</Table.Td>
                <Table.Td>{p.title}</Table.Td>
                <Table.Td>
                  <Badge size="sm" color={p.status === "active" ? "green" : "gray"}>{p.status}</Badge>
                </Table.Td>
                <Table.Td>{p.variants?.[0]?.price ?? "—"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {products.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No products found. Configure SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN in the API .env.</Text>
        )}
      </Card>
    </Stack>
  );
}

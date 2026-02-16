import { useQuery } from "@tanstack/react-query";
import { Title, Card, Table, Text, Badge, Stack, Loader, Center, Alert } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyCustomersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "customers"],
    queryFn: async () => {
      const res = await shopifyApi.customers({ limit: 50 });
      return res.data as {
        customers?: Array<{
          id: number;
          first_name?: string;
          last_name?: string;
          email?: string;
          orders_count?: number;
          total_spent?: string;
          created_at?: string;
        }>;
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
        {data?.error ?? (error as Error)?.message ?? "Failed to load customers. Check API and Shopify scopes (read_customers)."}
      </Alert>
    );
  }

  const customers = data?.customers ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Shopify Customers</Title>
      <Text c="dimmed">Customers from your Shopify store (read_customers scope).</Text>

      <Card withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Orders</Table.Th>
              <Table.Th>Total spent</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {customers.map((c) => (
              <Table.Tr key={c.id}>
                <Table.Td>{c.id}</Table.Td>
                <Table.Td>{[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"}</Table.Td>
                <Table.Td>{c.email ?? "—"}</Table.Td>
                <Table.Td>{c.orders_count ?? 0}</Table.Td>
                <Table.Td>{c.total_spent ?? "—"}</Table.Td>
                <Table.Td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {customers.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            No customers found. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN in the API .env.
          </Text>
        )}
      </Card>
    </Stack>
  );
}

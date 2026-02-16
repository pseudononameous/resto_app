import { useQuery } from "@tanstack/react-query";
import { Title, Card, Table, Text, Badge, Stack, Loader, Center, Alert } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyOrdersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "orders"],
    queryFn: async () => {
      const res = await shopifyApi.orders({ limit: 50, status: "any" });
      return res.data as { orders?: Array<{ id: number; name: string; financial_status: string; fulfillment_status: string | null; total_price: string; created_at: string }> };
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
        {data?.error ?? (error as Error)?.message ?? "Failed to load orders. Check API and Shopify config (.env)."}
      </Alert>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Shopify Orders</Title>
      <Text c="dimmed">Orders from your Shopify store (via RestoApp API). Last 60 days by default.</Text>

      <Card withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order</Table.Th>
              <Table.Th>Financial</Table.Th>
              <Table.Th>Fulfillment</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((o) => (
              <Table.Tr key={o.id}>
                <Table.Td>{o.name}</Table.Td>
                <Table.Td>
                  <Badge size="sm" color={o.financial_status === "paid" ? "green" : "orange"}>{o.financial_status}</Badge>
                </Table.Td>
                <Table.Td>
                  <Badge size="sm" variant="light">{o.fulfillment_status ?? "—"}</Badge>
                </Table.Td>
                <Table.Td>{o.total_price}</Table.Td>
                <Table.Td>{new Date(o.created_at).toLocaleDateString()}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {orders.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No orders found.</Text>
        )}
      </Card>
    </Stack>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Title, Card, Table, Text, Badge, Stack, Loader, Center, Alert } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyFulfillmentOrdersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "fulfillment_orders"],
    queryFn: async () => {
      const res = await shopifyApi.fulfillmentOrders({ limit: 50 });
      return res.data as {
        fulfillment_orders?: Array<{
          id: number;
          order_id?: number;
          status?: string;
          assignment_status?: string;
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
        {data?.error ?? (error as Error)?.message ?? "Failed to load fulfillment orders. Check read_assigned_fulfillment_orders scope."}
      </Alert>
    );
  }

  const orders = data?.fulfillment_orders ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Shopify Fulfillment Orders</Title>
      <Text c="dimmed">Assigned fulfillment orders (read_assigned_fulfillment_orders scope).</Text>

      <Card withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Order ID</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Assignment</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((o) => (
              <Table.Tr key={o.id}>
                <Table.Td>{o.id}</Table.Td>
                <Table.Td>{o.order_id ?? "—"}</Table.Td>
                <Table.Td>
                  <Badge size="sm" variant="light">{o.status ?? "—"}</Badge>
                </Table.Td>
                <Table.Td>
                  <Badge size="sm" color="blue">{o.assignment_status ?? "—"}</Badge>
                </Table.Td>
                <Table.Td>{o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {orders.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No fulfillment orders found.</Text>
        )}
      </Card>
    </Stack>
  );
}

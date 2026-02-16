import { useQuery } from "@tanstack/react-query";
import { Title, Card, Table, Text, Badge, Stack, Loader, Center, Alert } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyDraftOrdersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "draft_orders"],
    queryFn: async () => {
      const res = await shopifyApi.draftOrders({ limit: 50, status: "any" });
      return res.data as {
        draft_orders?: Array<{
          id: number;
          name?: string;
          status?: string;
          total_price?: string;
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
        {data?.error ?? (error as Error)?.message ?? "Failed to load draft orders. Check read_draft_orders scope."}
      </Alert>
    );
  }

  const drafts = data?.draft_orders ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Shopify Draft Orders</Title>
      <Text c="dimmed">Draft orders from your Shopify store (read_draft_orders scope).</Text>

      <Card withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {drafts.map((d) => (
              <Table.Tr key={d.id}>
                <Table.Td>{d.id}</Table.Td>
                <Table.Td>{d.name ?? "—"}</Table.Td>
                <Table.Td>
                  <Badge size="sm" variant="light">{d.status ?? "—"}</Badge>
                </Table.Td>
                <Table.Td>{d.total_price ?? "—"}</Table.Td>
                <Table.Td>{d.created_at ? new Date(d.created_at).toLocaleDateString() : "—"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {drafts.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No draft orders found.</Text>
        )}
      </Card>
    </Stack>
  );
}

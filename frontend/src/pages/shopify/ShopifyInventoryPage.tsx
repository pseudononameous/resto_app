import { useQuery } from "@tanstack/react-query";
import { Title, Card, Table, Text, Stack, Loader, Center, Alert } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyInventoryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "inventory"],
    queryFn: async () => {
      const res = await shopifyApi.inventory({ limit: 50 });
      return res.data as {
        inventory_levels?: Array<{
          inventory_item_id: number;
          location_id: number;
          available: number | null;
          updated_at?: string;
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
        {data?.error ?? (error as Error)?.message ?? "Failed to load inventory. Check read_inventory scope."}
      </Alert>
    );
  }

  const levels = data?.inventory_levels ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Shopify Inventory</Title>
      <Text c="dimmed">Inventory levels from your Shopify store (read_inventory scope).</Text>

      <Card withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Inventory item ID</Table.Th>
              <Table.Th>Location ID</Table.Th>
              <Table.Th>Available</Table.Th>
              <Table.Th>Updated</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {levels.map((l, i) => (
              <Table.Tr key={`${l.inventory_item_id}-${l.location_id}-${i}`}>
                <Table.Td>{l.inventory_item_id}</Table.Td>
                <Table.Td>{l.location_id}</Table.Td>
                <Table.Td>{l.available ?? "—"}</Table.Td>
                <Table.Td>{l.updated_at ? new Date(l.updated_at).toLocaleDateString() : "—"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {levels.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No inventory levels found.</Text>
        )}
      </Card>
    </Stack>
  );
}

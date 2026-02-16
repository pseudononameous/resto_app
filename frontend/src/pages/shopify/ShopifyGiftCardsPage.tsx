import { useQuery } from "@tanstack/react-query";
import { Title, Card, Table, Text, Badge, Stack, Loader, Center, Alert } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyGiftCardsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "gift_cards"],
    queryFn: async () => {
      const res = await shopifyApi.giftCards({ limit: 50, status: "enabled" });
      return res.data as {
        gift_cards?: Array<{
          id: number;
          balance?: string;
          initial_value?: string;
          last_characters?: string;
          enabled?: boolean;
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
        {data?.error ?? (error as Error)?.message ?? "Failed to load gift cards. Check read_gift_cards scope."}
      </Alert>
    );
  }

  const cards = data?.gift_cards ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Shopify Gift Cards</Title>
      <Text c="dimmed">Gift cards from your Shopify store (read_gift_cards scope).</Text>

      <Card withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Last 4</Table.Th>
              <Table.Th>Balance</Table.Th>
              <Table.Th>Initial value</Table.Th>
              <Table.Th>Enabled</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {cards.map((g) => (
              <Table.Tr key={g.id}>
                <Table.Td>{g.id}</Table.Td>
                <Table.Td>****{g.last_characters ?? "—"}</Table.Td>
                <Table.Td>{g.balance ?? "—"}</Table.Td>
                <Table.Td>{g.initial_value ?? "—"}</Table.Td>
                <Table.Td>
                  <Badge size="sm" color={g.enabled !== false ? "green" : "gray"}>
                    {g.enabled !== false ? "Yes" : "No"}
                  </Badge>
                </Table.Td>
                <Table.Td>{g.created_at ? new Date(g.created_at).toLocaleDateString() : "—"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {cards.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No gift cards found.</Text>
        )}
      </Card>
    </Stack>
  );
}

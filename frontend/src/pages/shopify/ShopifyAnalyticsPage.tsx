import { useQuery } from "@tanstack/react-query";
import { Title, Card, Table, Text, Stack, Loader, Center, Alert } from "@mantine/core";
import { shopifyApi } from "@services/api";

export default function ShopifyAnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify", "analytics"],
    queryFn: async () => {
      const res = await shopifyApi.analytics({ limit: 50 });
      return res.data as {
        reports?: Array<Record<string, unknown> & { id?: number; name?: string; created_at?: string }>;
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
        {data?.error ?? (error as Error)?.message ?? "Failed to load analytics/reports. Check read_analytics scope."}
      </Alert>
    );
  }

  const reports = data?.reports ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Shopify Analytics</Title>
      <Text c="dimmed">Reports from your Shopify store (read_analytics scope).</Text>

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
            {reports.map((r) => (
              <Table.Tr key={String(r.id ?? r)}>
                <Table.Td>{r.id ?? "—"}</Table.Td>
                <Table.Td>{String(r.name ?? "—")}</Table.Td>
                <Table.Td>{r.created_at ? new Date(r.created_at as string).toLocaleDateString() : "—"}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {reports.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">No reports found.</Text>
        )}
      </Card>
    </Stack>
  );
}

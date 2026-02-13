import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Title, Text, Card, Stack, Table, Badge, Select, Group } from "@mantine/core";
import { restoApi } from "@services/api";

export default function RestoOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", statusFilter],
    queryFn: async () => {
      const res = await restoApi.orders.list({
        query: statusFilter ? { orderStatus: statusFilter } : {},
        options: { paginate: 25, page: 1, sort: { createdAt: -1 } },
      });
      const result = res.data?.data ?? {};
      return result?.data ?? [];
    },
  });

  const orders = data ?? [];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Order Management</Title>
        <Select
          placeholder="Filter by status"
          data={[
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "preparing", label: "Preparing" },
            { value: "ready", label: "Ready" },
            { value: "out_for_delivery", label: "Out for delivery" },
            { value: "delivered", label: "Delivered" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
        />
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading orders...</Text>
        ) : orders.length === 0 ? (
          <Text c="dimmed">No orders found.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Created</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orders.map((o: Record<string, unknown>) => (
                <Table.Tr key={String(o.id)}>
                  <Table.Td>#{o.id}</Table.Td>
                  <Table.Td>{String(o.orderType)}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        o.orderStatus === "completed" || o.orderStatus === "delivered"
                          ? "green"
                          : o.orderStatus === "cancelled"
                            ? "red"
                            : "blue"
                      }
                    >
                      {String(o.orderStatus ?? "pending")}
                    </Badge>
                  </Table.Td>
                  <Table.Td>${Number(o.totalAmount ?? 0).toFixed(2)}</Table.Td>
                  <Table.Td>
                    {o.createdAt
                      ? new Date(o.createdAt as string).toLocaleString()
                      : "-"}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Stack>
  );
}


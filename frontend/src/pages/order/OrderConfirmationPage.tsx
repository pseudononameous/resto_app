import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Title, Text, Card, Stack, Group, Badge, Button } from "@mantine/core";
import { restoApi } from "@services/api";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await restoApi.getOrderStatus(id);
      return res.data?.data ?? null;
    },
    enabled: !!id,
  });

  if (isLoading || !data) {
    return (
      <Stack>
        <Title order={1}>Order Confirmation</Title>
        <Text c="dimmed">{isLoading ? "Loading..." : "Order not found."}</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Title order={1}>Order Confirmed</Title>
      <Text c="dimmed">Thank you for your order. We'll notify you when it's ready.</Text>

      <Card shadow="sm" padding="lg" withBorder>
        <Group justify="space-between">
          <Text fw={600}>Order #{data.id}</Text>
          <Badge
            color={
              data.orderStatus === "completed"
                ? "green"
                : data.orderStatus === "cancelled"
                  ? "red"
                  : "blue"
            }
          >
            {data.orderStatus}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed" mt="xs">
          Order type: {data.orderType}
        </Text>
        <Text size="sm" mt="xs">
          Total: ${Number(data.totalAmount ?? 0).toFixed(2)}
        </Text>
        {data.scheduledAt && (
          <Text size="sm" c="dimmed">
            Scheduled: {new Date(data.scheduledAt).toLocaleString()}
          </Text>
        )}
      </Card>

      <Group>
        <Button component={Link} to="/order">
          Order Again
        </Button>
        <Button variant="light" component={Link} to="/">
          Back to Dashboard
        </Button>
      </Group>
    </Stack>
  );
}

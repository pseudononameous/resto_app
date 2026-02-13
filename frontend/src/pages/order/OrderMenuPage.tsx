import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Title, Text, Card, Stack, Group, Badge, Image, Button, Select } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import { restoApi } from "@services/api";
import { useCart } from "@hooks/useCart";
import { Link } from "react-router-dom";

export default function OrderMenuPage() {
  const [locationId, setLocationId] = useState<number | null>(null);
  const { addItem, count } = useCart();

  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await restoApi.getLocations();
      return res.data?.data ?? [];
    },
  });

  const locations = locationsData ?? [];

  const { data: menuData, isLoading } = useQuery({
    queryKey: ["menu", locationId],
    queryFn: async () => {
      const res = await restoApi.getMenu({ locationId: locationId ?? undefined });
      return res.data?.data ?? { categories: [], menus: [] };
    },
    enabled: true,
  });

  const categories = menuData?.categories ?? [];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Order Online</Title>
        <Button component={Link} to="/order/checkout" leftSection={<IconShoppingCart size={18} />}>
          View Cart {count > 0 && `(${count})`}
        </Button>
      </Group>

      {locations.length > 0 && (
        <Select
          label="Location"
          placeholder="Select location"
          data={locations.map((l: { id: number; name: string }) => ({
            value: String(l.id),
            label: l.name,
          }))}
          value={locationId != null ? String(locationId) : null}
          onChange={(v) => setLocationId(v ? Number(v) : null)}
          clearable
        />
      )}

      {isLoading && <Text c="dimmed">Loading menu...</Text>}

      {categories.map((cat: { id: number; name: string; items: unknown[] }) => (
        <Card key={cat.id} shadow="sm" padding="lg" withBorder>
          <Title order={3} mb="md">
            {cat.name}
          </Title>
          <Stack gap="md">
            {(cat.items ?? []).map((item: Record<string, unknown>) => (
              <Card key={String(item.menuItemId ?? item.productId)} withBorder padding="md">
                <Group justify="space-between" wrap="nowrap">
                  <Stack gap={4}>
                    <Text fw={600}>{item.name}</Text>
                    {item.description && (
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {String(item.description)}
                      </Text>
                    )}
                    {(item.allergens as string[] | undefined)?.length && (
                      <Group gap={4}>
                        {(item.allergens as string[]).map((a: string) => (
                          <Badge key={a} size="xs" variant="light">
                            {a}
                          </Badge>
                        ))}
                      </Group>
                    )}
                    <Text fw={600} c="blue">
                      ${Number(item.displayPrice ?? item.basePrice ?? 0).toFixed(2)}
                    </Text>
                  </Stack>
                  {item.imageUrl && (
                    <Image
                      src={String(item.imageUrl)}
                      alt={String(item.name)}
                      w={80}
                      h={80}
                      fit="cover"
                      radius="sm"
                    />
                  )}
                </Group>
                <Button
                  variant="light"
                  mt="sm"
                  onClick={() =>
                    addItem({
                      productId: item.productId as number,
                      menuItemId: item.menuItemId as number,
                      name: item.name as string,
                      quantity: 1,
                      unitPrice: Number(item.displayPrice ?? item.basePrice ?? 0),
                      displayPrice: Number(item.displayPrice ?? item.basePrice ?? 0),
                      modifiers: [],
                    })
                  }
                >
                  Add to Cart
                </Button>
              </Card>
            ))}
          </Stack>
        </Card>
      ))}

      {!isLoading && categories.length === 0 && (
        <Text c="dimmed">No menu items available. Try selecting a different location.</Text>
      )}
    </Stack>
  );
}


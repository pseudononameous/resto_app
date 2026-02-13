import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  Select,
  NumberInput,
  Table,
  Modal,
  Checkbox,
  Divider,
  Badge,
  TextInput,
} from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";
import { restoApi, type PlaceOrderRequest } from "@services/api";
import { notifications } from "@mantine/notifications";

type ModifierGroup = {
  id: number;
  name: string;
  selectionType: string;
  requiredFlag: boolean;
  modifiers: Array< { id: number; name: string; priceDelta: number } >;
};

type MenuItem = {
  menuItemId: number;
  productId: number;
  name: string;
  displayPrice: number;
  modifierGroups?: ModifierGroup[];
};

type CartEntry = {
  productId: number;
  menuItemId?: number;
  name: string;
  quantity: number;
  unitPrice: number;
  modifiers: Array<{ modifierId: number; name: string; priceDelta: number }>;
};

export default function POSPage() {
  const [locationId, setLocationId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Array<{ modifierId: number; name: string; priceDelta: number }>>([]);
  const [orderType, setOrderType] = useState<"dine_in" | "takeout" | "delivery">("dine_in");
  const [guestName, setGuestName] = useState("");
  const [notes, setNotes] = useState("");

  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await restoApi.getLocations();
      return res.data?.data ?? [];
    },
  });

  const { data: menuData, isLoading } = useQuery({
    queryKey: ["menu", locationId],
    queryFn: async () => {
      const res = await restoApi.getMenu({ locationId: locationId ?? undefined });
      return res.data?.data ?? { categories: [], menus: [] };
    },
    enabled: !!locationId,
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (payload: PlaceOrderRequest) => {
      const res = await restoApi.placeOrder(payload);
      return res.data;
    },
    onSuccess: (data) => {
      setCart([]);
      setSelectedItem(null);
      setSelectedModifiers([]);
      notifications.show({
        title: "Order placed",
        message: `Order #${data?.data?.id} created.`,
        color: "green",
      });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      notifications.show({
        title: "Error",
        message: err?.response?.data?.message ?? "Failed to place order",
        color: "red",
      });
    },
  });

  const locations = (locationsData ?? []) as Array<{ id: number; name: string }>;
  const categories = (menuData?.categories ?? []) as Array<{ id: number; name: string; items: MenuItem[] }>;

  const subtotal = cart.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);

  const openAddModal = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedModifiers([]);
    setAddModalOpen(true);
  };

  const addToCart = () => {
    if (!selectedItem) return;
    const basePrice = selectedItem.displayPrice;
    const modTotal = selectedModifiers.reduce((s, m) => s + m.priceDelta, 0);
    const unitPrice = basePrice + modTotal;
    const existing = cart.find(
      (c) =>
        c.productId === selectedItem.productId &&
        JSON.stringify((c.modifiers ?? []).map((m) => m.modifierId).sort()) ===
          JSON.stringify(selectedModifiers.map((m) => m.modifierId).sort())
    );
    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c === existing ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          productId: selectedItem.productId,
          menuItemId: selectedItem.menuItemId,
          name: selectedItem.name,
          quantity: 1,
          unitPrice,
          modifiers: selectedModifiers,
        },
      ]);
    }
    setAddModalOpen(false);
    setSelectedItem(null);
    setSelectedModifiers([]);
  };

  const updateQuantity = (index: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setCart((prev) =>
      prev.map((c, i) => (i === index ? { ...c, quantity: qty } : c))
    );
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      notifications.show({ title: "Cart empty", message: "Add items first.", color: "orange" });
      return;
    }
    const payload: PlaceOrderRequest = {
      orderType,
      locationId: locationId ?? undefined,
      guestName: guestName || undefined,
      notes: notes || undefined,
      items: cart.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        displayPrice: i.unitPrice,
        modifiers: (i.modifiers ?? []).map((m) => ({ modifierId: m.modifierId })),
      })),
    };
    placeOrderMutation.mutate(payload);
  };

  const toggleModifier = (mod: { id: number; name: string; priceDelta: number }, group: ModifierGroup) => {
    const entry = { modifierId: mod.id, name: mod.name, priceDelta: Number(mod.priceDelta ?? 0) };
    setSelectedModifiers((prev) => {
      const has = prev.some((m) => m.modifierId === mod.id);
      if (group.selectionType === "single") {
        const others = prev.filter((m) => !(group.modifiers ?? []).some((g) => g.id === m.modifierId));
        return has ? others : [...others, entry];
      }
      return has ? prev.filter((m) => m.modifierId !== mod.id) : [...prev, entry];
    });
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>POS</Title>
        <Badge size="lg">Point of Sale</Badge>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        <Group gap="md">
          <Select
            label="Location"
            required
            placeholder="Select location"
            data={locations.map((l) => ({ value: String(l.id), label: l.name }))}
            value={locationId != null ? String(locationId) : null}
            onChange={(v) => setLocationId(v ? Number(v) : null)}
          />
          <Select
            label="Order Type"
            data={[
              { value: "dine_in", label: "Dine-in" },
              { value: "takeout", label: "Takeout" },
              { value: "delivery", label: "Delivery" },
            ]}
            value={orderType}
            onChange={(v) => v && setOrderType(v as "dine_in" | "takeout" | "delivery")}
          />
        </Group>
      </Card>

      <Group align="flex-start" wrap="nowrap" style={{ gap: 24 }}>
        <Card shadow="sm" padding="lg" withBorder style={{ flex: 2, minWidth: 0 }}>
          <Title order={3} mb="md">Menu</Title>
          {!locationId ? (
            <Text c="dimmed">Select a location to load the menu.</Text>
          ) : isLoading ? (
            <Text c="dimmed">Loading menu...</Text>
          ) : (
            <Stack gap="lg">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <Text fw={600} mb="xs">{cat.name}</Text>
                  <Group gap="xs">
                    {(cat.items ?? []).map((item) => (
                      <Button
                        key={item.menuItemId ?? item.productId}
                        variant="light"
                        onClick={() => openAddModal(item)}
                      >
                        {item.name} - ${Number(item.displayPrice ?? 0).toFixed(2)}
                      </Button>
                    ))}
                  </Group>
                </div>
              ))}
              {categories.length === 0 && <Text c="dimmed">No menu items for this location.</Text>}
            </Stack>
          )}
        </Card>

        <Card shadow="sm" padding="lg" withBorder style={{ flex: 1, minWidth: 280 }}>
          <Title order={3} mb="md">Cart ({cart.reduce((s, c) => s + c.quantity, 0)} items)</Title>
          {cart.length === 0 ? (
            <Text c="dimmed">Cart is empty.</Text>
          ) : (
            <>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Item</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cart.map((c, i) => (
                    <Table.Tr key={i}>
                      <Table.Td>
                        <Text size="sm">{c.name}</Text>
                        {(c.modifiers ?? []).length > 0 && (
                          <Text size="xs" c="dimmed">+{c.modifiers!.map((m) => m.name).join(", ")}</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          size="xs"
                          min={1}
                          value={c.quantity}
                          onChange={(v) => updateQuantity(i, Number(v) || 1)}
                          w={60}
                        />
                      </Table.Td>
                      <Table.Td>${(c.unitPrice * c.quantity).toFixed(2)}</Table.Td>
                      <Table.Td>
                        <Button size="xs" variant="subtle" color="red" onClick={() => removeFromCart(i)}>×</Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Divider my="md" />
              <Text fw={600}>Subtotal: ${subtotal.toFixed(2)}</Text>
              <TextInput label="Guest name" placeholder="Optional" value={guestName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuestName(e.target.value)} mt="sm" />
              <TextInput label="Notes" placeholder="Optional" value={notes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)} />
              <Button
                leftSection={<IconReceipt size={18} />}
                fullWidth
                mt="md"
                onClick={handleCheckout}
                loading={placeOrderMutation.isPending}
              >
                Complete Purchase
              </Button>
            </>
          )}
        </Card>
      </Group>

      <Modal
        opened={addModalOpen}
        onClose={() => { setAddModalOpen(false); setSelectedItem(null); setSelectedModifiers([]); }}
        title={selectedItem ? `Add: ${selectedItem.name}` : "Add to cart"}
      >
        {selectedItem && (
          <Stack gap="md">
            <Text>${Number(selectedItem.displayPrice).toFixed(2)}</Text>
            {(selectedItem.modifierGroups ?? []).map((grp) => (
              <div key={grp.id}>
                <Text size="sm" fw={500}>{grp.name} {grp.requiredFlag && "*"}</Text>
                <Stack gap={4} mt={4}>
                  {(grp.modifiers ?? []).map((mod) => (
                    <Checkbox
                      key={mod.id}
                      label={`${mod.name} ${mod.priceDelta ? `(+$${Number(mod.priceDelta).toFixed(2)})` : ""}`}
                      checked={selectedModifiers.some((m) => m.modifierId === mod.id)}
                      onChange={() => toggleModifier(mod, grp)}
                    />
                  ))}
                </Stack>
              </div>
            ))}
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setAddModalOpen(false)}>Cancel</Button>
              <Button onClick={addToCart}>
                Add to Cart (${(Number(selectedItem.displayPrice) + selectedModifiers.reduce((s, m) => s + m.priceDelta, 0)).toFixed(2)})
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}

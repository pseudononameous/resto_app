import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  NumberInput,
  Table,
  Badge,
  Divider,
  Alert,
} from "@mantine/core";
import { restoApi, type PlaceOrderRequest } from "@services/api";
import { useCart } from "@hooks/useCart";
import { notifications } from "@mantine/notifications";

export default function OrderCheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, updateQuantity, removeItem } = useCart();
  const [orderType, setOrderType] = useState<"delivery" | "takeout" | "dine_in">("takeout");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryZoneId, setDeliveryZoneId] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");

  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await restoApi.getLocations();
      return res.data?.data ?? [];
    },
  });

  const { data: zonesData } = useQuery({
    queryKey: ["deliveryZones", locationId],
    queryFn: async () => {
      if (!locationId) return [];
      const res = await restoApi.getDeliveryZones(locationId);
      return res.data?.data ?? [];
    },
    enabled: !!locationId && orderType === "delivery",
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (payload: PlaceOrderRequest) => {
      const res = await restoApi.placeOrder(payload);
      return res.data;
    },
    onSuccess: (data) => {
      clearCart();
      notifications.show({ title: "Order placed", message: "Your order has been submitted.", color: "green" });
      navigate(`/order/confirmation/${data?.data?.id}`, { state: { order: data?.data } });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      notifications.show({
        title: "Error",
        message: err?.response?.data?.message ?? "Failed to place order",
        color: "red",
      });
    },
  });

  const handleSubmit = () => {
    if (items.length === 0) {
      notifications.show({ title: "Cart empty", message: "Add items to cart first.", color: "orange" });
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      notifications.show({ title: "Required", message: "Enter delivery address.", color: "red" });
      return;
    }

    const payload: PlaceOrderRequest = {
      orderType,
      locationId: locationId ?? undefined,
      guestName: guestName || undefined,
      guestEmail: guestEmail || undefined,
      guestPhone: guestPhone || undefined,
      deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
      deliveryZoneId: deliveryZoneId ?? undefined,
      deliveryFee: orderType === "delivery" ? deliveryFee : 0,
      paymentMethod,
      notes: notes || undefined,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        displayPrice: i.displayPrice ?? i.unitPrice,
        modifiers: (i.modifiers ?? []).map((m) => ({ modifierId: m.modifierId })),
      })),
    };

    placeOrderMutation.mutate(payload);
  };

  const locations = locationsData ?? [];
  const zones = zonesData ?? [];
  const total = subtotal + (orderType === "delivery" ? deliveryFee : 0);

  if (items.length === 0 && !placeOrderMutation.isPending) {
    return (
      <Stack>
        <Title order={1}>Checkout</Title>
        <Alert color="blue">Your cart is empty. Browse the menu to add items.</Alert>
        <Button variant="light" onClick={() => navigate("/order")}>
          View Menu
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Title order={1}>Checkout</Title>

      <Card shadow="sm" padding="lg" withBorder>
        <Title order={3} mb="md">
          Order Summary
        </Title>
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
            {items.map((item, idx) => (
              <Table.Tr key={idx}>
                <Table.Td>
                  <Text fw={500}>{item.name}</Text>
                  {(item.modifiers ?? []).length > 0 && (
                    <Text size="xs" c="dimmed">
                      +{(item.modifiers ?? []).map((m) => m.name).join(", ")}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    size="xs"
                    min={1}
                    value={item.quantity}
                    onChange={(v) => updateQuantity(idx, Number(v) || 1)}
                    w={70}
                  />
                </Table.Td>
                <Table.Td>${(item.unitPrice * item.quantity).toFixed(2)}</Table.Td>
                <Table.Td>
                  <Button size="xs" variant="subtle" color="red" onClick={() => removeItem(idx)}>
                    Remove
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group justify="flex-end" mt="md">
          <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
        </Group>
      </Card>

      <Card shadow="sm" padding="lg" withBorder>
        <Title order={3} mb="md">
          Order Details
        </Title>
        <Stack gap="md">
          <Select
            label="Order type"
            data={[
              { value: "takeout", label: "Pickup" },
              { value: "delivery", label: "Delivery" },
              { value: "dine_in", label: "Dine-in" },
            ]}
            value={orderType}
            onChange={(v) => v && setOrderType(v as "delivery" | "takeout" | "dine_in")}
          />
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
          {orderType === "delivery" && (
            <>
              <TextInput
                label="Delivery address"
                placeholder="Street, city, zip"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              <Select
                label="Delivery zone (optional)"
                placeholder="Select zone"
                data={zones.map((z: { id: number; name: string; deliveryFee: number }) => ({
                  value: String(z.id),
                  label: `${z.name} - $${Number(z.deliveryFee).toFixed(2)}`,
                }))}
                value={deliveryZoneId != null ? String(deliveryZoneId) : null}
                onChange={(v) => {
                  setDeliveryZoneId(v ? Number(v) : null);
                  const z = zones.find((zn: { id: number }) => zn.id === Number(v));
                  setDeliveryFee(z ? Number(z.deliveryFee) : 0);
                }}
                clearable
              />
              {deliveryFee > 0 && <Text size="sm">Delivery fee: ${deliveryFee.toFixed(2)}</Text>}
            </>
          )}
          <TextInput
            label="Your name"
            placeholder="Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
          />
          <TextInput
            label="Phone"
            placeholder="Phone number"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
          />
          <Select
            label="Payment method"
            data={[
              { value: "cod", label: "Cash on delivery/pickup" },
              { value: "card", label: "Card" },
              { value: "paypal", label: "PayPal" },
              { value: "stripe", label: "Stripe" },
            ]}
            value={paymentMethod}
            onChange={(v) => v && setPaymentMethod(v)}
          />
          <TextInput
            label="Special instructions"
            placeholder="Notes for the kitchen"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Stack>
      </Card>

      <Group justify="space-between">
        <Text fw={700} size="lg">
          Total: ${total.toFixed(2)}
        </Text>
        <Button
          loading={placeOrderMutation.isPending}
          onClick={handleSubmit}
        >
          Place Order
        </Button>
      </Group>
    </Stack>
  );
}

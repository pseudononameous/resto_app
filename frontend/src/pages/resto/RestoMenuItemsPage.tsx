import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Title,
  Text,
  Card,
  Stack,
  Table,
  Group,
  Button,
  ActionIcon,
  Modal,
  Select,
  NumberInput,
  Badge,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type MenuItemRow = {
  id: number;
  menuId: number;
  productId: number;
  displayPrice?: number | null;
  availabilityStatus?: string | null;
  sortOrder?: number;
};
type MenuRow = { id: number; name: string };
type ProductRow = { id: number; name: string; basePrice: number };

export default function RestoMenuItemsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    menuId: 0,
    productId: 0,
    displayPrice: null as number | null,
    availabilityStatus: "available",
    sortOrder: 0,
  });

  const { data: menusData } = useQuery({
    queryKey: ["menus-admin"],
    queryFn: async () => {
      const res = await restoApi.menus.list({ query: {}, options: { paginate: 100, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ["products-admin"],
    queryFn: async () => {
      const res = await restoApi.products.list({ query: {}, options: { paginate: 200, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["menu-items-admin"],
    queryFn: async () => {
      const res = await restoApi.menuItems.list({ query: {}, options: { paginate: 200, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.menuItems.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items-admin"] });
      setModalOpen(false);
      setForm({ menuId: menusData?.[0]?.id ?? 0, productId: productsData?.[0]?.id ?? 0, displayPrice: null, availabilityStatus: "available", sortOrder: 0 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) => restoApi.menuItems.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items-admin"] });
      setModalOpen(false);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.menuItems.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu-items-admin"] }),
  });

  const menuItems = (data ?? []) as MenuItemRow[];
  const menus = (menusData ?? []) as MenuRow[];
  const products = (productsData ?? []) as ProductRow[];

  const openCreate = () => {
    setEditingId(null);
    setForm({
      menuId: menus[0]?.id ?? 0,
      productId: products[0]?.id ?? 0,
      displayPrice: null,
      availabilityStatus: "available",
      sortOrder: menuItems.length,
    });
    setModalOpen(true);
  };

  const openEdit = (row: MenuItemRow) => {
    setEditingId(row.id);
    const prod = products.find((p) => p.id === row.productId);
    setForm({
      menuId: row.menuId,
      productId: row.productId,
      displayPrice: row.displayPrice != null ? Number(row.displayPrice) : (prod ? Number(prod.basePrice) : null),
      availabilityStatus: row.availabilityStatus ?? "available",
      sortOrder: row.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      menuId: form.menuId,
      productId: form.productId,
      displayPrice: form.displayPrice ?? undefined,
      availabilityStatus: form.availabilityStatus || null,
      sortOrder: form.sortOrder,
    };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    if (confirm("Remove this product from the menu?")) deleteMutation.mutate(id);
  };

  const getMenuName = (id: number) => menus.find((m) => m.id === id)?.name ?? `#${id}`;
  const getProductName = (id: number) => products.find((p) => p.id === id)?.name ?? `#${id}`;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Menu Items</Title>
          <Text c="dimmed">Add products to menus with prices. Products in menus appear in POS and online ordering.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate} disabled={menus.length === 0 || products.length === 0}>
          Add to Menu
        </Button>
      </Group>

      {(menus.length === 0 || products.length === 0) && (
        <Text c="dimmed" size="sm">Add menus and products first.</Text>
      )}

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading...</Text>
        ) : menuItems.length === 0 ? (
          <Text c="dimmed">No menu items. Add products to menus.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Menu</Table.Th>
                <Table.Th>Product</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Sort</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {menuItems.map((mi) => (
                <Table.Tr key={mi.id}>
                  <Table.Td>{getMenuName(mi.menuId)}</Table.Td>
                  <Table.Td>{getProductName(mi.productId)}</Table.Td>
                  <Table.Td>${Number(mi.displayPrice ?? 0).toFixed(2)}</Table.Td>
                  <Table.Td>
                    <Badge color={mi.availabilityStatus === "out_of_stock" ? "red" : "green"}>{mi.availabilityStatus ?? "available"}</Badge>
                  </Table.Td>
                  <Table.Td>{mi.sortOrder ?? 0}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(mi)}><IconEdit size={16} /></ActionIcon>
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(mi.id)}><IconTrash size={16} /></ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Menu Item" : "Add Menu Item"}>
        <Stack gap="md">
          <Select label="Menu" required data={menus.map((m) => ({ value: String(m.id), label: m.name }))} value={String(form.menuId || "")} onChange={(v) => setForm({ ...form, menuId: v ? Number(v) : 0 })} />
          <Select label="Product" required data={products.map((p) => ({ value: String(p.id), label: `${p.name} ($${Number(p.basePrice).toFixed(2)})` }))} value={String(form.productId || "")} onChange={(v) => setForm({ ...form, productId: v ? Number(v) : 0 })} />
          <NumberInput label="Display Price (override product base price)" min={0} value={form.displayPrice ?? ""} onChange={(v) => setForm({ ...form, displayPrice: v === "" ? null : Number(v) })} placeholder="Leave blank to use product price" />
          <Select label="Availability" data={[{ value: "available", label: "Available" }, { value: "out_of_stock", label: "Out of Stock" }, { value: "scheduled", label: "Scheduled" }]} value={form.availabilityStatus} onChange={(v) => setForm({ ...form, availabilityStatus: v ?? "available" })} />
          <NumberInput label="Sort Order" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: Number(v) || 0 })} />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} disabled={!form.menuId || !form.productId}>
              {editingId ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

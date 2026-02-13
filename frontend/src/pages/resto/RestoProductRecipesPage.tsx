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
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type ProductRecipeRow = { id: number; productId: number; inventoryId: number; quantityRequired: number };
type ProductRow = { id: number; name: string };
type InventoryRow = { id: number; name: string; unit: string };

export default function RestoProductRecipesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ productId: 0, inventoryId: 0, quantityRequired: 1 });

  const { data: productsData } = useQuery({
    queryKey: ["products-admin"],
    queryFn: async () => {
      const res = await restoApi.products.list({ query: {}, options: { paginate: 100, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const { data: inventoryData } = useQuery({
    queryKey: ["inventory-admin"],
    queryFn: async () => {
      const res = await restoApi.inventoryItems.list({ query: {}, options: { paginate: 100, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["product-recipes-admin"],
    queryFn: async () => {
      const res = await restoApi.productRecipes.list({ query: {}, options: { paginate: 200, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.productRecipes.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-recipes-admin"] });
      setModalOpen(false);
      setForm({ productId: productsData?.[0]?.id ?? 0, inventoryId: inventoryData?.[0]?.id ?? 0, quantityRequired: 1 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) => restoApi.productRecipes.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-recipes-admin"] });
      setModalOpen(false);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.productRecipes.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product-recipes-admin"] }),
  });

  const recipes = (data ?? []) as ProductRecipeRow[];
  const products = (productsData ?? []) as ProductRow[];
  const inventory = (inventoryData ?? []) as InventoryRow[];

  const openCreate = () => {
    setEditingId(null);
    setForm({ productId: products[0]?.id ?? 0, inventoryId: inventory[0]?.id ?? 0, quantityRequired: 1 });
    setModalOpen(true);
  };

  const openEdit = (row: ProductRecipeRow) => {
    setEditingId(row.id);
    setForm({
      productId: row.productId,
      inventoryId: row.inventoryId,
      quantityRequired: Number(row.quantityRequired ?? 1),
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = { productId: form.productId, inventoryId: form.inventoryId, quantityRequired: form.quantityRequired };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    if (confirm("Remove this recipe link?")) deleteMutation.mutate(id);
  };

  const getProductName = (id: number) => products.find((p) => p.id === id)?.name ?? `#${id}`;
  const getInventoryName = (id: number) => {
    const inv = inventory.find((i) => i.id === id);
    return inv ? `${inv.name} (${inv.unit})` : `#${id}`;
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Product Recipes</Title>
          <Text c="dimmed">Link products to inventory ingredients with quantities.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate} disabled={products.length === 0 || inventory.length === 0}>
          Add Recipe
        </Button>
      </Group>

      {(products.length === 0 || inventory.length === 0) && (
        <Text c="dimmed" size="sm">Add products and inventory items first.</Text>
      )}

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading...</Text>
        ) : recipes.length === 0 ? (
          <Text c="dimmed">No recipe links. Add products to menus first, then link ingredients.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Inventory</Table.Th>
                <Table.Th>Quantity Required</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recipes.map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td>{getProductName(r.productId)}</Table.Td>
                  <Table.Td>{getInventoryName(r.inventoryId)}</Table.Td>
                  <Table.Td>{Number(r.quantityRequired)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(r)}><IconEdit size={16} /></ActionIcon>
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(r.id)}><IconTrash size={16} /></ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Recipe" : "Add Recipe"}>
        <Stack gap="md">
          <Select label="Product" required data={products.map((p) => ({ value: String(p.id), label: p.name }))} value={String(form.productId || "")} onChange={(v) => setForm({ ...form, productId: v ? Number(v) : 0 })} />
          <Select label="Inventory Item" required data={inventory.map((i) => ({ value: String(i.id), label: `${i.name} (${i.unit})` }))} value={String(form.inventoryId || "")} onChange={(v) => setForm({ ...form, inventoryId: v ? Number(v) : 0 })} />
          <NumberInput label="Quantity Required" min={0.001} step={0.1} value={form.quantityRequired} onChange={(v) => setForm({ ...form, quantityRequired: Number(v) || 1 })} />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} disabled={!form.productId || !form.inventoryId}>
              {editingId ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

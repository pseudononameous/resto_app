import { useState, useEffect } from "react";
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
  TextInput,
  Select,
  Switch,
  NumberInput,
  MultiSelect,
  Badge,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type ProductRow = {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  categoryId?: number | null;
  activeFlag: boolean;
  imageUrl?: string;
};
type CategoryRow = { id: number; name: string };
type ModifierGroupRow = { id: number; name: string };
type ProductModifierGroupRow = { id: number; productId: number; modifierGroupId: number };

export default function RestoProductsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: 0,
    categoryId: null as number | null,
    activeFlag: true,
    imageUrl: "",
  });
  const [linkedModifierGroupIds, setLinkedModifierGroupIds] = useState<number[]>([]);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-admin"],
    queryFn: async () => {
      const res = await restoApi.categories.list({ query: {}, options: { paginate: 100, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const { data: groupsData } = useQuery({
    queryKey: ["modifier-groups-admin"],
    queryFn: async () => {
      const res = await restoApi.modifierGroups.list({ query: {}, options: { paginate: 100, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const { data: pmgData } = useQuery({
    queryKey: ["product-modifier-groups-admin", editingId],
    queryFn: async () => {
      const res = await restoApi.productModifierGroups.list({
        query: editingId ? { productId: editingId } : {},
        options: { paginate: 100, page: 1 },
      });
      return (res.data?.data ?? {})?.data ?? [];
    },
    enabled: !!editingId,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products-admin"],
    queryFn: async () => {
      const res = await restoApi.products.list({ query: {}, options: { paginate: 100, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (vars: { payload: object; modifierGroupIds?: number[] }) => {
      const res = await restoApi.products.create(vars.payload);
      const created = (res.data?.data as { id?: number }) ?? res.data?.data;
      const id = typeof created === "object" && created && "id" in created ? created.id : null;
      if (id && vars.modifierGroupIds?.length) {
        for (const mgId of vars.modifierGroupIds) {
          await restoApi.productModifierGroups.create({ productId: id, modifierGroupId: mgId });
        }
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      queryClient.invalidateQueries({ queryKey: ["product-modifier-groups-admin"] });
      setModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) => restoApi.products.update(id, data),
    onSuccess: async (_, { id, modifierGroupIds }) => {
      if (modifierGroupIds) {
        const existing = (pmgData ?? []) as ProductModifierGroupRow[];
        const existingIds = existing.filter((p) => p.productId === id).map((p) => p.modifierGroupId);
        for (const mgId of modifierGroupIds) {
          if (!existingIds.includes(mgId)) {
            await restoApi.productModifierGroups.create({ productId: id, modifierGroupId: mgId });
          }
        }
        for (const pmg of existing.filter((p) => p.productId === id)) {
          if (!modifierGroupIds.includes(pmg.modifierGroupId)) {
            await restoApi.productModifierGroups.delete(pmg.id);
          }
        }
      }
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      queryClient.invalidateQueries({ queryKey: ["product-modifier-groups-admin"] });
      setModalOpen(false);
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.products.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products-admin"] }),
  });

  const products = (data ?? []) as ProductRow[];
  const categories = (categoriesData ?? []) as CategoryRow[];
  const groups = (groupsData ?? []) as ModifierGroupRow[];
  const pmgs = (pmgData ?? []) as ProductModifierGroupRow[];

  const resetForm = () => {
    setForm({ name: "", description: "", basePrice: 0, categoryId: null, activeFlag: true, imageUrl: "" });
    setLinkedModifierGroupIds([]);
  };

  const openCreate = () => {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
  };

  useEffect(() => {
    if (editingId && modalOpen && pmgData) {
      const list = (pmgData as ProductModifierGroupRow[]).filter((p) => p.productId === editingId);
      setLinkedModifierGroupIds(list.map((p) => p.modifierGroupId));
    }
  }, [editingId, modalOpen, pmgData]);

  const openEdit = (row: ProductRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      description: row.description ?? "",
      basePrice: Number(row.basePrice ?? 0),
      categoryId: row.categoryId ?? null,
      activeFlag: row.activeFlag ?? true,
      imageUrl: row.imageUrl ?? "",
    });
    setLinkedModifierGroupIds([]);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name,
      description: form.description || null,
      basePrice: form.basePrice,
      categoryId: form.categoryId ?? undefined,
      activeFlag: form.activeFlag,
      imageUrl: form.imageUrl || null,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload, modifierGroupIds: linkedModifierGroupIds });
    } else {
      createMutation.mutate({ payload, modifierGroupIds: linkedModifierGroupIds });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this product?")) deleteMutation.mutate(id);
  };

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name ?? `#${id}`;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Products</Title>
          <Text c="dimmed">Products that can be added to menus.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Product
        </Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading...</Text>
        ) : products.length === 0 ? (
          <Text c="dimmed">No products. Add categories first, then products.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {products.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>{p.name}</Table.Td>
                  <Table.Td>{p.categoryId ? getCategoryName(p.categoryId) : "-"}</Table.Td>
                  <Table.Td>${Number(p.basePrice ?? 0).toFixed(2)}</Table.Td>
                  <Table.Td>
                    <Badge color={p.activeFlag ? "green" : "gray"}>{p.activeFlag ? "Active" : "Inactive"}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(p)}><IconEdit size={16} /></ActionIcon>
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(p.id)}><IconTrash size={16} /></ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Product" : "Add Product"} size="md">
        <Stack gap="md">
          <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextInput label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <NumberInput label="Base Price ($)" min={0} value={form.basePrice} onChange={(v) => setForm({ ...form, basePrice: Number(v) || 0 })} />
          <Select
            label="Category"
            placeholder="None"
            clearable
            data={categories.map((c) => ({ value: String(c.id), label: c.name }))}
            value={form.categoryId != null ? String(form.categoryId) : null}
            onChange={(v) => setForm({ ...form, categoryId: v ? Number(v) : null })}
          />
          <TextInput label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <MultiSelect
            label="Modifier Groups"
            description="Link add-on groups (e.g. Size, Extras) to this product"
            data={groups.map((g) => ({ value: String(g.id), label: g.name }))}
            value={linkedModifierGroupIds.map(String)}
            onChange={(v) => setLinkedModifierGroupIds(v.map(Number))}
            placeholder="Select modifier groups"
          />
          <Switch label="Active" checked={form.activeFlag} onChange={(e) => setForm({ ...form, activeFlag: e.currentTarget.checked })} />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} disabled={!form.name}>
              {editingId ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

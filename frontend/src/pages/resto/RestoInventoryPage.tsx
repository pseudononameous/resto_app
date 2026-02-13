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
  TextInput,
  NumberInput,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type InventoryRow = {
  id: number;
  name: string;
  unit: string;
  quantityOnHand: number;
  reorderLevel?: number | null;
};

export default function RestoInventoryPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    unit: "",
    quantityOnHand: 0,
    reorderLevel: null as number | null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-admin"],
    queryFn: async () => {
      const res = await restoApi.inventoryItems.list({
        query: {},
        options: { paginate: 100, page: 1 },
      });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.inventoryItems.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-admin"] });
      setModalOpen(false);
      setForm({ name: "", unit: "", quantityOnHand: 0, reorderLevel: null });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      restoApi.inventoryItems.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-admin"] });
      setModalOpen(false);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.inventoryItems.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory-admin"] }),
  });

  const items = (data ?? []) as InventoryRow[];

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", unit: "units", quantityOnHand: 0, reorderLevel: null });
    setModalOpen(true);
  };

  const openEdit = (row: InventoryRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      unit: row.unit,
      quantityOnHand: Number(row.quantityOnHand ?? 0),
      reorderLevel: row.reorderLevel ?? null,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name,
      unit: form.unit,
      quantityOnHand: form.quantityOnHand,
      reorderLevel: form.reorderLevel ?? undefined,
    };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this inventory item?")) deleteMutation.mutate(id);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Inventory</Title>
          <Text c="dimmed">Raw ingredients and stock items. Link to products via recipes.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Item
        </Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading...</Text>
        ) : items.length === 0 ? (
          <Text c="dimmed">No inventory items. Add items to create product recipes.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Unit</Table.Th>
                <Table.Th>On Hand</Table.Th>
                <Table.Th>Reorder Level</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((i) => (
                <Table.Tr key={i.id}>
                  <Table.Td>{i.name}</Table.Td>
                  <Table.Td>{i.unit}</Table.Td>
                  <Table.Td>{Number(i.quantityOnHand ?? 0)}</Table.Td>
                  <Table.Td>{i.reorderLevel != null ? i.reorderLevel : "-"}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(i)}><IconEdit size={16} /></ActionIcon>
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(i.id)}><IconTrash size={16} /></ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Inventory Item" : "Add Inventory Item"}>
        <Stack gap="md">
          <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextInput label="Unit" required placeholder="e.g. kg, L, units" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          <NumberInput label="Quantity On Hand" min={0} value={form.quantityOnHand} onChange={(v) => setForm({ ...form, quantityOnHand: Number(v) || 0 })} />
          <NumberInput label="Reorder Level" min={0} value={form.reorderLevel ?? ""} onChange={(v) => setForm({ ...form, reorderLevel: v === "" ? null : Number(v) })} placeholder="Optional" />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} disabled={!form.name || !form.unit}>
              {editingId ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

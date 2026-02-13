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
  Select,
  NumberInput,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type ModifierRow = { id: number; modifierGroupId: number; name: string; priceDelta: number };
type ModifierGroupRow = { id: number; name: string };

export default function RestoModifiersPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ modifierGroupId: 0, name: "", priceDelta: 0 });

  const { data: groupsData } = useQuery({
    queryKey: ["modifier-groups-admin"],
    queryFn: async () => {
      const res = await restoApi.modifierGroups.list({ query: {}, options: { paginate: 100, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["modifiers-admin"],
    queryFn: async () => {
      const res = await restoApi.modifiers.list({ query: {}, options: { paginate: 100, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.modifiers.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifiers-admin"] });
      setModalOpen(false);
      setForm({ modifierGroupId: groupsData?.[0]?.id ?? 0, name: "", priceDelta: 0 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) => restoApi.modifiers.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifiers-admin"] });
      setModalOpen(false);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.modifiers.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["modifiers-admin"] }),
  });

  const modifiers = (data ?? []) as ModifierRow[];
  const groups = (groupsData ?? []) as ModifierGroupRow[];

  const openCreate = () => {
    setEditingId(null);
    setForm({ modifierGroupId: groups[0]?.id ?? 0, name: "", priceDelta: 0 });
    setModalOpen(true);
  };

  const openEdit = (row: ModifierRow) => {
    setEditingId(row.id);
    setForm({ modifierGroupId: row.modifierGroupId, name: row.name, priceDelta: Number(row.priceDelta ?? 0) });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = { modifierGroupId: form.modifierGroupId, name: form.name, priceDelta: form.priceDelta };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this modifier?")) deleteMutation.mutate(id);
  };

  const getGroupName = (id: number) => groups.find((g) => g.id === id)?.name ?? `#${id}`;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Modifiers</Title>
          <Text c="dimmed">Individual add-on options within modifier groups.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate} disabled={groups.length === 0}>
          Add Modifier
        </Button>
      </Group>

      {groups.length === 0 && <Text c="dimmed" size="sm">Add a modifier group first.</Text>}

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading...</Text>
        ) : modifiers.length === 0 ? (
          <Text c="dimmed">No modifiers.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Group</Table.Th>
                <Table.Th>Price Delta</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {modifiers.map((m) => (
                <Table.Tr key={m.id}>
                  <Table.Td>{m.name}</Table.Td>
                  <Table.Td>{getGroupName(m.modifierGroupId)}</Table.Td>
                  <Table.Td>${Number(m.priceDelta ?? 0).toFixed(2)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(m)}><IconEdit size={16} /></ActionIcon>
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(m.id)}><IconTrash size={16} /></ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Modifier" : "Add Modifier"}>
        <Stack gap="md">
          <Select
            label="Modifier Group"
            required
            data={groups.map((g) => ({ value: String(g.id), label: g.name }))}
            value={String(form.modifierGroupId || "")}
            onChange={(v) => setForm({ ...form, modifierGroupId: v ? Number(v) : 0 })}
          />
          <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <NumberInput label="Price Delta ($)" value={form.priceDelta} onChange={(v) => setForm({ ...form, priceDelta: Number(v) || 0 })} />
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

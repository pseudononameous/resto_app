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
  Switch,
  Badge,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type MenuRow = { id: number; name: string; locationId?: number | null; activeFlag: boolean };
type LocationRow = { id: number; name: string };

export default function RestoMenusPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", locationId: null as number | null, activeFlag: true });

  const { data: locationsData } = useQuery({
    queryKey: ["locations-admin"],
    queryFn: async () => {
      const res = await restoApi.locations.list({ query: {}, options: { paginate: 50, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["menus-admin"],
    queryFn: async () => {
      const res = await restoApi.menus.list({ query: {}, options: { paginate: 100, page: 1 } });
      return (res.data?.data ?? {})?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.menus.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus-admin"] });
      setModalOpen(false);
      setForm({ name: "", locationId: null, activeFlag: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) => restoApi.menus.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus-admin"] });
      setModalOpen(false);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.menus.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus-admin"] }),
  });

  const menus = (data ?? []) as MenuRow[];
  const locations = (locationsData ?? []) as LocationRow[];

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", locationId: locations[0]?.id ?? null, activeFlag: true });
    setModalOpen(true);
  };

  const openEdit = (row: MenuRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      locationId: row.locationId ?? null,
      activeFlag: row.activeFlag ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = { name: form.name, locationId: form.locationId ?? undefined, activeFlag: form.activeFlag };
    if (editingId) updateMutation.mutate({ id: editingId, data: payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this menu? Menu items will be removed.")) deleteMutation.mutate(id);
  };

  const getLocationName = (id: number) => locations.find((l) => l.id === id)?.name ?? `#${id}`;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Menus</Title>
          <Text c="dimmed">Menus per location. Add products via Menu Items.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Menu
        </Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading...</Text>
        ) : menus.length === 0 ? (
          <Text c="dimmed">No menus. Add a menu to add products to it.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {menus.map((m) => (
                <Table.Tr key={m.id}>
                  <Table.Td>{m.name}</Table.Td>
                  <Table.Td>{m.locationId ? getLocationName(m.locationId) : "All"}</Table.Td>
                  <Table.Td>
                    <Badge color={m.activeFlag ? "green" : "gray"}>{m.activeFlag ? "Active" : "Inactive"}</Badge>
                  </Table.Td>
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

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Menu" : "Add Menu"}>
        <Stack gap="md">
          <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select
            label="Location"
            placeholder="All locations"
            clearable
            data={locations.map((l) => ({ value: String(l.id), label: l.name }))}
            value={form.locationId != null ? String(form.locationId) : null}
            onChange={(v) => setForm({ ...form, locationId: v ? Number(v) : null })}
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

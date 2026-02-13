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
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type ModifierGroupRow = {
  id: number;
  name: string;
  selectionType: string;
  requiredFlag: boolean;
};

export default function RestoModifierGroupsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", selectionType: "single", requiredFlag: false });

  const { data, isLoading } = useQuery({
    queryKey: ["modifier-groups-admin"],
    queryFn: async () => {
      const res = await restoApi.modifierGroups.list({
        query: {},
        options: { paginate: 100, page: 1 },
      });
      const result = res.data?.data ?? {};
      return result?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.modifierGroups.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifier-groups-admin"] });
      setModalOpen(false);
      setForm({ name: "", selectionType: "single", requiredFlag: false });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      restoApi.modifierGroups.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modifier-groups-admin"] });
      setModalOpen(false);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.modifierGroups.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["modifier-groups-admin"] }),
  });

  const groups = (data ?? []) as ModifierGroupRow[];

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", selectionType: "single", requiredFlag: false });
    setModalOpen(true);
  };

  const openEdit = (row: ModifierGroupRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      selectionType: row.selectionType ?? "single",
      requiredFlag: row.requiredFlag ?? false,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = { name: form.name, selectionType: form.selectionType, requiredFlag: form.requiredFlag };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this modifier group? Modifiers in it will be orphaned.")) deleteMutation.mutate(id);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Modifier Groups</Title>
          <Text c="dimmed">Groups for add-ons (e.g. Size, Extras). Link to products.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Modifier Group
        </Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading...</Text>
        ) : groups.length === 0 ? (
          <Text c="dimmed">No modifier groups. Add one to create product options.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Selection</Table.Th>
                <Table.Th>Required</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {groups.map((g) => (
                <Table.Tr key={g.id}>
                  <Table.Td>{g.name}</Table.Td>
                  <Table.Td>{g.selectionType}</Table.Td>
                  <Table.Td>{g.requiredFlag ? "Yes" : "No"}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(g)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(g.id)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Modifier Group" : "Add Modifier Group"}>
        <Stack gap="md">
          <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select
            label="Selection Type"
            data={[
              { value: "single", label: "Single (e.g. pick one size)" },
              { value: "multiple", label: "Multiple (e.g. add extras)" },
            ]}
            value={form.selectionType}
            onChange={(v) => v && setForm({ ...form, selectionType: v })}
          />
          <Switch
            label="Required"
            checked={form.requiredFlag}
            onChange={(e) => setForm({ ...form, requiredFlag: e.currentTarget.checked })}
          />
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

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
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type CategoryRow = {
  id: number;
  name: string;
  parentCategoryId?: number | null;
};

export default function RestoCategoriesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", parentCategoryId: null as number | null });

  const { data, isLoading } = useQuery({
    queryKey: ["categories-admin"],
    queryFn: async () => {
      const res = await restoApi.categories.list({
        query: {},
        options: { paginate: 100, page: 1 },
      });
      const result = res.data?.data ?? {};
      return result?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.categories.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories-admin"] });
      setModalOpen(false);
      setForm({ name: "", parentCategoryId: null });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      restoApi.categories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories-admin"] });
      setModalOpen(false);
      setEditingId(null);
      setForm({ name: "", parentCategoryId: null });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.categories.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories-admin"] }),
  });

  const categories = (data ?? []) as CategoryRow[];

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", parentCategoryId: null });
    setModalOpen(true);
  };

  const openEdit = (row: CategoryRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      parentCategoryId: row.parentCategoryId ?? null,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name,
      parentCategoryId: form.parentCategoryId ?? undefined,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this category?")) deleteMutation.mutate(id);
  };

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name ?? `#${id}`;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Categories</Title>
          <Text c="dimmed">Product categories for menu organization.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Category
        </Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading...</Text>
        ) : categories.length === 0 ? (
          <Text c="dimmed">No categories. Add one to organize products.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Parent</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {categories.map((c) => (
                <Table.Tr key={c.id}>
                  <Table.Td>{c.name}</Table.Td>
                  <Table.Td>{c.parentCategoryId ? getCategoryName(c.parentCategoryId) : "-"}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(c)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(c.id)}>
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

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Category" : "Add Category"}>
        <Stack gap="md">
          <TextInput
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Select
            label="Parent Category"
            placeholder="None"
            clearable
            data={categories.filter((c) => c.id !== editingId).map((c) => ({ value: String(c.id), label: c.name }))}
            value={form.parentCategoryId != null ? String(form.parentCategoryId) : null}
            onChange={(v) => setForm({ ...form, parentCategoryId: v ? Number(v) : null })}
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

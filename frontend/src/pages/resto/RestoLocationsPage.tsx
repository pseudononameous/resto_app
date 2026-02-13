import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Title,
  Text,
  Card,
  Stack,
  Table,
  Badge,
  Group,
  Button,
  ActionIcon,
  Modal,
  TextInput,
  Switch,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type LocationRow = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  activeFlag?: boolean;
};

const emptyLocation = {
  name: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  phone: "",
  activeFlag: true,
};

export default function RestoLocationsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyLocation);

  const { data, isLoading } = useQuery({
    queryKey: ["locations-admin"],
    queryFn: async () => {
      const res = await restoApi.locations.list({
        query: {},
        options: { paginate: 50, page: 1 },
      });
      const result = res.data?.data ?? {};
      return result?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: object) => restoApi.locations.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations-admin"] });
      setModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      restoApi.locations.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations-admin"] });
      setModalOpen(false);
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.locations.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations-admin"] }),
  });

  const resetForm = () => setForm(emptyLocation);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyLocation);
    setModalOpen(true);
  };

  const openEdit = (row: LocationRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      address: row.address ?? "",
      city: row.city ?? "",
      state: row.state ?? "",
      zipCode: row.zipCode ?? "",
      country: row.country ?? "",
      phone: row.phone ?? "",
      activeFlag: row.activeFlag ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this location?")) deleteMutation.mutate(id);
  };

  const locations = (data ?? []) as LocationRow[];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Locations</Title>
          <Text c="dimmed">Manage restaurant locations for multi-location support.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Location
        </Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading locations...</Text>
        ) : locations.length === 0 ? (
          <Text c="dimmed">No locations found. Click Add Location to create one.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th>City</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {locations.map((l) => (
                <Table.Tr key={l.id}>
                  <Table.Td>{l.name}</Table.Td>
                  <Table.Td>{l.address || "-"}</Table.Td>
                  <Table.Td>{l.city || "-"}</Table.Td>
                  <Table.Td>{l.phone || "-"}</Table.Td>
                  <Table.Td>
                    <Badge color={l.activeFlag ? "green" : "gray"}>
                      {l.activeFlag ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(l)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(l.id)}
                      >
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

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Location" : "Add Location"}
      >
        <Stack gap="md">
          <TextInput
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextInput
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Group grow>
            <TextInput
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <TextInput
              label="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Zip Code"
              value={form.zipCode}
              onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
            />
            <TextInput
              label="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </Group>
          <TextInput
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Switch
            label="Active"
            checked={form.activeFlag}
            onChange={(e) => setForm({ ...form, activeFlag: e.currentTarget.checked })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

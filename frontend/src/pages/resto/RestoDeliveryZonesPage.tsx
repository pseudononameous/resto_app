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
  NumberInput,
  Select,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type DeliveryZoneRow = {
  id: number;
  locationId: number;
  name: string;
  minDistanceKm?: number;
  maxDistanceKm?: number;
  deliveryFee: number;
  minOrderAmount?: number;
  activeFlag?: boolean;
};

type LocationRow = { id: number; name: string };

const emptyZone = {
  locationId: 0,
  name: "",
  minDistanceKm: null as number | null,
  maxDistanceKm: null as number | null,
  deliveryFee: 0,
  minOrderAmount: null as number | null,
  activeFlag: true,
};

export default function RestoDeliveryZonesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyZone);

  const { data: locations } = useQuery({
    queryKey: ["locations-admin"],
    queryFn: async () => {
      const res = await restoApi.locations.list({
        query: {},
        options: { paginate: 50, page: 1 },
      });
      const result = res.data?.data ?? {};
      return (result?.data ?? []) as LocationRow[];
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["delivery-zones-admin"],
    queryFn: async () => {
      const res = await restoApi.deliveryZones.list({
        query: {},
        options: { paginate: 50, page: 1 },
      });
      const result = res.data?.data ?? {};
      return result?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.deliveryZones.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-zones-admin"] });
      setModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      restoApi.deliveryZones.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-zones-admin"] });
      setModalOpen(false);
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.deliveryZones.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["delivery-zones-admin"] }),
  });

  const resetForm = () => setForm(emptyZone);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyZone,
      locationId: locations?.[0]?.id ?? 0,
    });
    setModalOpen(true);
  };

  const openEdit = (row: DeliveryZoneRow) => {
    setEditingId(row.id);
    setForm({
      locationId: row.locationId,
      name: row.name,
      minDistanceKm: row.minDistanceKm ?? null,
      maxDistanceKm: row.maxDistanceKm ?? null,
      deliveryFee: row.deliveryFee ?? 0,
      minOrderAmount: row.minOrderAmount ?? null,
      activeFlag: row.activeFlag ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      locationId: form.locationId,
      name: form.name,
      minDistanceKm: form.minDistanceKm ?? undefined,
      maxDistanceKm: form.maxDistanceKm ?? undefined,
      deliveryFee: form.deliveryFee,
      minOrderAmount: form.minOrderAmount ?? undefined,
      activeFlag: form.activeFlag,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this delivery zone?")) deleteMutation.mutate(id);
  };

  const zones = (data ?? []) as DeliveryZoneRow[];
  const locs = locations ?? [];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Delivery Zones</Title>
          <Text c="dimmed">Manage zone-based delivery fees by location.</Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openCreate}
          disabled={locs.length === 0}
        >
          Add Zone
        </Button>
      </Group>

      {locs.length === 0 && (
        <Text c="dimmed" size="sm">
          Add at least one location before creating delivery zones.
        </Text>
      )}

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading delivery zones...</Text>
        ) : zones.length === 0 ? (
          <Text c="dimmed">No delivery zones found. Click Add Zone to create one.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Distance (km)</Table.Th>
                <Table.Th>Fee</Table.Th>
                <Table.Th>Min Order</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {zones.map((z) => (
                <Table.Tr key={z.id}>
                  <Table.Td>{z.name}</Table.Td>
                  <Table.Td>
                    {locs.find((l) => l.id === z.locationId)?.name ?? z.locationId}
                  </Table.Td>
                  <Table.Td>
                    {z.minDistanceKm != null || z.maxDistanceKm != null
                      ? `${z.minDistanceKm ?? 0}-${z.maxDistanceKm ?? "∞"}`
                      : "-"}
                  </Table.Td>
                  <Table.Td>${Number(z.deliveryFee ?? 0).toFixed(2)}</Table.Td>
                  <Table.Td>
                    {z.minOrderAmount != null
                      ? `$${Number(z.minOrderAmount).toFixed(2)}`
                      : "-"}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={z.activeFlag ? "green" : "gray"}>
                      {z.activeFlag ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(z)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(z.id)}
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
        title={editingId ? "Edit Delivery Zone" : "Add Delivery Zone"}
      >
        <Stack gap="md">
          <Select
            label="Location"
            required
            data={locs.map((l) => ({ value: String(l.id), label: l.name }))}
            value={String(form.locationId || "")}
            onChange={(v) => setForm({ ...form, locationId: v ? Number(v) : 0 })}
          />
          <TextInput
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Group grow>
            <NumberInput
              label="Min Distance (km)"
              min={0}
              value={form.minDistanceKm ?? ""}
              onChange={(v) =>
                setForm({ ...form, minDistanceKm: v === "" ? null : Number(v) })
              }
            />
            <NumberInput
              label="Max Distance (km)"
              min={0}
              value={form.maxDistanceKm ?? ""}
              onChange={(v) =>
                setForm({ ...form, maxDistanceKm: v === "" ? null : Number(v) })
              }
            />
          </Group>
          <NumberInput
            label="Delivery Fee ($)"
            min={0}
            value={form.deliveryFee}
            onChange={(v) => setForm({ ...form, deliveryFee: Number(v) || 0 })}
          />
          <NumberInput
            label="Min Order Amount ($)"
            min={0}
            value={form.minOrderAmount ?? ""}
            onChange={(v) =>
              setForm({ ...form, minOrderAmount: v === "" ? null : Number(v) })
            }
          />
          <Switch
            label="Active"
            checked={form.activeFlag}
            onChange={(e) =>
              setForm({ ...form, activeFlag: e.currentTarget.checked })
            }
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
              disabled={!form.name || !form.locationId}
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

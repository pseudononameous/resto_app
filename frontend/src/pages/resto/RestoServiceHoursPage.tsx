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
  Select,
  Switch,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

const DAYS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

type ServiceHoursRow = {
  id: number;
  locationId: number;
  dayOfWeek: number;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
  serviceType?: string;
};

type LocationRow = { id: number; name: string };

const emptyHours = {
  locationId: 0,
  dayOfWeek: 0,
  openTime: "09:00:00",
  closeTime: "21:00:00",
  isClosed: false,
  serviceType: "dine_in",
};

export default function RestoServiceHoursPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyHours);

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
    queryKey: ["service-hours-admin"],
    queryFn: async () => {
      const res = await restoApi.serviceHours.list({
        query: {},
        options: { paginate: 100, page: 1 },
      });
      const result = res.data?.data ?? {};
      return result?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.serviceHours.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-hours-admin"] });
      setModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      restoApi.serviceHours.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-hours-admin"] });
      setModalOpen(false);
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.serviceHours.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["service-hours-admin"] }),
  });

  const resetForm = () => setForm(emptyHours);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyHours,
      locationId: locations?.[0]?.id ?? 0,
    });
    setModalOpen(true);
  };

  const openEdit = (row: ServiceHoursRow) => {
    setEditingId(row.id);
    setForm({
      locationId: row.locationId,
      dayOfWeek: row.dayOfWeek,
      openTime: row.openTime ?? "09:00:00",
      closeTime: row.closeTime ?? "21:00:00",
      isClosed: row.isClosed ?? false,
      serviceType: row.serviceType ?? "dine_in",
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      locationId: form.locationId,
      dayOfWeek: form.dayOfWeek,
      openTime: form.isClosed ? null : form.openTime,
      closeTime: form.isClosed ? null : form.closeTime,
      isClosed: form.isClosed,
      serviceType: form.serviceType || null,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this service hours entry?")) deleteMutation.mutate(id);
  };

  const hours = (data ?? []) as ServiceHoursRow[];
  const locs = locations ?? [];

  const formatTime = (t?: string) => (t ? t.slice(0, 5) : "-");

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Service Hours</Title>
          <Text c="dimmed">Manage operating hours per location and day.</Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openCreate}
          disabled={locs.length === 0}
        >
          Add Hours
        </Button>
      </Group>

      {locs.length === 0 && (
        <Text c="dimmed" size="sm">
          Add at least one location before setting service hours.
        </Text>
      )}

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading service hours...</Text>
        ) : hours.length === 0 ? (
          <Text c="dimmed">No service hours found. Click Add Hours to create one.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Location</Table.Th>
                <Table.Th>Day</Table.Th>
                <Table.Th>Open</Table.Th>
                <Table.Th>Close</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {hours.map((h) => (
                <Table.Tr key={h.id}>
                  <Table.Td>
                    {locs.find((l) => l.id === h.locationId)?.name ?? h.locationId}
                  </Table.Td>
                  <Table.Td>{DAYS.find((d) => d.value === String(h.dayOfWeek))?.label ?? h.dayOfWeek}</Table.Td>
                  <Table.Td>{h.isClosed ? "Closed" : formatTime(h.openTime)}</Table.Td>
                  <Table.Td>{h.isClosed ? "-" : formatTime(h.closeTime)}</Table.Td>
                  <Table.Td>{h.serviceType || "-"}</Table.Td>
                  <Table.Td>
                    <Badge color={h.isClosed ? "red" : "green"}>
                      {h.isClosed ? "Closed" : "Open"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(h)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(h.id)}
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
        title={editingId ? "Edit Service Hours" : "Add Service Hours"}
      >
        <Stack gap="md">
          <Select
            label="Location"
            required
            data={locs.map((l) => ({ value: String(l.id), label: l.name }))}
            value={String(form.locationId || "")}
            onChange={(v) => setForm({ ...form, locationId: v ? Number(v) : 0 })}
          />
          <Select
            label="Day of Week"
            required
            data={DAYS}
            value={String(form.dayOfWeek)}
            onChange={(v) => setForm({ ...form, dayOfWeek: v ? Number(v) : 0 })}
          />
          <Switch
            label="Closed this day"
            checked={form.isClosed}
            onChange={(e) =>
              setForm({ ...form, isClosed: e.currentTarget.checked })
            }
          />
          {!form.isClosed && (
            <Group grow>
              <Select
                label="Open Time"
                data={Array.from({ length: 48 }, (_, i) => {
                  const h = Math.floor(i / 2);
                  const m = (i % 2) * 30;
                  const v = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
                  const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
                  return { value: v, label };
                })}
                value={form.openTime}
                onChange={(v) => setForm({ ...form, openTime: v ?? "09:00:00" })}
              />
              <Select
                label="Close Time"
                data={Array.from({ length: 48 }, (_, i) => {
                  const h = Math.floor(i / 2);
                  const m = (i % 2) * 30;
                  const v = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
                  const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
                  return { value: v, label };
                })}
                value={form.closeTime}
                onChange={(v) => setForm({ ...form, closeTime: v ?? "21:00:00" })}
              />
            </Group>
          )}
          <Select
            label="Service Type"
            data={[
              { value: "dine_in", label: "Dine-in" },
              { value: "delivery", label: "Delivery" },
              { value: "pickup", label: "Pickup" },
            ]}
            value={form.serviceType}
            onChange={(v) => setForm({ ...form, serviceType: v ?? "dine_in" })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
              disabled={!form.locationId}
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

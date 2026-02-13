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
  Select,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

type HolidayScheduleRow = {
  id: number;
  locationId?: number | null;
  name: string;
  holidayDate: string;
  isClosed?: boolean;
};

type LocationRow = { id: number; name: string };

const emptyHoliday = {
  locationId: null as number | null,
  name: "",
  holidayDate: "",
  isClosed: true,
};

export default function RestoHolidaySchedulesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyHoliday);

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
    queryKey: ["holiday-schedules-admin"],
    queryFn: async () => {
      const res = await restoApi.holidaySchedules.list({
        query: {},
        options: { paginate: 100, page: 1, sort: { holidayDate: 1 } },
      });
      const result = res.data?.data ?? {};
      return result?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.holidaySchedules.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holiday-schedules-admin"] });
      setModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      restoApi.holidaySchedules.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holiday-schedules-admin"] });
      setModalOpen(false);
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.holidaySchedules.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["holiday-schedules-admin"] }),
  });

  const resetForm = () => setForm(emptyHoliday);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyHoliday,
      holidayDate: new Date().toISOString().slice(0, 10),
    });
    setModalOpen(true);
  };

  const openEdit = (row: HolidayScheduleRow) => {
    setEditingId(row.id);
    setForm({
      locationId: row.locationId ?? null,
      name: row.name,
      holidayDate: row.holidayDate ? String(row.holidayDate).slice(0, 10) : "",
      isClosed: row.isClosed ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      locationId: form.locationId ?? undefined,
      name: form.name,
      holidayDate: form.holidayDate,
      isClosed: form.isClosed,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this holiday schedule?")) deleteMutation.mutate(id);
  };

  const holidays = (data ?? []) as HolidayScheduleRow[];
  const locs = locations ?? [];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Holiday Schedules</Title>
          <Text c="dimmed">Manage holiday closures. Leave location empty for all locations.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Add Holiday
        </Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading holiday schedules...</Text>
        ) : holidays.length === 0 ? (
          <Text c="dimmed">No holiday schedules found. Click Add Holiday to create one.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Closed</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {holidays.map((h) => (
                <Table.Tr key={h.id}>
                  <Table.Td>{h.name}</Table.Td>
                  <Table.Td>{String(h.holidayDate).slice(0, 10)}</Table.Td>
                  <Table.Td>
                    {h.locationId != null
                      ? locs.find((l) => l.id === h.locationId)?.name ?? h.locationId
                      : "All locations"}
                  </Table.Td>
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
        title={editingId ? "Edit Holiday" : "Add Holiday"}
      >
        <Stack gap="md">
          <TextInput
            label="Name"
            required
            placeholder="e.g. Christmas Day"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextInput
            label="Date"
            required
            type="date"
            value={form.holidayDate}
            onChange={(e) => setForm({ ...form, holidayDate: e.target.value })}
          />
          <Select
            label="Location (optional)"
            placeholder="All locations"
            clearable
            data={locs.map((l) => ({ value: String(l.id), label: l.name }))}
            value={form.locationId != null ? String(form.locationId) : null}
            onChange={(v) =>
              setForm({ ...form, locationId: v ? Number(v) : null })
            }
          />
          <Switch
            label="Closed on this day"
            checked={form.isClosed}
            onChange={(e) =>
              setForm({ ...form, isClosed: e.currentTarget.checked })
            }
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
              disabled={!form.name || !form.holidayDate}
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

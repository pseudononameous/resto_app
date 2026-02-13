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
  Select,
  NumberInput,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { restoApi } from "@services/api";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "seated", label: "Seated" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No-show" },
];

type ReservationRow = {
  id: number;
  locationId: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  reservationDate: string;
  startTime: string;
  endTime?: string;
  partySize: number;
  status: string;
  notes?: string;
  tableNumber?: string;
};

type LocationRow = { id: number; name: string };

const emptyReservation = {
  locationId: 0,
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  reservationDate: "",
  startTime: "18:00:00",
  endTime: "",
  partySize: 2,
  status: "pending",
  notes: "",
  tableNumber: "",
};

export default function RestoReservationsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyReservation);

  const { data: locationsData } = useQuery({
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
    queryKey: ["reservations-admin", statusFilter, locationFilter],
    queryFn: async () => {
      const query: Record<string, unknown> = {};
      if (statusFilter) query.status = statusFilter;
      if (locationFilter) query.locationId = locationFilter;
      const res = await restoApi.reservations.list({
        query,
        options: {
          paginate: 50,
          page: 1,
          sort: { reservationDate: -1, startTime: -1 },
        },
      });
      const result = res.data?.data ?? {};
      return result?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: object) => restoApi.reservations.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations-admin"] });
      setModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      restoApi.reservations.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations-admin"] });
      setModalOpen(false);
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => restoApi.reservations.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reservations-admin"] }),
  });

  const locations = locationsData ?? [];
  const reservations = (data ?? []) as ReservationRow[];

  const resetForm = () => setForm(emptyReservation);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyReservation,
      locationId: locations[0]?.id ?? 0,
      reservationDate: new Date().toISOString().slice(0, 10),
    });
    setModalOpen(true);
  };

  const openEdit = (row: ReservationRow) => {
    setEditingId(row.id);
    setForm({
      locationId: row.locationId,
      guestName: row.guestName ?? "",
      guestEmail: row.guestEmail ?? "",
      guestPhone: row.guestPhone ?? "",
      reservationDate: String(row.reservationDate).slice(0, 10),
      startTime: row.startTime ?? "18:00:00",
      endTime: row.endTime ?? "",
      partySize: row.partySize ?? 2,
      status: row.status ?? "pending",
      notes: row.notes ?? "",
      tableNumber: row.tableNumber ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      locationId: form.locationId,
      guestName: form.guestName || null,
      guestEmail: form.guestEmail || null,
      guestPhone: form.guestPhone || null,
      reservationDate: form.reservationDate,
      startTime: form.startTime,
      endTime: form.endTime || null,
      partySize: form.partySize,
      status: form.status,
      notes: form.notes || null,
      tableNumber: form.tableNumber || null,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this reservation?")) deleteMutation.mutate(id);
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = (i % 2) * 30;
    const v = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
    const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    return { value: v, label };
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={1}>Reservations</Title>
          <Text c="dimmed">Manage table reservations and booking status.</Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openCreate}
          disabled={locations.length === 0}
        >
          Add Reservation
        </Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        <Stack gap="md">
          <Group>
            <Select
              label="Filter by status"
              placeholder="All statuses"
              data={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
            <Select
              label="Filter by location"
              placeholder="All locations"
              data={locations.map((l) => ({
                value: String(l.id),
                label: l.name,
              }))}
              value={locationFilter != null ? String(locationFilter) : null}
              onChange={(v) => setLocationFilter(v ? Number(v) : null)}
              clearable
            />
          </Group>
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" withBorder>
        {isLoading ? (
          <Text c="dimmed">Loading reservations...</Text>
        ) : reservations.length === 0 ? (
          <Text c="dimmed">No reservations found. Click Add Reservation to create one.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Time</Table.Th>
                <Table.Th>Guest</Table.Th>
                <Table.Th>Party</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {reservations.map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td>{String(r.reservationDate).slice(0, 10)}</Table.Td>
                  <Table.Td>{r.startTime ? String(r.startTime).slice(0, 5) : "-"}</Table.Td>
                  <Table.Td>
                    {String(r.guestName || r.guestEmail || "-")}
                    {r.guestPhone && ` • ${r.guestPhone}`}
                  </Table.Td>
                  <Table.Td>{r.partySize}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        r.status === "confirmed"
                          ? "green"
                          : r.status === "cancelled" || r.status === "no_show"
                            ? "red"
                            : "gray"
                      }
                    >
                      {r.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(r)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(r.id)}
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
        title={editingId ? "Edit Reservation" : "Add Reservation"}
      >
        <Stack gap="md">
          <Select
            label="Location"
            required
            data={locations.map((l) => ({ value: String(l.id), label: l.name }))}
            value={String(form.locationId || "")}
            onChange={(v) => setForm({ ...form, locationId: v ? Number(v) : 0 })}
          />
          <TextInput
            label="Guest Name"
            value={form.guestName}
            onChange={(e) => setForm({ ...form, guestName: e.target.value })}
          />
          <TextInput
            label="Guest Email"
            type="email"
            value={form.guestEmail}
            onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
          />
          <TextInput
            label="Guest Phone"
            value={form.guestPhone}
            onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
          />
          <TextInput
            label="Date"
            required
            type="date"
            value={form.reservationDate}
            onChange={(e) => setForm({ ...form, reservationDate: e.target.value })}
          />
          <Select
            label="Start Time"
            required
            data={timeOptions}
            value={form.startTime}
            onChange={(v) => setForm({ ...form, startTime: v ?? "18:00:00" })}
          />
          <NumberInput
            label="Party Size"
            min={1}
            value={form.partySize}
            onChange={(v) => setForm({ ...form, partySize: Number(v) || 2 })}
          />
          <Select
            label="Status"
            data={STATUS_OPTIONS}
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v ?? "pending" })}
          />
          <TextInput
            label="Table Number"
            value={form.tableNumber}
            onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
          />
          <TextInput
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
              disabled={!form.locationId || !form.reservationDate || !form.startTime}
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

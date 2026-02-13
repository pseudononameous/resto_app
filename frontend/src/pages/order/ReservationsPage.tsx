import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Title,
  Text,
  Card,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  NumberInput,
  Table,
  Badge,
} from "@mantine/core";
import { restoApi } from "@services/api";
import { notifications } from "@mantine/notifications";

export default function ReservationsPage() {
  const queryClient = useQueryClient();
  const [locationId, setLocationId] = useState<number | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");

  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await restoApi.getLocations();
      return res.data?.data ?? [];
    },
  });

  const { data: reservationsData } = useQuery({
    queryKey: ["reservations", locationId],
    queryFn: async () => {
      const res = await restoApi.reservations.list({
        query: locationId ? { locationId } : {},
        options: { paginate: 25, page: 1 },
      });
      const result = res.data?.data ?? {};
      return result?.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: object) => {
      const res = await restoApi.reservations.create(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      notifications.show({ title: "Reservation created", color: "green" });
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setReservationDate("");
      setStartTime("");
      setPartySize(2);
      setNotes("");
    },
  });

  const handleSubmit = () => {
    if (!locationId) {
      notifications.show({ title: "Required", message: "Select a location.", color: "red" });
      return;
    }
    if (!reservationDate || !startTime) {
      notifications.show({ title: "Required", message: "Enter date and time.", color: "red" });
      return;
    }
    createMutation.mutate({
      locationId,
      guestName: guestName || undefined,
      guestEmail: guestEmail || undefined,
      guestPhone: guestPhone || undefined,
      reservationDate: new Date(reservationDate).toISOString().split("T")[0],
      startTime,
      partySize,
      notes: notes || undefined,
      status: "pending",
    });
  };

  const locations = locationsData ?? [];
  const reservations = reservationsData ?? [];

  return (
    <Stack gap="lg">
      <Title order={1}>Table Reservations</Title>

      <Card shadow="sm" padding="lg" withBorder>
        <Title order={3} mb="md">
          Book a Table
        </Title>
        <Stack gap="md">
          <Select
            label="Location"
            placeholder="Select location"
            data={locations.map((l: { id: number; name: string }) => ({
              value: String(l.id),
              label: l.name,
            }))}
            value={locationId != null ? String(locationId) : null}
            onChange={(v) => setLocationId(v ? Number(v) : null)}
          />
          <TextInput
            label="Name"
            placeholder="Your name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
          />
          <TextInput
            label="Phone"
            placeholder="Phone number"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
          />
          <TextInput
            label="Date"
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
          />
          <TextInput
            label="Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <NumberInput
            label="Party size"
            min={1}
            max={20}
            value={partySize}
            onChange={(v) => setPartySize(Number(v) || 2)}
          />
          <TextInput
            label="Special requests"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button loading={createMutation.isPending} onClick={handleSubmit}>
            Book Reservation
          </Button>
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" withBorder>
        <Title order={3} mb="md">
          My Reservations
        </Title>
        {reservations.length === 0 ? (
          <Text c="dimmed">No reservations found. Book a table above.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Time</Table.Th>
                <Table.Th>Party</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {reservations.map((r: Record<string, unknown>) => (
                <Table.Tr key={String(r.id)}>
                  <Table.Td>{String(r.reservationDate)}</Table.Td>
                  <Table.Td>{String(r.startTime)}</Table.Td>
                  <Table.Td>{String(r.partySize)}</Table.Td>
                  <Table.Td>{String(r.guestName || "-")}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        r.status === "confirmed"
                          ? "green"
                          : r.status === "cancelled"
                            ? "red"
                            : "gray"
                      }
                    >
                      {String(r.status)}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Stack>
  );
}

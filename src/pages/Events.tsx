import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import {
	Alert,
	Box,
	CircularProgress,
	Fab,
	Snackbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { EventCard, EventDialog } from "../components/events";
import { useWorld } from "../contexts/WorldContext";
import type { ApiState, Event } from "../services/types";
import {
	createEvent,
	deleteEvent,
	fetchEvents,
	updateEvent,
} from "../utils/api/events";

export default function Events() {
	const { worldId } = useWorld();
	const [eventsState, setEventsState] = useState<ApiState<Event[]>>({
		status: "loading",
	});
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);
	const loadEvents = async () => {
		const result = await fetchEvents(worldId);
		setEventsState(result);
	};

	useEffect(() => {
		loadEvents();
	}, []);

	const handleCreateSave = async (payload: {
		title: string;
		year: number;
		description?: string;
		worldId: string;
	}) => {
		const result = await createEvent({ ...payload, id: "" } as Event);

		if (result.status === "error") {
			throw new Error(result.error);
		}
		setSnackbarMessage("Event created successfully");
		setSnackbarOpen(true);
		await loadEvents();
	};

	const handleEditSave = async (payload: {
		title: string;
		year: number;
		description?: string;
		worldId: string;
	}) => {
		if (!editingEvent) return;
		const updatedEvent: Event = {
			...editingEvent,
			...payload,
			description: payload.description ?? editingEvent.description ?? "",
		};
		const result = await updateEvent(editingEvent.id, updatedEvent);
		if (result.status === "error") {
			throw new Error(result.error);
		}
		setSnackbarMessage("Event updated successfully");
		setSnackbarOpen(true);
		setEditDialogOpen(false);
		setEditingEvent(null);
		await loadEvents();
	};

	const handleEdit = (id: string) => {
		const event =
			eventsState.status === "success"
				? eventsState.data.find((e) => e.id === id)
				: null;

		if (event) {
			setEditingEvent(event);
			setEditDialogOpen(true);
		}
	};

	const handleDelete = async (id: string) => {
		const result = await deleteEvent(id);
		if (result.status === "success") {
			setSnackbarMessage("Event deleted successfully");
			setSnackbarOpen(true);
			await loadEvents();
		} else {
			const errorMessage =
				result.status === "error" ? result.error : "Unknown error";
			setSnackbarMessage(`Failed to delete event: ${errorMessage}`);
			setSnackbarOpen(true);
			throw new Error(errorMessage);
		}
	};

	const handleCreateEvent = () => {
		setCreateDialogOpen(true);
	};

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	};

	return (
		<Box>
			<Box>
				<Typography variant="h4" component="h1" gutterBottom>
					Events
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Create and manage events for your world.
				</Typography>
			</Box>

			{eventsState.status === "loading" && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: 200,
						py: 6,
					}}
				>
					<CircularProgress />
				</Box>
			)}

			{eventsState.status === "error" && (
				<Alert severity="error" sx={{ alignSelf: "flex-start" }}>
					{eventsState.error}
				</Alert>
			)}

			{eventsState.status === "success" && (
				<>
					{eventsState.data.length === 0 ? (
						<Box
							sx={{
								py: 8,
								px: 3,
								textAlign: "center",
								bgcolor: "action.hover",
								borderRadius: 3,
								border: "1px dashed",
								borderColor: "divider",
							}}
						>
							<EventNoteRoundedIcon
								sx={{
									fontSize: 56,
									color: "text.disabled",
									mb: 2,
								}}
							/>
							<Typography
								variant="h6"
								color="text.secondary"
								gutterBottom
							>
								No events yet
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Create your first event using the button below.
							</Typography>
						</Box>
					) : (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 3,
								position: "relative",
								mt: 2,
							}}
						>
							{/* Timeline line */}
							<Box
								sx={{
									position: "absolute",
									left: { xs: 16, sm: 24 },
									top: 0,
									bottom: 0,
									width: 3,
									bgcolor: "divider",
									borderRadius: 1,
									zIndex: 0,
									display: { xs: "none", sm: "block" },
								}}
							/>
							{/* Timeline dots and cards */}
							{eventsState.data
								.sort((a, b) => a.year - b.year)
								.map((event) => (
									<Box
										key={event.id}
										sx={{
											position: "relative",
											zIndex: 1,
											pl: { xs: 0, sm: 6 },
										}}
									>
										{/* Timeline dot */}
										<Box
											sx={{
												position: "absolute",
												left: { xs: -8, sm: 18 },
												top: 24,
												width: 16,
												height: 16,
												borderRadius: "50%",
												bgcolor: "primary.main",
												border: 3,
												borderColor: "background.paper",
												boxShadow: 1,
												zIndex: 2,
												display: { xs: "none", sm: "block" },
											}}
										/>
										<EventCard
											event={event}
											onEdit={handleEdit}
											onDelete={handleDelete}
										/>
									</Box>
								))}
						</Box>
					)}
				</>
			)}

			<Fab
				color="primary"
				aria-label="Create new event"
				onClick={handleCreateEvent}
				sx={{
					position: "fixed",
					right: { xs: 20, md: 32 },
					bottom: 24,
				}}
			>
				<AddRoundedIcon />
			</Fab>

			<EventDialog
				mode="create"
				open={createDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
				onSave={handleCreateSave}
				worldId={worldId}
			/>
			<EventDialog
				mode="edit"
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				onSave={handleEditSave}
				initialEvent={editingEvent ?? undefined}
			/>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				message={snackbarMessage}
			/>
		</Box>
	);
}

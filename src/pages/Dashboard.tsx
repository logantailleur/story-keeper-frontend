import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import {
	Alert,
	Box,
	CircularProgress,
	Fab,
	Grid,
	Snackbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorld } from "../contexts/WorldContext";
import { WorldCard, WorldDialog } from "../components/worlds";
import type { ApiState, World } from "../utils/api";
import {
	createWorld,
	deleteWorld,
	fetchWorlds,
	updateWorld,
} from "../utils/api";

function Dashboard() {
	const navigate = useNavigate();
	const { worldId, setWorldId } = useWorld();
	const [worldsState, setWorldsState] = useState<ApiState<World[]>>({
		status: "loading",
	});
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editingWorld, setEditingWorld] = useState<World | null>(null);

	const loadWorlds = async () => {
		const result = await fetchWorlds();
		setWorldsState(result);
	};

	useEffect(() => {
		loadWorlds();
	}, []);

	const handleCreateWorld = () => {
		setCreateDialogOpen(true);
	};

	const handleCreateSave = async (payload: {
		name: string;
		startYear: number;
		currentYear: number;
		description?: string;
	}) => {
		const result = await createWorld({
			...payload,
			id: "", // Backend will assign id
		} as World);
		if (result.status === "error") {
			throw new Error(result.error);
		}
		setSnackbarMessage("World created successfully");
		setSnackbarOpen(true);
		await loadWorlds();
	};

	const handleEditSave = async (payload: {
		name: string;
		startYear: number;
		currentYear: number;
		description?: string;
	}) => {
		if (!editingWorld) return;
		const result = await updateWorld(editingWorld.id, {
			...editingWorld,
			...payload,
		});
		if (result.status === "error") throw new Error(result.error);
		setSnackbarMessage("World updated successfully");
		setSnackbarOpen(true);
		setEditDialogOpen(false);
		setEditingWorld(null);
		await loadWorlds();
	};

	const handleEdit = (id: string) => {
		const world =
			worldsState.status === "success"
				? worldsState.data.find((w) => w.id === id)
				: null;
		if (world) {
			setEditingWorld(world);
			setEditDialogOpen(true);
		}
	};

	const handleDelete = async (id: string) => {
		const result = await deleteWorld(id);
		if (result.status === "success") {
			setSnackbarMessage("World deleted successfully");
			setSnackbarOpen(true);
			// Refresh the worlds list
			await loadWorlds();
			// Clear selection if the deleted world was selected
			if (worldId === id) {
				setWorldId("");
			}
		} else {
			// result.status === "error"
			const errorMessage =
				result.status === "error" ? result.error : "Unknown error";
			setSnackbarMessage(`Failed to delete world: ${errorMessage}`);
			setSnackbarOpen(true);
			throw new Error(errorMessage);
		}
	};

	const handleOpenInTimeline = (id: string) => {
		setWorldId(String(id));
		navigate("/timeline");
	};

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Box>
				<Typography variant="h4" component="h1" gutterBottom>
					Worlds
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Select a world or create a new one to get started.
				</Typography>
			</Box>

			{worldsState.status === "loading" && (
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

			{worldsState.status === "error" && (
				<Alert severity="error" sx={{ alignSelf: "flex-start" }}>
					{worldsState.error}
				</Alert>
			)}

			{worldsState.status === "success" && (
				<>
					{worldsState.data.length === 0 ? (
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
							<PublicRoundedIcon
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
								No worlds yet
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Create your first world using the button below.
							</Typography>
						</Box>
					) : (
						<Grid container spacing={2} sx={{ width: "100%" }}>
							{worldsState.data.map((world) => (
								<Grid
									key={world.id}
									size={{ xs: 12, sm: 6, md: 4 }}
								>
									<WorldCard
										world={world}
										isSelected={false}
										onSelect={handleOpenInTimeline}
										onEdit={handleEdit}
										onDelete={handleDelete}
									/>
								</Grid>
							))}
						</Grid>
					)}
				</>
			)}

			<Fab
				color="primary"
				aria-label="Create new world"
				onClick={handleCreateWorld}
				sx={{
					position: "fixed",
					right: { xs: 20, md: 32 },
					bottom: 24,
				}}
			>
				<AddRoundedIcon />
			</Fab>

			<WorldDialog
				mode="create"
				open={createDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
				onSave={handleCreateSave}
			/>

			<WorldDialog
				mode="edit"
				open={editDialogOpen}
				onClose={() => {
					setEditDialogOpen(false);
					setEditingWorld(null);
				}}
				onSave={handleEditSave}
				initialWorld={editingWorld ?? undefined}
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

export default Dashboard;

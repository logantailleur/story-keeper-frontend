import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Collapse,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Fab,
	IconButton,
	InputAdornment,
	Paper,
	Snackbar,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FigureDialog } from "../components/figures";
import { useWorld } from "../contexts/WorldContext";
import type { ApiState, Event, Figure, FigureType } from "../services/types";
import { fetchEvents } from "../utils/api/events";
import {
	createFigure,
	deleteFigure,
	fetchFigureById,
	fetchFigures,
	updateFigure,
	type FiguresPaginatedResponse,
} from "../utils/api/figures";

type FilterType = "ALL" | FigureType;

export default function Figures() {
	const { worldId } = useWorld();
	const location = useLocation();
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [figuresState, setFiguresState] = useState<
		ApiState<FiguresPaginatedResponse>
	>({
		status: "loading",
	});
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editingFigure, setEditingFigure] = useState<Figure | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletingFigure, setDeletingFigure] = useState<Figure | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [filterType, setFilterType] = useState<FilterType>("ALL");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [isLoadingPage, setIsLoadingPage] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedRow, setExpandedRow] = useState<string | null>(null);
	const [events, setEvents] = useState<Event[]>([]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const loadFigures = async () => {
		setIsLoadingPage(true);
		const result = await fetchFigures(worldId, {
			page: page,
			limit: rowsPerPage,
			search: searchQuery || undefined,
		});
		setFiguresState(result);
		setIsLoadingPage(false);
	};

	useEffect(() => {
		loadFigures();
		scrollToTop();
	}, [page, rowsPerPage, searchQuery]);

	// Fetch events for the current world
	useEffect(() => {
		if (worldId) {
			fetchEvents(worldId).then((result) => {
				if (result.status === "success") {
					setEvents(result.data);
				}
			});
		}
	}, [worldId]);

	// Open figure dialog when navigated from event detail (linked figure chip)
	useEffect(() => {
		const openFigureId = (location.state as { openFigureId?: string } | null)
			?.openFigureId;
		if (!openFigureId || !worldId) return;
		// Clear state so we don't re-open on re-render or when user navigates back
		navigate(location.pathname, { replace: true, state: {} });
		fetchFigureById(openFigureId).then((result) => {
			if (result.status === "success" && result.data.worldId === worldId) {
				setEditingFigure(result.data);
				setEditDialogOpen(true);
			}
		});
	}, [worldId, location.pathname, location.state, navigate]);

	const handleCreateSave = async (payload: {
		name: string;
		type: FigureType;
		description?: string;
		worldId: string;
	}) => {
		const result = await createFigure({ ...payload, id: "" } as Figure);

		if (result.status === "error") {
			throw new Error(result.error);
		}
		setSnackbarMessage("Figure created successfully");
		setSnackbarOpen(true);
		await loadFigures();
	};

	const handleEditSave = async (payload: {
		name: string;
		type: FigureType;
		description?: string;
		worldId: string;
	}) => {
		if (!editingFigure) return;
		const updatedFigure: Figure = {
			...editingFigure,
			...payload,
			description: payload.description ?? editingFigure.description ?? "",
		};
		const result = await updateFigure(editingFigure.id, updatedFigure);
		if (result.status === "error") {
			throw new Error(result.error);
		}
		setSnackbarMessage("Figure updated successfully");
		setSnackbarOpen(true);
		setEditDialogOpen(false);
		setEditingFigure(null);
		await loadFigures();
	};

	const handleEdit = (id: string) => {
		const figure =
			figuresState.status === "success"
				? figuresState.data.figures.find((f) => f.id === id)
				: null;

		if (figure) {
			setEditingFigure(figure);
			setEditDialogOpen(true);
		}
	};

	const handleDeleteClick = (figure: Figure) => {
		setDeletingFigure(figure);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!deletingFigure) return;
		setIsDeleting(true);
		try {
			const result = await deleteFigure(deletingFigure.id);
			if (result.status === "success") {
				setSnackbarMessage("Figure deleted successfully");
				setSnackbarOpen(true);
				setDeleteDialogOpen(false);
				setDeletingFigure(null);
				await loadFigures();
			} else {
				const errorMessage =
					result.status === "error" ? result.error : "Unknown error";
				setSnackbarMessage(`Failed to delete figure: ${errorMessage}`);
				setSnackbarOpen(true);
				throw new Error(errorMessage);
			}
		} catch (error) {
			console.error("Failed to delete figure:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setDeletingFigure(null);
	};

	const handleCreateFigure = () => {
		setCreateDialogOpen(true);
	};

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	};

	const handleFilterChange = (
		_event: React.MouseEvent<HTMLElement>,
		newFilter: FilterType | null,
	) => {
		if (newFilter !== null) {
			setFilterType(newFilter);
			setPage(0); // Reset to first page when filter changes
			scrollToTop();
		}
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
		setPage(0); // Reset to first page when search changes
	};

	const handleClearSearch = () => {
		setSearchQuery("");
		setPage(0);
	};

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
		scrollToTop();
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0); // Reset to first page when rows per page changes
		scrollToTop();
	};

	const handleRowClick = (figureId: string) => {
		setExpandedRow(expandedRow === figureId ? null : figureId);
	};

	const getTypeIcon = (type: FigureType) => {
		return type === "PERSON" ? (
			<PersonRoundedIcon fontSize="small" />
		) : (
			<GroupsRoundedIcon fontSize="small" />
		);
	};

	const getTypeColor = (
		type: FigureType,
	): "primary" | "secondary" | "success" | "error" | "info" | "warning" => {
		return type === "PERSON" ? "info" : "warning";
	};

	// Get figures from the paginated response
	const allFigures =
		figuresState.status === "success" ? figuresState.data.figures : [];
	
	// Apply client-side filtering
	const filteredFigures =
		filterType === "ALL"
			? allFigures
			: allFigures.filter((f) => f.type === filterType);

	// Get total count from API response
	const totalCount =
		figuresState.status === "success" ? figuresState.data.total : 0;

	return (
		<Box sx={{ pb: 10 }}>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Figures
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Create and manage figures for your world.
				</Typography>
			</Box>

			{figuresState.status === "loading" && (
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

			{figuresState.status === "error" && (
				<Alert severity="error" sx={{ alignSelf: "flex-start" }}>
					{figuresState.error}
				</Alert>
			)}

			{figuresState.status === "success" && (
				<>
					{figuresState.data.figures.length === 0 ? (
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
							<PeopleRoundedIcon
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
								No figures yet
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Create your first figure using the button below.
							</Typography>
						</Box>
					) : (
						<>
							<Box
								sx={{
									mb: 3,
									display: "flex",
									flexDirection: { xs: "column", sm: "row" },
									gap: 2,
									alignItems: { xs: "stretch", sm: "center" },
									justifyContent: "space-between",
								}}
							>
								<TextField
									placeholder="Search figures..."
									value={searchQuery}
									onChange={handleSearchChange}
									size="small"
									sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchRoundedIcon fontSize="small" />
											</InputAdornment>
										),
										endAdornment: searchQuery && (
											<InputAdornment position="end">
												<IconButton
													size="small"
													onClick={handleClearSearch}
													edge="end"
													aria-label="clear search"
												>
													<ClearRoundedIcon fontSize="small" />
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
								<ToggleButtonGroup
									value={filterType}
									exclusive
									onChange={handleFilterChange}
									aria-label="filter by type"
									size="small"
								>
									<ToggleButton value="ALL" aria-label="all figures">
										All
									</ToggleButton>
									<ToggleButton value="PERSON" aria-label="persons">
										<PersonRoundedIcon sx={{ mr: { xs: 0, sm: 0.5 } }} fontSize="small" />
										<Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
											Person
										</Box>
									</ToggleButton>
									<ToggleButton value="FACTION" aria-label="factions">
										<GroupsRoundedIcon sx={{ mr: { xs: 0, sm: 0.5 } }} fontSize="small" />
										<Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
											Faction
										</Box>
									</ToggleButton>
								</ToggleButtonGroup>
							</Box>

							{isMobile ? (
								<>
									{isLoadingPage ? (
										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												minHeight: 300,
												py: 6,
											}}
										>
											<CircularProgress />
										</Box>
									) : (
										<>
											{/* Mobile Pagination - Top */}
											<Box component={Paper} variant="outlined" sx={{ mb: 2 }}>
												<TablePagination
													rowsPerPageOptions={[5, 10, 25]}
													component="div"
													count={totalCount}
													rowsPerPage={rowsPerPage}
													page={page}
													onPageChange={handleChangePage}
													onRowsPerPageChange={handleChangeRowsPerPage}
												/>
											</Box>

											{/* Mobile Card View */}
											{filteredFigures.length === 0 ? (
												<Box
													sx={{
														py: 6,
														px: 3,
														textAlign: "center",
														bgcolor: "action.hover",
														borderRadius: 2,
														border: "1px dashed",
														borderColor: "divider",
													}}
												>
													<Typography variant="body2" color="text.secondary">
														No figures match the selected filter
													</Typography>
												</Box>
											) : (
												<Stack spacing={2}>
													{filteredFigures.map((figure) => (
														<Card
															key={figure.id}
															variant="outlined"
															sx={{
																cursor: "pointer",
																transition: "all 0.2s ease-in-out",
																"&:hover": {
																	boxShadow: 2,
																},
															}}
															onClick={() => handleRowClick(figure.id)}
														>
															<CardContent>
																<Box
																	sx={{
																		display: "flex",
																		justifyContent: "space-between",
																		alignItems: "flex-start",
																		mb: 1,
																	}}
																>
																	<Typography variant="h6" component="h3" fontWeight={600}>
																		{figure.name}
																	</Typography>
																	<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
																		<Chip
																			icon={getTypeIcon(figure.type)}
																			label={figure.type}
																			color={getTypeColor(figure.type)}
																			size="small"
																			onClick={(e) => e.stopPropagation()}
																		/>
																		<IconButton
																			size="small"
																			onClick={(e) => {
																				e.stopPropagation();
																				handleRowClick(figure.id);
																			}}
																			aria-label={
																				expandedRow === figure.id
																					? "collapse"
																					: "expand"
																			}
																			sx={{
																				color: "text.secondary",
																			}}
																		>
																			{expandedRow === figure.id ? (
																				<KeyboardArrowUpRoundedIcon fontSize="small" />
																			) : (
																				<KeyboardArrowDownRoundedIcon fontSize="small" />
																			)}
																		</IconButton>
																	</Box>
																</Box>
																{figure.description && expandedRow !== figure.id && (
																	<Typography
																		variant="body2"
																		color="text.secondary"
																		sx={{
																			mb: 2,
																			lineHeight: 1.6,
																			overflow: "hidden",
																			textOverflow: "ellipsis",
																			display: "-webkit-box",
																			WebkitLineClamp: 2,
																			WebkitBoxOrient: "vertical",
																		}}
																	>
																		{figure.description}
																	</Typography>
																)}
																<Collapse
																	in={expandedRow === figure.id}
																	timeout="auto"
																	unmountOnExit
																>
																	<Box
																		sx={{
																			mt: 2,
																			pt: 2,
																			borderTop: 1,
																			borderColor: "divider",
																		}}
																	>
																		<Typography
																			variant="body2"
																			color="text.secondary"
																			sx={{
																				whiteSpace: "pre-wrap",
																				lineHeight: 1.7,
																				mb: figure.eventIds && figure.eventIds.length > 0 ? 2 : 0,
																			}}
																		>
																			{figure.description || "No description provided"}
																		</Typography>
																		{figure.eventIds && figure.eventIds.length > 0 && (
																			<Box sx={{ mt: 2 }}>
																				<Typography
																					variant="caption"
																					color="text.secondary"
																					sx={{
																						fontWeight: 600,
																						mb: 1,
																						display: "block",
																					}}
																				>
																					Linked Events:
																				</Typography>
																				<Stack spacing={0.5}>
																					{events
																						.filter((event) =>
																							figure.eventIds?.some(
																								(eventId) =>
																									String(eventId) ===
																									String(event.id),
																							),
																						)
																						.sort((a, b) => a.year - b.year)
																						.map((event) => (
																							<Typography
																								key={event.id}
																								variant="body2"
																								color="text.secondary"
																								sx={{ pl: 1 }}
																							>
																								• {event.title} ({event.year})
																							</Typography>
																						))}
																				</Stack>
																			</Box>
																		)}
																	</Box>
																</Collapse>
																<Box
																	sx={{
																		display: "flex",
																		gap: 1,
																		justifyContent: "flex-end",
																		pt: 1,
																		mt: expandedRow === figure.id ? 2 : 0,
																		borderTop: 1,
																		borderColor: "divider",
																	}}
																	onClick={(e) => e.stopPropagation()}
																>
																	<IconButton
																		size="small"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleEdit(figure.id);
																		}}
																		aria-label="Edit figure"
																		sx={{
																			color: "text.secondary",
																			"&:hover": {
																				color: "primary.main",
																			},
																		}}
																	>
																		<EditRoundedIcon fontSize="small" />
																	</IconButton>
																	<IconButton
																		size="small"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleDeleteClick(figure);
																		}}
																		aria-label="Delete figure"
																		sx={{
																			color: "text.secondary",
																			"&:hover": {
																				color: "error.main",
																			},
																		}}
																	>
																		<DeleteRoundedIcon fontSize="small" />
																	</IconButton>
																</Box>
															</CardContent>
														</Card>
													))}
												</Stack>
											)}

											{/* Mobile Pagination - Bottom */}
											<Box component={Paper} variant="outlined" sx={{ mt: 2 }}>
												<TablePagination
													rowsPerPageOptions={[5, 10, 25]}
													component="div"
													count={totalCount}
													rowsPerPage={rowsPerPage}
													page={page}
													onPageChange={handleChangePage}
													onRowsPerPageChange={handleChangeRowsPerPage}
												/>
											</Box>
										</>
									)}
								</>
							) : (
								<>
									{/* Desktop Table View */}
									{isLoadingPage ? (
										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												minHeight: 400,
												py: 6,
											}}
										>
											<CircularProgress />
										</Box>
									) : (
										<TableContainer component={Paper} variant="outlined">
											<Table>
												<TableHead>
													<TableRow>
														<TableCell width={40} />
														<TableCell>Name</TableCell>
														<TableCell>Type</TableCell>
														<TableCell>Description</TableCell>
														<TableCell align="right">Actions</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{filteredFigures.length === 0 ? (
														<TableRow>
															<TableCell colSpan={5} align="center">
																<Typography
																	variant="body2"
																	color="text.secondary"
																	sx={{ py: 3 }}
																>
																	No figures match the selected filter
																</Typography>
															</TableCell>
														</TableRow>
													) : (
														filteredFigures.map((figure) => (
															<>
																<TableRow
																	key={figure.id}
																	hover
																	sx={{
																		cursor: "pointer",
																		"& > *": { borderBottom: expandedRow === figure.id ? "none !important" : undefined },
																	}}
																>
																	<TableCell>
																		<IconButton
																			size="small"
																			onClick={() => handleRowClick(figure.id)}
																			aria-label={expandedRow === figure.id ? "collapse" : "expand"}
																		>
																			{expandedRow === figure.id ? (
																				<KeyboardArrowUpRoundedIcon fontSize="small" />
																			) : (
																				<KeyboardArrowDownRoundedIcon fontSize="small" />
																			)}
																		</IconButton>
																	</TableCell>
																	<TableCell onClick={() => handleRowClick(figure.id)}>
																		<Typography variant="body1" fontWeight={500}>
																			{figure.name}
																		</Typography>
																	</TableCell>
																	<TableCell onClick={() => handleRowClick(figure.id)}>
																		<Chip
																			icon={getTypeIcon(figure.type)}
																			label={figure.type}
																			color={getTypeColor(figure.type)}
																			size="small"
																		/>
																	</TableCell>
																	<TableCell onClick={() => handleRowClick(figure.id)}>
																		<Typography
																			variant="body2"
																			color="text.secondary"
																			sx={{
																				maxWidth: 400,
																				overflow: "hidden",
																				textOverflow: "ellipsis",
																				whiteSpace: "nowrap",
																			}}
																		>
																			{figure.description || (
																				<span style={{ fontStyle: "italic" }}>
																					No description
																				</span>
																			)}
																		</Typography>
																	</TableCell>
																	<TableCell align="right">
																		<IconButton
																			size="small"
																			onClick={(e) => {
																				e.stopPropagation();
																				handleEdit(figure.id);
																			}}
																			aria-label="Edit figure"
																			sx={{
																				color: "text.secondary",
																				"&:hover": {
																					color: "primary.main",
																				},
																			}}
																		>
																			<EditRoundedIcon fontSize="small" />
																		</IconButton>
																		<IconButton
																			size="small"
																			onClick={(e) => {
																				e.stopPropagation();
																				handleDeleteClick(figure);
																			}}
																			aria-label="Delete figure"
																			sx={{
																				color: "text.secondary",
																				"&:hover": {
																					color: "error.main",
																				},
																			}}
																		>
																			<DeleteRoundedIcon fontSize="small" />
																		</IconButton>
																	</TableCell>
																</TableRow>
																<TableRow key={`${figure.id}-expanded`}>
																	<TableCell
																		colSpan={5}
																		sx={{
																			py: 0,
																			borderBottom: expandedRow === figure.id ? undefined : "none",
																		}}
																	>
																		<Collapse
																			in={expandedRow === figure.id}
																			timeout="auto"
																			unmountOnExit
																		>
																			<Box
																				sx={{
																					py: 2,
																					px: 2,
																					bgcolor: "action.hover",
																					borderRadius: 1,
																					my: 1,
																				}}
																			>
																				<Typography
																					variant="body2"
																					color="text.secondary"
																					sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7, mb: figure.eventIds && figure.eventIds.length > 0 ? 2 : 0 }}
																				>
																					{figure.description || "No description provided"}
																				</Typography>
																				{figure.eventIds && figure.eventIds.length > 0 && (
																					<Box sx={{ mt: 2 }}>
																						<Typography
																							variant="caption"
																							color="text.secondary"
																							sx={{ fontWeight: 600, mb: 1, display: "block" }}
																						>
																							Linked Events:
																						</Typography>
																						<Stack spacing={0.5}>
																							{events
																								.filter((event) =>
																									figure.eventIds?.some(
																										(eventId) =>
																											String(eventId) ===
																											String(event.id),
																									),
																								)
																								.sort((a, b) => a.year - b.year)
																								.map((event) => (
																									<Typography
																										key={event.id}
																										variant="body2"
																										color="text.secondary"
																										sx={{ pl: 1 }}
																									>
																										• {event.title} ({event.year})
																									</Typography>
																								))}
																						</Stack>
																					</Box>
																				)}
																			</Box>
																		</Collapse>
																	</TableCell>
																</TableRow>
															</>
														))
													)}
												</TableBody>
											</Table>
											<TablePagination
												rowsPerPageOptions={[5, 10, 25, 50]}
												component="div"
												count={totalCount}
												rowsPerPage={rowsPerPage}
												page={page}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
											/>
										</TableContainer>
									)}
								</>
							)}
						</>
					)}
				</>
			)}

			<Fab
				color="primary"
				aria-label="Create new figure"
				onClick={handleCreateFigure}
				sx={{
					position: "fixed",
					right: { xs: 20, md: 32 },
					bottom: 24,
				}}
			>
				<AddRoundedIcon />
			</Fab>

			<FigureDialog
				mode="create"
				open={createDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
				onSave={handleCreateSave}
				worldId={worldId}
			/>
			<FigureDialog
				mode="edit"
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				onSave={handleEditSave}
				initialFigure={editingFigure ?? undefined}
			/>

			<Dialog
				open={deleteDialogOpen}
				onClose={handleDeleteCancel}
				aria-labelledby="delete-dialog-title"
				aria-describedby="delete-dialog-description"
			>
				<DialogTitle id="delete-dialog-title">Delete Figure?</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						Are you sure you want to delete "{deletingFigure?.name}"?
						This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteCancel} disabled={isDeleting}>
						Cancel
					</Button>
					<Button
						onClick={handleDeleteConfirm}
						color="error"
						variant="contained"
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				message={snackbarMessage}
			/>
		</Box>
	);
}

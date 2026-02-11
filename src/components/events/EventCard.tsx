import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
	Box,
	Button,
	CardContent,
	CardHeader,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import { useState } from "react";
import type { Event } from "../../services/types";

interface EventCardProps {
	event: Event;
	onEdit: (id: string) => void;
	onDelete: (id: string) => Promise<void>;
}

function EventCard({ event, onEdit, onDelete }: EventCardProps) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		// Blur the button to prevent aria-hidden accessibility warning
		if (e.currentTarget instanceof HTMLElement) {
			e.currentTarget.blur();
		}
		setDeleteDialogOpen(true);
	};

	const handleEditClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onEdit(event.id);
	};

	const handleDeleteConfirm = async () => {
		setIsDeleting(true);
		try {
			await onDelete(event.id);
			setDeleteDialogOpen(false);
		} catch (error) {
			console.error("Failed to delete event:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
	};

	return (
		<>
			<Card
				variant="outlined"
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					position: "relative",
					transition: "all 0.2s ease-in-out",
					"&:hover": {
						boxShadow: 2,
						transform: "translateY(-2px)",
					},
				}}
			>
				<Box
					sx={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						alignItems: "stretch",
						justifyContent: "flex-start",
					}}
				>
					<CardHeader
						title={
							<Typography variant="h5" component="h2" fontWeight={600}>
								{event.title}
							</Typography>
						}
						subheader={
							<Typography
								variant="h6"
								color="primary.main"
								fontWeight={500}
								sx={{ mt: 0.5 }}
							>
								{event.year}
							</Typography>
						}
						sx={{
							pb: 1,
							"& .MuiCardHeader-content": {
								width: "100%",
							},
						}}
					/>
					<CardContent
						sx={{
							pt: 0,
							pb: 3,
							flex: 1,
						}}
					>
						{event.description ? (
							<Typography
								variant="body1"
								color="text.secondary"
								sx={{
									lineHeight: 1.7,
									whiteSpace: "pre-wrap",
								}}
							>
								{event.description}
							</Typography>
						) : (
							<Typography
								variant="body2"
								color="text.disabled"
								fontStyle="italic"
							>
								No description provided
							</Typography>
						)}
					</CardContent>
				</Box>
				<Box
					sx={{
						display: "flex",
						gap: 0.5,
						p: 1.5,
						justifyContent: "flex-end",
						borderTop: 1,
						borderColor: "divider",
						bgcolor: "action.hover",
					}}
				>
					<IconButton
						size="small"
						onClick={handleEditClick}
						aria-label="Edit event"
						sx={{
							color: "text.secondary",
							"&:hover": {
								color: "primary.main",
								bgcolor: "background.paper",
							},
						}}
					>
						<EditRoundedIcon fontSize="small" />
					</IconButton>
					<IconButton
						size="small"
						onClick={handleDeleteClick}
						aria-label="Delete event"
						sx={{
							color: "text.secondary",
							"&:hover": {
								color: "error.main",
								bgcolor: "background.paper",
							},
						}}
					>
						<DeleteRoundedIcon fontSize="small" />
					</IconButton>
				</Box>
			</Card>
			<Dialog
				open={deleteDialogOpen}
				onClose={handleDeleteCancel}
				aria-labelledby="delete-dialog-title"
				aria-describedby="delete-dialog-description"
				disableAutoFocus={false}
				disableEnforceFocus={false}
			>
				<DialogTitle id="delete-dialog-title">
					Delete Event?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						Are you sure you want to delete "{event.title}"? This
						action cannot be undone.
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
		</>
	);
}

export default EventCard;

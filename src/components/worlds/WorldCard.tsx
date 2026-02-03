import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Typography,
} from "@mui/material";
import { useState } from "react";
import type { World } from "../../services/types";

interface WorldCardProps {
	world: World;
	isSelected: boolean;
	onSelect: (id: string) => void;
	onEdit: (id: string) => void;
	onDelete: (id: string) => Promise<void>;
}

function WorldCard({
	world,
	isSelected,
	onSelect,
	onEdit,
	onDelete,
}: WorldCardProps) {
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
		onEdit(world.id);
	};

	const handleCardClick = () => {
		onSelect(world.id);
	};

	const handleDeleteConfirm = async () => {
		setIsDeleting(true);
		try {
			await onDelete(world.id);
			setDeleteDialogOpen(false);
		} catch (error) {
			console.error("Failed to delete world:", error);
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
					height: "100%",
					display: "flex",
					flexDirection: "column",
					borderWidth: 2,
					borderColor: isSelected ? "primary.main" : "transparent",
					bgcolor: isSelected ? "action.selected" : undefined,
					transition: "all 0.2s ease-in-out",
					"&:hover": {
						borderColor: isSelected ? "primary.main" : "divider",
						boxShadow: (theme) =>
							theme.palette.mode === "dark"
								? "0px 12px 28px rgba(0,0,0,0.4)"
								: "0px 6px 16px rgba(0,0,0,0.12)",
					},
				}}
			>
				<CardActionArea
					onClick={handleCardClick}
					sx={{
						flex: 1,
						display: "flex",
						alignItems: "stretch",
						justifyContent: "flex-start",
					}}
				>
					<CardContent
						sx={{
							p: 2,
							display: "flex",
							flexDirection: "column",
							width: "100%",
						}}
					>
						<Box sx={{ flex: 1 }}>
							<Typography variant="h6" gutterBottom>
								{world.name}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								gutterBottom
							>
								{world.currentYear}
							</Typography>
							{world.description && (
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
										mt: 1,
									}}
								>
									{world.description}
								</Typography>
							)}
						</Box>
					</CardContent>
				</CardActionArea>
				<Box
					sx={{
						display: "flex",
						gap: 0.5,
						p: 2,
						pt: 1,
						borderTop: 1,
						borderColor: "divider",
					}}
				>
					<IconButton
						size="small"
						onClick={handleEditClick}
						aria-label="Edit world"
						sx={{
							color: "text.secondary",
							"&:hover": {
								color: "primary.main",
								bgcolor: "action.hover",
							},
						}}
					>
						<EditRoundedIcon fontSize="small" />
					</IconButton>
					<IconButton
						size="small"
						onClick={handleDeleteClick}
						aria-label="Delete world"
						sx={{
							color: "text.secondary",
							"&:hover": {
								color: "error.main",
								bgcolor: "action.hover",
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
					Delete World?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						Are you sure you want to delete "{world.name}"? This
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

export default WorldCard;

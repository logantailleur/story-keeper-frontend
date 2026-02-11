import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import {
	Alert,
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Figure } from "../../services/types";
import { fetchFigures } from "../../utils/api/figures";

interface FormState {
	title: string;
	year: string;
	description: string;
	worldId: string;
	backendError?: string;
}

interface ValidationResult {
	valid: boolean;
	errors?: Record<string, string>;
}

const YEAR_MIN = -10_000;
const YEAR_MAX = 10_000;

function validateForm(
	values: FormState,
	mode: "create" | "edit",
): ValidationResult {
	const errors: Record<string, string> = {};

	const titleTrimmed = values.title.trim();
	if (!titleTrimmed) {
		errors.title = "Title is required";
	}

	const yearNum = parseInt(values.year, 10);
	if (values.year === "" || Number.isNaN(yearNum)) {
		errors.year = "Year must be a valid integer.";
	} else if (yearNum < YEAR_MIN || yearNum > YEAR_MAX) {
		errors.year = `Year must be between ${YEAR_MIN} and ${YEAR_MAX}.`;
	}

	const descriptionTrimmed = values.description.trim();
	if (!descriptionTrimmed) {
		errors.description = "Description is required";
	}

	if (mode === "create" && !values.worldId.trim()) {
		errors.worldId = "World is required";
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors: Object.keys(errors).length > 0 ? errors : undefined,
	};
}

export interface EventFormPayload {
	id?: string;
	title: string;
	year: number;
	description?: string;
	worldId: string;
}

interface EventDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (payload: EventFormPayload) => Promise<void>;
	mode: "create" | "edit";
	initialEvent?: EventFormPayload;
	worldId?: string;
}

function EventDialog({
	open,
	onClose,
	onSave,
	mode,
	initialEvent,
	worldId: worldIdProp,
}: EventDialogProps) {
	const navigate = useNavigate();
	const [formState, setFormState] = useState<FormState>({
		title: "",
		year: "",
		description: "",
		worldId: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [linkedFigures, setLinkedFigures] = useState<Figure[]>([]);
	const [linkedFiguresLoading, setLinkedFiguresLoading] = useState(false);

	useEffect(() => {
		if (open && mode === "edit" && initialEvent) {
			setFormState({
				title: initialEvent.title,
				year: String(initialEvent.year),
				description: initialEvent.description ?? "",
				worldId: initialEvent.worldId,
			});
		} else if (open && mode === "create") {
			setFormState({
				title: "",
				year: "",
				description: "",
				worldId: worldIdProp ?? "",
			});
		}
	}, [open, mode, initialEvent, worldIdProp]);

	// Fetch figures linked to this event when in edit mode
	useEffect(() => {
		if (!open || mode !== "edit" || !initialEvent?.id || !initialEvent.worldId) {
			setLinkedFigures([]);
			return;
		}
		let cancelled = false;
		setLinkedFiguresLoading(true);
		fetchFigures(initialEvent.worldId, { limit: 500 })
			.then((result) => {
				if (cancelled || result.status !== "success") return;
				const eventIdStr = String(initialEvent.id);
				const linked = result.data.figures.filter((f) =>
					f.eventIds?.some((id) => String(id) === eventIdStr),
				);
				setLinkedFigures(linked);
			})
			.finally(() => {
				if (!cancelled) setLinkedFiguresLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [open, mode, initialEvent?.id, initialEvent?.worldId]);

	const validation = validateForm(formState, mode);
	const { valid, errors = {} } = validation;

	function updateField<K extends keyof FormState>(
		field: K,
		value: FormState[K],
	) {
		setFormState((prev) => ({ ...prev, [field]: value }));
	}

	function resetForm() {
		setSubmitAttempted(false);
		setFormState({
			title: "",
			year: "",
			description: "",
			worldId: worldIdProp ?? "",
		});
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!valid || isSubmitting) {
			setSubmitAttempted(true);
			return;
		}

		updateField("backendError", undefined);
		setIsSubmitting(true);
		try {
			await onSave({
				id: initialEvent?.id,
				title: formState.title.trim(),
				year: parseInt(formState.year, 10),
				description: formState.description.trim() || undefined,
				worldId: formState.worldId,
			});
			resetForm();
			onClose();
		} catch (err) {
			updateField(
				"backendError",
				err instanceof Error ? err.message : "Something went wrong.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	function handleClose() {
		if (!isSubmitting) {
			resetForm();
			updateField("backendError", undefined);
			onClose();
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="event-dialog-title"
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle id="event-dialog-title">
				{mode === "create" ? "Create event" : "Edit event"}
			</DialogTitle>
			<form onSubmit={handleSubmit} noValidate>
				<DialogContent>
					{formState.backendError && (
						<Alert
							severity="error"
							sx={{ mb: 2 }}
							onClose={() =>
								updateField("backendError", undefined)
							}
						>
							{formState.backendError}
						</Alert>
					)}
					{mode === "create" && submitAttempted && errors.worldId && (
						<Alert severity="warning" sx={{ mb: 2 }}>
							{errors.worldId}
						</Alert>
					)}
					<TextField
						label="Title"
						value={formState.title}
						onChange={(e) => updateField("title", e.target.value)}
						error={submitAttempted && !!errors.title}
						helperText={submitAttempted ? errors.title : undefined}
						fullWidth
						margin="normal"
						required
						autoFocus
					/>
					<TextField
						label="Year"
						type="number"
						placeholder="0"
						value={formState.year}
						onChange={(e) => updateField("year", e.target.value)}
						error={submitAttempted && !!errors.year}
						helperText={submitAttempted ? errors.year : undefined}
						fullWidth
						margin="normal"
						required
						inputProps={{
							min: YEAR_MIN,
							max: YEAR_MAX,
							step: 1,
						}}
					/>
					<TextField
						label="Description"
						value={formState.description}
						onChange={(e) =>
							updateField("description", e.target.value)
						}
						error={submitAttempted && !!errors.description}
						helperText={
							submitAttempted ? errors.description : undefined
						}
						fullWidth
						margin="normal"
						multiline
						rows={3}
						required
					/>
					{mode === "edit" && (
						<Box sx={{ mt: 2 }}>
							<Typography
								variant="subtitle2"
								color="text.secondary"
								sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}
							>
								<PeopleRoundedIcon fontSize="small" />
								Linked figures
							</Typography>
							{linkedFiguresLoading ? (
								<Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
									<CircularProgress size={20} />
									<Typography variant="body2" color="text.secondary">
										Loading…
									</Typography>
								</Box>
							) : linkedFigures.length === 0 ? (
								<Typography variant="body2" color="text.disabled">
									No figures linked to this event. Link figures from the Figures page.
								</Typography>
							) : (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
									{linkedFigures.map((figure) => (
										<Chip
											key={figure.id}
											label={figure.name}
											size="small"
											clickable
											onClick={() => {
												onClose();
												navigate("/figures", {
													state: { openFigureId: figure.id },
												});
											}}
											sx={{
												"&:hover": {
													bgcolor: "action.selected",
												},
											}}
										/>
									))}
								</Box>
							)}
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={!valid || isSubmitting}
					>
						{isSubmitting
							? mode === "create"
								? "Creating..."
								: "Saving..."
							: mode === "create"
								? "Create"
								: "Save"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default EventDialog;

import {
	Alert,
	Autocomplete,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useWorld } from "../../contexts/WorldContext";
import { Event, FigureType } from "../../services/types";
import { fetchEvents } from "../../utils/api/events";
import { linkFigureEvent, unlinkFigureEvent } from "../../utils/api/figures";

interface FormState {
	name: string;
	type: FigureType;
	description: string;
	worldId: string;
	backendError?: string;
}

interface ValidationResult {
	valid: boolean;
	errors?: Record<string, string>;
}

function validateForm(
	values: FormState,
	mode: "create" | "edit",
): ValidationResult {
	const errors: Record<string, string> = {};

	const nameTrimmed = values.name.trim();
	if (!nameTrimmed) {
		errors.name = "Name is required";
	}

	if (mode === "create" && !values.worldId.trim()) {
		errors.worldId = "World is required";
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors: Object.keys(errors).length > 0 ? errors : undefined,
	};
}

export interface FigureFormPayload {
	id?: string;
	name: string;
	type: FigureType;
	description?: string;
	worldId: string;
	eventIds?: (string | number)[];
}

interface FigureDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (payload: FigureFormPayload) => Promise<void>;
	mode: "create" | "edit";
	initialFigure?: FigureFormPayload;
	worldId?: string;
}

function FigureDialog({
	open,
	onClose,
	onSave,
	mode,
	initialFigure,
	worldId: worldIdProp,
}: FigureDialogProps) {
	const { worldId: contextWorldId } = useWorld();
	const worldId = worldIdProp ?? contextWorldId;
	const [formState, setFormState] = useState<FormState>({
		name: "",
		type: FigureType.PERSON,
		description: "",
		worldId: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [events, setEvents] = useState<Event[]>([]);
	const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
	const [isLoadingEvents, setIsLoadingEvents] = useState(false);

	useEffect(() => {
		if (open && mode === "edit" && initialFigure) {
			setFormState({
				name: initialFigure.name,
				type: initialFigure.type,
				description: initialFigure.description ?? "",
				worldId: initialFigure.worldId,
			});
		} else if (open && mode === "create") {
			setFormState({
				name: "",
				type: FigureType.PERSON,
				description: "",
				worldId: worldIdProp ?? "",
			});
		}
	}, [open, mode, initialFigure, worldIdProp]);

	// Fetch events when dialog opens
	useEffect(() => {
		if (open && worldId) {
			setIsLoadingEvents(true);
			fetchEvents(worldId).then((result) => {
				if (result.status === "success") {
					setEvents(result.data);
					// Set selected events if editing
					if (mode === "edit" && initialFigure?.eventIds) {
						const linkedEvents = result.data.filter((event) =>
							initialFigure.eventIds?.some(
								(eventId) => String(eventId) === String(event.id),
							),
						);
						setSelectedEvents(linkedEvents);
					} else {
						setSelectedEvents([]);
					}
				}
				setIsLoadingEvents(false);
			});
		} else {
			setEvents([]);
			setSelectedEvents([]);
		}
	}, [open, worldId, mode, initialFigure]);

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
			name: "",
			type: FigureType.PERSON,
			description: "",
			worldId: worldIdProp ?? "",
		});
		setSelectedEvents([]);
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
				id: initialFigure?.id,
				name: formState.name.trim(),
				type: formState.type,
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

	async function handleEventChange(_event: unknown, newValue: Event[]) {
		if (mode !== "edit" || !initialFigure?.id) {
			return;
		}

		const figureId = initialFigure!.id;
		const oldEventIds = new Set(selectedEvents.map((e) => e.id));
		const newEventIds = new Set(newValue.map((e) => e.id));

		// Find events to link (in new but not in old)
		const eventsToLink = newValue.filter(
			(event) => !oldEventIds.has(event.id),
		);
		// Find events to unlink (in old but not in new)
		const eventsToUnlink = selectedEvents.filter(
			(event) => !newEventIds.has(event.id),
		);

		// Update state optimistically
		setSelectedEvents(newValue);

		// Update links immediately when selection changes
		try {
			// Link new events
			for (const event of eventsToLink) {
				const result = await linkFigureEvent(figureId, event.id);
				if (result.status === "error") {
					throw new Error(result.error);
				}
			}

			// Unlink removed events
			for (const event of eventsToUnlink) {
				const result = await unlinkFigureEvent(figureId, event.id);
				if (result.status === "error") {
					throw new Error(result.error);
				}
			}
		} catch (err) {
			// Revert state on error
			setSelectedEvents(selectedEvents);
			updateField(
				"backendError",
				err instanceof Error
					? err.message
					: "Failed to update event links.",
			);
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
			aria-labelledby="figure-dialog-title"
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle id="figure-dialog-title">
				{mode === "create" ? "Create figure" : "Edit figure"}
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
						label="Name"
						value={formState.name}
						onChange={(e) => updateField("name", e.target.value)}
						error={submitAttempted && !!errors.name}
						helperText={submitAttempted ? errors.name : undefined}
						fullWidth
						margin="normal"
						required
						autoFocus
					/>
					<TextField
						select
						label="Type"
						value={formState.type}
						onChange={(e) =>
							updateField("type", e.target.value as FigureType)
						}
						fullWidth
						margin="normal"
						required
					>
						<MenuItem value={FigureType.PERSON}>Person</MenuItem>
						<MenuItem value={FigureType.FACTION}>Faction</MenuItem>
					</TextField>
					<TextField
						label="Description"
						value={formState.description}
						onChange={(e) =>
							updateField("description", e.target.value)
						}
						fullWidth
						margin="normal"
						multiline
						rows={4}
					/>
					{mode === "edit" && (
						<Autocomplete
							multiple
							options={events}
							getOptionLabel={(option) => `${option.title} (${option.year})`}
							value={selectedEvents}
							onChange={handleEventChange}
							loading={isLoadingEvents}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Linked Events"
									margin="normal"
									placeholder="Select events..."
								/>
							)}
							isOptionEqualToValue={(option, value) => option.id === value.id}
						/>
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

export default FigureDialog;

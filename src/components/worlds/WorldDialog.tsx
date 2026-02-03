import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { World } from "../../services/types";

interface FormState {
	name: string;
	startYear: string;
	currentYear: string;
	description: string;
	backendError?: string;
}

interface ValidationResult {
	valid: boolean;
	errors?: Record<string, string>;
}

const YEAR_MIN = -10_000;
const YEAR_MAX = 10_000;

function validateForm(values: FormState): ValidationResult {
	const errors: Record<string, string> = {};

	const nameTrimmed = values.name.trim();
	if (!nameTrimmed) {
		errors.name = "Name is required";
	}

	const startNum = parseInt(values.startYear, 10);
	if (values.startYear === "" || Number.isNaN(startNum)) {
		errors.startYear = "Start year must be a valid integer.";
	} else if (startNum < YEAR_MIN || startNum > YEAR_MAX) {
		errors.startYear = `Start year must be between ${YEAR_MIN} and ${YEAR_MAX}.`;
	}

	const currentNum = parseInt(values.currentYear, 10);
	if (values.currentYear === "" || Number.isNaN(currentNum)) {
		errors.currentYear = "Current year must be a valid integer.";
	} else if (currentNum < YEAR_MIN || currentNum > YEAR_MAX) {
		errors.currentYear = `Current year must be between ${YEAR_MIN} and ${YEAR_MAX}.`;
	}

	if (!errors.startYear && !errors.currentYear) {
		const s = parseInt(values.startYear, 10);
		const c = parseInt(values.currentYear, 10);
		if (!Number.isNaN(s) && !Number.isNaN(c) && s > c) {
			errors.currentYear = "Current year must be on or after start year.";
		}
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors: Object.keys(errors).length > 0 ? errors : undefined,
	};
}

export interface WorldFormPayload {
	id?: string;
	name: string;
	startYear: number;
	currentYear: number;
	description?: string;
}

interface WorldDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (data: WorldFormPayload) => Promise<void>;
	mode: "create" | "edit";
	initialWorld?: World;
}

function WorldDialog({
	open,
	onClose,
	onSave,
	mode,
	initialWorld,
}: WorldDialogProps) {
	const [formState, setFormState] = useState<FormState>({
		name: "",
		startYear: "",
		currentYear: "",
		description: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitAttempted, setSubmitAttempted] = useState(false);

	useEffect(() => {
		if (open && mode === "edit" && initialWorld) {
			setFormState({
				name: initialWorld.name,
				startYear: initialWorld.startYear.toString(),
				currentYear: initialWorld.currentYear.toString(),
				description: initialWorld.description || "",
			});
		} else if (open && mode === "create") {
			resetForm();
		}
	}, [open, mode, initialWorld]);

	const validation = validateForm(formState);
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
			startYear: "",
			currentYear: "",
			description: "",
			backendError: undefined,
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
				id: initialWorld?.id,
				name: formState.name.trim(),
				startYear: parseInt(formState.startYear, 10),
				currentYear: parseInt(formState.currentYear, 10),
				description: formState.description.trim() || undefined,
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
			aria-labelledby="world-dialog-title"
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle id="world-dialog-title">
				{mode === "create" ? "Create world" : "Edit world"}
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
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							gap: 2,
							mt: 2,
							mb: 1,
						}}
					>
						<TextField
							label="Start year"
							type="number"
							placeholder="0"
							value={formState.startYear}
							onChange={(e) =>
								updateField("startYear", e.target.value)
							}
							error={submitAttempted && !!errors.startYear}
							helperText={
								submitAttempted ? errors.startYear : undefined
							}
							sx={{ flex: 1 }}
							required
							inputProps={{
								min: YEAR_MIN,
								max: YEAR_MAX,
								step: 1,
							}}
						/>
						<TextField
							label="Current year"
							type="number"
							value={formState.currentYear}
							onChange={(e) =>
								updateField("currentYear", e.target.value)
							}
							error={submitAttempted && !!errors.currentYear}
							helperText={
								submitAttempted ? errors.currentYear : undefined
							}
							sx={{ flex: 1 }}
							required
							inputProps={{
								min: YEAR_MIN,
								max: YEAR_MAX,
								step: 1,
							}}
						/>
					</Box>
					<TextField
						label="Description"
						value={formState.description}
						onChange={(e) =>
							updateField("description", e.target.value)
						}
						fullWidth
						margin="normal"
						multiline
						rows={3}
					/>
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

export default WorldDialog;

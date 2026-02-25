import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import {
	Alert,
	Box,
	CircularProgress,
	Grid,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineCard } from "../components/timeline";
import { useWorld } from "../contexts/WorldContext";
import type { ApiState, Event } from "../services/types";
import { fetchEvents } from "../utils/api/events";

const TIMELINE_LAYOUT_KEY = "story-keeper-timeline-layout";

type TimelineLayout = "vertical" | "horizontal";

export default function Timeline() {
	const navigate = useNavigate();
	const { worldId } = useWorld();
	const [layout, setLayout] = useState<TimelineLayout>(() => {
		if (typeof window === "undefined") return "vertical";
		const stored = localStorage.getItem(TIMELINE_LAYOUT_KEY);
		return stored === "horizontal" ? "horizontal" : "vertical";
	});
	const [eventsState, setEventsState] = useState<ApiState<Event[]>>({
		status: "loading",
	});

	// Require world selected: redirect to dashboard if none
	useEffect(() => {
		if (!worldId) {
			navigate("/dashboard", { replace: true });
		}
	}, [worldId, navigate]);

	// Fetch events for the selected world
	useEffect(() => {
		if (!worldId) return;

		let cancelled = false;

		async function load() {
			const result = await fetchEvents(worldId);
			if (!cancelled) {
				setEventsState(result);
			}
		}

		setEventsState({ status: "loading" });
		load();
		return () => {
			cancelled = true;
		};
	}, [worldId]);

	const sortedEvents =
		eventsState.status === "success"
			? [...eventsState.data].sort((a, b) => a.year - b.year)
			: [];

	const groupedByYear = sortedEvents.reduce<Record<number, Event[]>>(
		(acc, event) => {
			const year = event.year;
			if (!acc[year]) acc[year] = [];
			acc[year].push(event);
			return acc;
		},
		{},
	);
	const yearsSorted = Object.keys(groupedByYear)
		.map(Number)
		.sort((a, b) => a - b);

	const handleLayoutChange = (
		_: React.MouseEvent<HTMLElement>,
		value: TimelineLayout | null,
	) => {
		if (value !== null) {
			setLayout(value);
			localStorage.setItem(TIMELINE_LAYOUT_KEY, value);
		}
	};

	return (
		<Box>
			<Box>
				<Typography variant="h4" component="h1" gutterBottom>
					Timeline
				</Typography>
				<Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
					Events for your world in chronological order.
				</Typography>
				{eventsState.status === "success" && sortedEvents.length > 0 && (
					<ToggleButtonGroup
						value={layout}
						exclusive
						onChange={handleLayoutChange}
						aria-label="Timeline layout"
						size="small"
						sx={{ mb: 1 }}
					>
						<ToggleButton value="vertical" aria-label="Vertical layout">
							<ViewAgendaRoundedIcon sx={{ mr: 0.5 }} />
							Vertical
						</ToggleButton>
						<ToggleButton value="horizontal" aria-label="Horizontal scroll">
							<TimelineRoundedIcon sx={{ mr: 0.5 }} />
							Horizontal
						</ToggleButton>
					</ToggleButtonGroup>
				)}
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
					{sortedEvents.length === 0 ? (
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
								Add events from the Events page to see them on
								the timeline.
							</Typography>
						</Box>
					) : (
						<Box sx={{ mt: 2 }}>
							{layout === "vertical" ? (
								<Grid container direction="column" spacing={3}>
									{yearsSorted.map((year) => (
										<Grid size={12} key={year}>
											<Box>
												<Typography
													variant="h6"
													component="h2"
													color="primary"
													sx={{
														mb: 1.5,
														fontWeight: 600,
														letterSpacing: "0.02em",
													}}
												>
													{year}
												</Typography>
												<Grid container spacing={3}>
													{groupedByYear[year].map((event) => (
														<Grid
															size={
																groupedByYear[year].length === 1
																	? 12
																	: { xs: 12, md: 6 }
															}
															key={event.id}
														>
															<TimelineCard event={event} />
														</Grid>
													))}
												</Grid>
											</Box>
										</Grid>
									))}
								</Grid>
							) : (
								<Box
									sx={{
										overflowX: "auto",
										overflowY: "hidden",
										display: "flex",
										gap: 3,
										pb: 2,
										mt: 1,
										"&::-webkit-scrollbar": { height: 8 },
										"&::-webkit-scrollbar-thumb": {
											bgcolor: "action.selected",
											borderRadius: 4,
										},
									}}
								>
									{yearsSorted.map((year) => (
										<Box
											key={year}
											sx={{
												width: 320,
												minWidth: 320,
												flexShrink: 0,
												display: "flex",
												flexDirection: "column",
												gap: 2,
											}}
										>
											<Typography
												variant="h6"
												component="h2"
												color="primary"
												sx={{
													fontWeight: 600,
													letterSpacing: "0.02em",
												}}
											>
												{year}
											</Typography>
											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													gap: 2,
													width: "100%",
													minWidth: 0,
												}}
											>
												{groupedByYear[year].map((event) => (
													<TimelineCard key={event.id} event={event} />
												))}
											</Box>
										</Box>
									))}
								</Box>
							)}
						</Box>
					)}
				</>
			)}
		</Box>
	);
}

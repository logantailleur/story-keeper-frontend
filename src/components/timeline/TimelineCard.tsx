import {
	Card,
	CardContent,
	CardHeader,
	Typography,
	useTheme,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { Event } from "../../services/types";

const importanceColors: Record<
	NonNullable<Event["importance"]>,
	string
> = {
	LOW: "grey",
	MEDIUM: "info.main",
	HIGH: "warning.main",
	CRITICAL: "error.main",
};

function getImportanceBorderColor(
	theme: Theme,
	importance: NonNullable<Event["importance"]>,
): string {
	const key = importanceColors[importance];
	if (key === "grey") return theme.palette.grey[500];
	const [paletteKey] = key.split(".");
	const palette = theme.palette[paletteKey as keyof Theme["palette"]];
	return typeof palette === "object" && palette && "main" in palette
		? (palette as { main: string }).main
		: theme.palette.divider;
}

interface TimelineCardProps {
	event: Event;
}

export default function TimelineCard({ event }: TimelineCardProps) {
	const theme = useTheme();
	const borderColor =
		event.importance != null
			? getImportanceBorderColor(theme, event.importance)
			: theme.palette.divider;

	return (
		<Card
			variant="outlined"
			sx={{
				width: "100%",
				borderLeft: `6px solid ${borderColor}`,
			}}
		>
			<CardHeader
				title={
					<Typography variant="h6" component="h2" fontWeight={600}>
						{event.title}
					</Typography>
				}
				subheader={
					<Typography variant="body2" color="primary.main" fontWeight={500}>
						{event.year}
					</Typography>
				}
				sx={{ pb: 0 }}
			/>
			<CardContent sx={{ pt: 1 }}>
				{event.description ? (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ whiteSpace: "pre-wrap" }}
					>
						{event.description}
					</Typography>
				) : (
					<Typography variant="body2" color="text.disabled" fontStyle="italic">
						No description
					</Typography>
				)}
			</CardContent>
		</Card>
	);
}

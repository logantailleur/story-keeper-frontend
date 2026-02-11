import { CardContent, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import type { Event } from "../../services/types";

interface EventCardProps {
	event: Event;
}

function EventCard({ event }: EventCardProps) {
	return (
		<Card>
			<CardContent>
				<Typography variant="h6">{event.title}</Typography>
			</CardContent>
		</Card>
	);
}

export default EventCard;

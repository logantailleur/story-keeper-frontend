import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ApiState, fetchHealth } from "../utils/api";

function Home() {
	const [healthState, setHealthState] = useState<
		ApiState<{ status: string; timestamp?: string }>
	>({ status: "loading" });

	useEffect(() => {
		const loadHealth = async () => {
			const result = await fetchHealth();
			setHealthState(result);
		};
		loadHealth();
	}, []);

	return (
		<Box sx={{ mt: 4 }}>
			{healthState.status === "loading" && (
				<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
					<CircularProgress />
				</Box>
			)}
			{healthState.status === "success" && (
				<Typography variant="body1">
					{JSON.stringify(healthState.data, null, 2)}
				</Typography>
			)}
			{healthState.status === "error" && (
				<Typography variant="body1" color="error">
					Error: {healthState.error}
				</Typography>
			)}
		</Box>
	);
}

export default Home;

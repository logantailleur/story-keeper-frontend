import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Stack,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useApiClient } from "../contexts/ProviderContext";
import { fetchHealth } from "../utils/api";

type HealthData = { status: string; timestamp?: string };

export default function Health() {
	const apiClient = useApiClient();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<HealthData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		const result = await fetchHealth(apiClient);
		if (result.status === "success") {
			setData(result.data);
		} else {
			setData(null);
			setError("Health check failed");
		}
		setLoading(false);
	}, [apiClient]);

	useEffect(() => {
		void load();
	}, [load]);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: "background.default",
				p: { xs: 2, sm: 3 },
			}}
		>
			<Stack spacing={2} sx={{ maxWidth: 900, mx: "auto" }}>
				<Stack
					direction="row"
					spacing={1.5}
					alignItems="center"
					flexWrap="wrap"
					useFlexGap
				>
					<Typography variant="h1" component="h1">
						Health
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Button
						variant="outlined"
						onClick={() => void load()}
						disabled={loading}
					>
						Refresh
					</Button>
				</Stack>

				<Card>
					<CardContent>
						<Stack spacing={1.5}>
							<Typography variant="body2" color="text.secondary">
								API base URL:{" "}
								<Box
									component="span"
									sx={{ fontFamily: "monospace" }}
								>
									{apiClient.getBaseUrl()}
								</Box>
							</Typography>

							{loading ? (
								<Alert severity="info">Checking…</Alert>
							) : error ? (
								<Alert severity="error">{error}</Alert>
							) : data ? (
								<Alert
									severity={
										data.status === "ok"
											? "success"
											: "warning"
									}
								>
									Status: {data.status}
									{data.timestamp
										? ` · ${data.timestamp}`
										: null}
								</Alert>
							) : (
								<Alert severity="warning">No response.</Alert>
							)}

							<Typography variant="h3" component="h2">
								Raw response
							</Typography>
							<Box
								component="pre"
								sx={{
									m: 0,
									p: 2,
									borderRadius: 2,
									overflowX: "auto",
									bgcolor: "background.paper",
									border: 1,
									borderColor: "divider",
									fontFamily:
										"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
									fontSize: 13,
									lineHeight: 1.45,
								}}
							>
								{JSON.stringify({ data, error }, null, 2)}
							</Box>
						</Stack>
					</CardContent>
				</Card>
			</Stack>
		</Box>
	);
}

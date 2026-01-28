import { Box, Typography } from "@mui/material";

/**
 * Short blurb describing the site, shown under the login/register cards.
 */
export function AuthTagline() {
	return (
		<Box
			sx={{
				mt: { xs: 2, sm: 3 },
				px: { xs: 0, sm: 2 },
				maxWidth: 400,
				width: "100%",
				textAlign: "center",
			}}
		>
			<Typography variant="body2" color="text.secondary">
				Story Keeper helps you organize your stories, worlds, and campaigns in
				one place.
			</Typography>
		</Box>
	);
}

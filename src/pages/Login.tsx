import { Box, Paper, Typography } from "@mui/material";

function Login() {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "60vh",
			}}
		>
			<Paper elevation={3} sx={{ p: 4, minWidth: 400 }}>
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					align="center"
				>
					Login
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary"
					align="center"
				>
					Login page placeholder
				</Typography>
			</Paper>
		</Box>
	);
}

export default Login;

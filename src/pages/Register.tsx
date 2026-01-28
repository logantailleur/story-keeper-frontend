import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Link,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthTagline } from "../components/auth/AuthTagline";
import { useAuth } from "../contexts/AuthContext";

function Register() {
	const navigate = useNavigate();
	const { signUp } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		if (!email.trim()) {
			setError("Email is required.");
			return;
		}
		if (!password) {
			setError("Password is required.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setIsSubmitting(true);
		try {
			await signUp(email.trim(), password);
			navigate("/dashboard", { replace: true });
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Registration failed.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				width: "100%",
				boxSizing: "border-box",
				py: { xs: 3, sm: 4 },
				px: { xs: 2, sm: 0 },
			}}
		>
			<Card
				sx={{
					width: { xs: "100%", sm: 400 },
					minWidth: 0,
					maxWidth: 400,
				}}
			>
				<CardContent sx={{ p: { xs: 3, sm: 4 } }}>
					<Typography
						variant="h3"
						component="h1"
						gutterBottom
						align="center"
						sx={{ fontSize: { xs: "1.5rem", sm: undefined } }}
					>
						Register
					</Typography>
					<form onSubmit={handleSubmit} noValidate>
						<TextField
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							fullWidth
							margin="normal"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							label="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							fullWidth
							margin="normal"
							autoComplete="new-password"
						/>
						<TextField
							label="Confirm password"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							fullWidth
							margin="normal"
							autoComplete="new-password"
						/>
						{error && (
							<Alert severity="error" sx={{ mt: 2 }}>
								{error}
							</Alert>
						)}
						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
							disabled={isSubmitting}
							sx={{ mt: 3, mb: 1 }}
						>
							{isSubmitting ? "Creating account..." : "Submit"}
						</Button>
						<Typography
							variant="body2"
							color="text.secondary"
							align="center"
							sx={{ mt: 2 }}
						>
							Have an account?{" "}
							<Link
								component={RouterLink}
								to="/login"
								variant="body2"
								underline="hover"
								fontWeight={600}
							>
								Sign in
							</Link>
						</Typography>
					</form>
				</CardContent>
			</Card>
			<AuthTagline />
		</Box>
	);
}

export default Register;

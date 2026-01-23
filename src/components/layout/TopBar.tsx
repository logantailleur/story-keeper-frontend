import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
	AppBar,
	Box,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	Toolbar,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

export type WorldOption = { id: string; name: string };

export function TopBar({
	isMobile,
	onMenuClick,
	drawerWidth = 0,
	worlds = [],
	worldId = "",
	onWorldChange,
}: {
	isMobile: boolean;
	onMenuClick: () => void;
	drawerWidth?: number;
	worlds?: WorldOption[];
	worldId?: string;
	onWorldChange?: (worldId: string) => void;
}) {
	const { mode, setMode } = useColorScheme();

	return (
		<AppBar
			position="fixed"
			elevation={0}
			sx={{
				width: { md: `calc(100% - ${drawerWidth}px)` },
				ml: { md: `${drawerWidth}px` },
				bgcolor: "background.paper",
				color: "text.primary",
				borderBottom: 1,
				borderColor: "divider",
			}}
		>
			<Toolbar sx={{ gap: 1.5, minHeight: { xs: 60, sm: 68 } }}>
				{isMobile && (
					<IconButton
						edge="start"
						onClick={onMenuClick}
						aria-label="Open sidebar"
						sx={{ mr: 0.5 }}
					>
						<MenuRoundedIcon />
					</IconButton>
				)}

				<Box
					component={NavLink}
					to="/dashboard"
					aria-label="Go to dashboard"
					sx={{
						display: "flex",
						alignItems: "center",
						textDecoration: "none",
						color: "inherit",
					}}
				>
					<Box
						component="img"
						src="/branding/sk-logo-lg.png"
						alt="Story Keeper"
						sx={{
							// Slightly larger than MUI Toolbar defaults (regular variant)
							height: { xs: 60, sm: 68 },
							width: "auto",
							display: "block",
							objectFit: "contain",
						}}
					/>
				</Box>

				<FormControl size="small" sx={{ minWidth: 200 }}>
					<Select
						value={worldId}
						displayEmpty
						onChange={(e) =>
							onWorldChange?.(String(e.target.value))
						}
						renderValue={(value) => {
							if (!value) return "World";
							return (
								worlds.find((w) => w.id === value)?.name ??
								"World"
							);
						}}
						sx={{
							borderRadius: 2,
							bgcolor: "background.paper",
						}}
					>
						<MenuItem value="" disabled>
							World
						</MenuItem>
						{worlds.map((w) => (
							<MenuItem key={w.id} value={w.id}>
								{w.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Box sx={{ flexGrow: 1 }} />

				<IconButton
					aria-label="Toggle night mode"
					onClick={() => setMode(mode === "dark" ? "light" : "dark")}
				>
					{mode === "dark" ? (
						<DarkModeRoundedIcon />
					) : (
						<LightModeRoundedIcon />
					)}
				</IconButton>

				<IconButton aria-label="User menu">
					<AccountCircleRoundedIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

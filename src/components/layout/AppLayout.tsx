import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Drawer, Fab, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import type { WorldOption } from "./TopBar";
import { WorldProvider } from "../../contexts/WorldContext";
import { PageContainer } from "./PageContainer";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";
import { fetchWorlds } from "../../utils/api/worlds";

const DRAWER_WIDTH_EXPANDED = 280;
const DRAWER_WIDTH_COLLAPSED = 76;
const WORLD_ID_STORAGE_KEY = "story-keeper-world-id";

export function AppLayout() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [mobileOpen, setMobileOpen] = useState(false);
	const [sidebarExpanded, setSidebarExpanded] = useState(false);
	const [worlds, setWorlds] = useState<WorldOption[]>([]);
	const [worldId, setWorldId] = useState<string>(() => {
		if (typeof window === "undefined") return "";
		return String(
			localStorage.getItem(WORLD_ID_STORAGE_KEY) ?? "",
		);
	});

	useEffect(() => {
		fetchWorlds().then((result) => {
			if (result.status === "success") {
				setWorlds(
					result.data.map((w) => ({
						id: String(w.id),
						name: w.name,
					})),
				);
			}
		});
	}, []);

	const handleWorldChange = (id: string) => {
		const next = String(id);
		setWorldId(next);
		localStorage.setItem(WORLD_ID_STORAGE_KEY, next);
	};

	const reservedDesktopWidth = DRAWER_WIDTH_COLLAPSED;
	const paperWidth = isMobile
		? DRAWER_WIDTH_EXPANDED
		: sidebarExpanded
			? DRAWER_WIDTH_EXPANDED
			: DRAWER_WIDTH_COLLAPSED;

	const drawerProps = useMemo(
		() =>
			isMobile
				? ({
						variant: "temporary",
						open: mobileOpen,
						onClose: () => setMobileOpen(false),
						ModalProps: { keepMounted: true },
					} as const)
				: ({
						variant: "permanent",
						open: true,
					} as const),
		[isMobile, mobileOpen],
	);

	return (
		<WorldProvider
			worldId={worldId}
			setWorldId={handleWorldChange}
		>
			<Box
				sx={{
					display: "flex",
					minHeight: "100vh",
					bgcolor: "background.default",
				}}
			>
				<TopBar
				isMobile={isMobile}
				onMenuClick={() => setMobileOpen(true)}
				drawerWidth={reservedDesktopWidth}
				worlds={worlds}
				worldId={worldId}
				onWorldChange={handleWorldChange}
			/>

			<Box
				component="nav"
				sx={{
					width: { md: reservedDesktopWidth },
					flexShrink: { md: 0 },
				}}
				aria-label="Sidebar navigation"
				onMouseEnter={() => !isMobile && setSidebarExpanded(true)}
				onMouseLeave={() => !isMobile && setSidebarExpanded(false)}
				onFocusCapture={() => !isMobile && setSidebarExpanded(true)}
				onBlurCapture={(e) => {
					if (isMobile) return;
					const next = e.relatedTarget as Node | null;
					if (next && e.currentTarget.contains(next)) return;
					setSidebarExpanded(false);
				}}
			>
				<Drawer
					{...drawerProps}
					sx={{
						width: { md: reservedDesktopWidth },
						flexShrink: { md: 0 },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
						},
					}}
					PaperProps={{
						sx: {
							width: paperWidth,
							borderRightColor: "divider",
							overflowX: "hidden",
							transition: theme.transitions.create("width", {
								duration: theme.transitions.duration.shortest,
							}),
							...(isMobile
								? null
								: {
										position: "fixed",
										left: 0,
										top: 0,
										height: "100vh",
										zIndex: theme.zIndex.appBar + 1,
									}),
						},
					}}
				>
					<Toolbar />
					<SidebarNav
						collapsed={!isMobile && !sidebarExpanded}
						onNavigate={() => setMobileOpen(false)}
					/>
				</Drawer>
			</Box>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: { md: `calc(100% - ${reservedDesktopWidth}px)` },
				}}
			>
				<Toolbar />
				<PageContainer>
					<Outlet />
				</PageContainer>
			</Box>

			{isMobile && (
				<Fab
					color="secondary"
					aria-label="Quick add"
					disabled
					sx={{ position: "fixed", right: 20, bottom: 20 }}
				>
					<AddRoundedIcon />
				</Fab>
			)}
			</Box>
		</WorldProvider>
	);
}

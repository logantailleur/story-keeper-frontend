import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Drawer, Fab, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { WorldProvider } from "../../contexts/WorldContext";
import { PageContainer } from "./PageContainer";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

const DRAWER_WIDTH_EXPANDED = 280;
const DRAWER_WIDTH_COLLAPSED = 76;
const WORLD_ID_STORAGE_KEY = "story-keeper-world-id";

export function AppLayout() {
	const theme = useTheme();
	const location = useLocation();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const isDashboard = location.pathname === "/dashboard";

	const [mobileOpen, setMobileOpen] = useState(false);
	const [sidebarExpanded, setSidebarExpanded] = useState(false);
	const [worldId, setWorldId] = useState<string>(() => {
		if (typeof window === "undefined") return "";
		return String(
			localStorage.getItem(WORLD_ID_STORAGE_KEY) ?? "",
		);
	});

	// Clear world selection only when navigating TO dashboard (e.g. from sidebar),
	// not when selecting a world from dashboard (which sets worldId then navigates away)
	const prevPathnameRef = useRef(location.pathname);
	useEffect(() => {
		if (
			location.pathname === "/dashboard" &&
			prevPathnameRef.current !== "/dashboard"
		) {
			setWorldId("");
			localStorage.removeItem(WORLD_ID_STORAGE_KEY);
		}
		prevPathnameRef.current = location.pathname;
	}, [location.pathname]);

	const handleWorldChange = (id: string) => {
		const next = String(id);
		setWorldId(next);
		localStorage.setItem(WORLD_ID_STORAGE_KEY, next);
	};

	const showSidebar = !isDashboard;
	const reservedDesktopWidth = showSidebar ? DRAWER_WIDTH_COLLAPSED : 0;
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
			/>

			{showSidebar && (
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
			)}

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: { md: `calc(100% - ${reservedDesktopWidth}px)` },
				}}
			>
				<Toolbar />
				<PageContainer fullWidth={location.pathname === "/timeline"}>
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

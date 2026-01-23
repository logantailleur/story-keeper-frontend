import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import {
	Box,
	Divider,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tooltip,
} from "@mui/material";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type NavItem = {
	label: string;
	to: string;
	icon: ReactNode;
	pinnedBottom?: boolean;
};

const navItems: NavItem[] = [
	{ label: "Dashboard", to: "/dashboard", icon: <DashboardRoundedIcon /> },
	{ label: "Timeline", to: "/timeline", icon: <TimelineRoundedIcon /> },
	{ label: "Events", to: "/events", icon: <EventNoteRoundedIcon /> },
	{ label: "Figures", to: "/figures", icon: <PeopleAltRoundedIcon /> },
	{ label: "Nations", to: "/nations", icon: <PublicRoundedIcon /> },
	{
		label: "Settings",
		to: "/settings",
		icon: <SettingsRoundedIcon />,
		pinnedBottom: true,
	},
];

export function SidebarNav({
	collapsed = false,
	onNavigate,
}: {
	collapsed?: boolean;
	onNavigate?: () => void;
}) {
	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				px: 1,
				py: 1.5,
				bgcolor: "background.paper",
			}}
		>
			<List sx={{ py: 0 }}>
				{navItems
					.filter((i) => !i.pinnedBottom)
					.map((item) => {
						const button = (
							<ListItemButton
								component={NavLink}
								to={item.to}
								onClick={onNavigate}
								sx={{
									borderRadius: 2,
									mb: 0.5,
									minHeight: 44,
									px: collapsed ? 1 : 1.5,
									justifyContent: collapsed
										? "center"
										: "flex-start",
									'&[aria-current="page"]': {
										bgcolor: "action.selected",
									},
									"&:hover": {
										bgcolor: "action.hover",
									},
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: collapsed ? 0 : 40,
										justifyContent: "center",
									}}
								>
									{item.icon}
								</ListItemIcon>
								{!collapsed && (
									<ListItemText primary={item.label} />
								)}
							</ListItemButton>
						);

						return collapsed ? (
							<Tooltip
								key={item.to}
								title={item.label}
								placement="right"
								disableFocusListener
								disableTouchListener
								enterDelay={150}
								leaveDelay={0}
							>
								{button}
							</Tooltip>
						) : (
							<ListItemButton
								key={item.to}
								component={NavLink}
								to={item.to}
								onClick={onNavigate}
								sx={{
									borderRadius: 2,
									mb: 0.5,
									minHeight: 44,
									px: 1.5,
									'&[aria-current="page"]': {
										bgcolor: "action.selected",
									},
									"&:hover": {
										bgcolor: "action.hover",
									},
								}}
							>
								<ListItemIcon sx={{ minWidth: 40 }}>
									{item.icon}
								</ListItemIcon>
								<ListItemText primary={item.label} />
							</ListItemButton>
						);
					})}
			</List>

			<Box sx={{ mt: "auto" }}>
				<Divider sx={{ my: 1 }} />
				{navItems
					.filter((i) => i.pinnedBottom)
					.map((item) => {
						const button = (
							<ListItemButton
								component={NavLink}
								to={item.to}
								onClick={onNavigate}
								sx={{
									borderRadius: 2,
									minHeight: 44,
									px: collapsed ? 1 : 1.5,
									justifyContent: collapsed
										? "center"
										: "flex-start",
									'&[aria-current="page"]': {
										bgcolor: "action.selected",
									},
									"&:hover": {
										bgcolor: "action.hover",
									},
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: collapsed ? 0 : 40,
										justifyContent: "center",
									}}
								>
									{item.icon}
								</ListItemIcon>
								{!collapsed && (
									<ListItemText primary={item.label} />
								)}
							</ListItemButton>
						);

						return collapsed ? (
							<Tooltip
								key={item.to}
								title={item.label}
								placement="right"
								disableFocusListener
								disableTouchListener
								enterDelay={150}
								leaveDelay={0}
							>
								{button}
							</Tooltip>
						) : (
							<ListItemButton
								key={item.to}
								component={NavLink}
								to={item.to}
								onClick={onNavigate}
								sx={{
									borderRadius: 2,
									minHeight: 44,
									px: 1.5,
									'&[aria-current="page"]': {
										bgcolor: "action.selected",
									},
									"&:hover": {
										bgcolor: "action.hover",
									},
								}}
							>
								<ListItemIcon sx={{ minWidth: 40 }}>
									{item.icon}
								</ListItemIcon>
								<ListItemText primary={item.label} />
							</ListItemButton>
						);
					})}
			</Box>
		</Box>
	);
}

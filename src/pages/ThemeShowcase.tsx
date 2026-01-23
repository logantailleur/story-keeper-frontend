import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import {
	Alert,
	Avatar,
	Badge,
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Checkbox,
	Chip,
	CircularProgress,
	Divider,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	IconButton,
	InputLabel,
	LinearProgress,
	Link,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Pagination,
	Paper,
	Radio,
	RadioGroup,
	Select,
	Snackbar,
	Stack,
	Switch,
	Tab,
	Tabs,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<Stack spacing={2}>
			<Stack spacing={0.5}>
				<Typography variant="h2" component="h2">
					{title}
				</Typography>
				{description ? (
					<Typography variant="body2" color="text.secondary">
						{description}
					</Typography>
				) : null}
			</Stack>
			<Divider />
			{children}
		</Stack>
	);
}

function LabeledDivider({ label }: { label: string }) {
	return (
		<Divider textAlign="left">
			<Typography variant="overline" color="text.secondary">
				{label}
			</Typography>
		</Divider>
	);
}

export default function ThemeShowcase() {
	const [tab, setTab] = useState(0);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [role, setRole] = useState("editor");

	const breadcrumbs = useMemo(
		() => [
			{ label: "Library", href: "#" },
			{ label: "The Archivist’s Notes", href: "#" },
			{ label: "Theme Showcase" },
		],
		[]
	);

	return (
		<Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
			<PageContainer>
				<Stack spacing={1}>
					<Typography variant="h1" component="h1">
						Theme Showcase
					</Typography>
					<Typography variant="body1" color="text.secondary">
						A development-only page for visually verifying
						typography, color, spacing, elevation, and component
						styling.
					</Typography>
				</Stack>

				<Section
					title="Typography"
					description="Headings, body copy, secondary text, and captions."
				>
					<Stack spacing={2}>
						<LabeledDivider label="Headings" />
						<Typography variant="h1" component="h1">
							The Lantern in the Library
						</Typography>
						<Typography variant="h2" component="h2">
							Chapter Two: Margins and Moonlight
						</Typography>
						<Typography variant="h3" component="h3">
							A note on readability
						</Typography>

						<LabeledDivider label="Body & supporting text" />
						<Typography variant="body1">
							This paragraph is meant to feel like real app text:
							instructions, story metadata, and UI copy that
							should be comfortable to read on a parchment-like
							background. Pay attention to line-height, contrast,
							and how headings sit above body text.
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Secondary text is used for hints, metadata,
							timestamps, and explanatory copy that shouldn’t
							compete with primary content.
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Caption example: Last saved 2 minutes ago · Draft ·
							1,240 words
						</Typography>
					</Stack>
				</Section>

				<Section
					title="Buttons"
					description="Primary, secondary, text, disabled, and icon buttons."
				>
					<Stack spacing={2}>
						<LabeledDivider label="Variants" />
						<Stack
							direction="row"
							spacing={2}
							flexWrap="wrap"
							useFlexGap
						>
							<Button variant="contained" color="primary">
								Create chapter
							</Button>
							<Button variant="outlined" color="secondary">
								Invite collaborator
							</Button>
							<Button variant="text" color="primary">
								View change log
							</Button>
							<Button variant="contained" disabled>
								Saving…
							</Button>
						</Stack>

						<LabeledDivider label="Icon buttons" />
						<Stack
							direction="row"
							spacing={2}
							flexWrap="wrap"
							useFlexGap
						>
							<Tooltip title="Search the library">
								<IconButton aria-label="Search">
									<SearchRoundedIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title="Settings">
								<IconButton aria-label="Settings">
									<SettingsRoundedIcon />
								</IconButton>
							</Tooltip>
						</Stack>
					</Stack>
				</Section>

				<Section
					title="Inputs"
					description="Text fields, select, checkbox, switch, and radio group."
				>
					<Stack spacing={2}>
						<LabeledDivider label="Text inputs" />

						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									label="Story title (default)"
									placeholder="e.g., The Mapmaker’s Promise"
									helperText="Shown on the story’s cover and in navigation."
									fullWidth
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									label="Author pen name (outlined)"
									placeholder="e.g., L. Wren"
									helperText="Optional — you can change this later."
									variant="outlined"
									fullWidth
								/>
							</Grid>
							<Grid size={12}>
								<TextField
									label="Scene notes (multiline)"
									placeholder="Write freely… a scene, a rumor, a secret, a map annotation."
									helperText="This is the most important comfort test: contrast, focus ring, and line-height."
									multiline
									minRows={6}
									fullWidth
								/>
							</Grid>
						</Grid>

						<LabeledDivider label="Select & toggles" />
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6 }}>
								<FormControl fullWidth>
									<InputLabel id="role-label">
										Role
									</InputLabel>
									<Select
										labelId="role-label"
										label="Role"
										value={role}
										onChange={(e) =>
											setRole(String(e.target.value))
										}
									>
										<MenuItem value="owner">Owner</MenuItem>
										<MenuItem value="editor">
											Editor
										</MenuItem>
										<MenuItem value="viewer">
											Viewer
										</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							<Grid size={{ xs: 12, md: 6 }}>
								<Stack spacing={1}>
									<FormControlLabel
										control={<Checkbox defaultChecked />}
										label="Enable autosave"
									/>
									<FormControlLabel
										control={<Switch defaultChecked />}
										label="Use dark mode"
									/>
								</Stack>
							</Grid>
						</Grid>

						<LabeledDivider label="Radio group" />
						<Grid container spacing={2}>
							<Grid size={12}>
								<FormControl>
									<FormLabel id="visibility-label">
										Visibility
									</FormLabel>
									<RadioGroup
										aria-labelledby="visibility-label"
										defaultValue="private"
										name="visibility"
										row
									>
										<FormControlLabel
											value="private"
											control={<Radio />}
											label="Private"
										/>
										<FormControlLabel
											value="shared"
											control={<Radio />}
											label="Shared link"
										/>
										<FormControlLabel
											value="public"
											control={<Radio />}
											label="Public"
										/>
									</RadioGroup>
								</FormControl>
							</Grid>
						</Grid>
					</Stack>
				</Section>

				<Section
					title="Cards"
					description="Basic card, titled card, and card with actions."
				>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 4 }}>
							<Card>
								<CardContent>
									<Typography
										variant="h3"
										component="h3"
										gutterBottom
									>
										Quick note
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										This card is useful for small callouts,
										summaries, or “next steps” guidance.
									</Typography>
								</CardContent>
							</Card>
						</Grid>

						<Grid size={{ xs: 12, md: 4 }}>
							<Card>
								<CardHeader
									avatar={
										<Avatar aria-label="Story">S</Avatar>
									}
									title="Draft: The Clocktower Letters"
									subheader="Updated today · 3 collaborators"
								/>
								<CardContent>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										A short excerpt should remain readable,
										with comfortable spacing between header,
										content, and actions.
									</Typography>
								</CardContent>
							</Card>
						</Grid>

						<Grid size={{ xs: 12, md: 4 }}>
							<Card>
								<CardHeader
									title="Chapter checklist"
									subheader="Before you publish"
								/>
								<CardContent>
									<List dense>
										<ListItem disableGutters>
											<ListItemIcon>
												<CheckCircleRoundedIcon fontSize="small" />
											</ListItemIcon>
											<ListItemText primary="Proofread dialogue" />
										</ListItem>
										<ListItem disableGutters>
											<ListItemIcon>
												<CheckCircleRoundedIcon fontSize="small" />
											</ListItemIcon>
											<ListItemText primary="Confirm character names" />
										</ListItem>
										<ListItem disableGutters>
											<ListItemIcon>
												<InfoOutlinedIcon fontSize="small" />
											</ListItemIcon>
											<ListItemText primary="Add a short chapter summary" />
										</ListItem>
									</List>
								</CardContent>
								<CardActions>
									<Button size="small" variant="text">
										View notes
									</Button>
									<Button size="small" variant="contained">
										Publish
									</Button>
								</CardActions>
							</Card>
						</Grid>
					</Grid>
				</Section>

				<Section
					title="Lists"
					description="Simple list, list with icons, and a dense list."
				>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 4 }}>
							<Typography
								variant="h3"
								component="h3"
								gutterBottom
							>
								Simple list
							</Typography>
							<List>
								<ListItem>
									<ListItemText
										primary="Chapter 1: The Door That Wouldn’t Open"
										secondary="1,420 words · Draft"
									/>
								</ListItem>
								<ListItem>
									<ListItemText
										primary="Chapter 2: Ink on the Wind"
										secondary="1,105 words · Revised"
									/>
								</ListItem>
								<ListItem>
									<ListItemText
										primary="Chapter 3: A Key Made of Glass"
										secondary="980 words · Notes"
									/>
								</ListItem>
							</List>
						</Grid>

						<Grid size={{ xs: 12, md: 4 }}>
							<Typography
								variant="h3"
								component="h3"
								gutterBottom
							>
								With icons
							</Typography>
							<List>
								<ListItem>
									<ListItemIcon>
										<MenuBookRoundedIcon />
									</ListItemIcon>
									<ListItemText
										primary="Manuscripts"
										secondary="Stories and chapters"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<NotificationsRoundedIcon />
									</ListItemIcon>
									<ListItemText
										primary="Activity"
										secondary="Edits, comments, invitations"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<SettingsRoundedIcon />
									</ListItemIcon>
									<ListItemText
										primary="Preferences"
										secondary="Theme, fonts, and shortcuts"
									/>
								</ListItem>
							</List>
						</Grid>

						<Grid size={{ xs: 12, md: 4 }}>
							<Typography
								variant="h3"
								component="h3"
								gutterBottom
							>
								Dense list
							</Typography>
							<List dense>
								<ListItem>
									<ListItemText primary="Scene: Riverside market" />
								</ListItem>
								<ListItem>
									<ListItemText primary="Scene: Lantern festival" />
								</ListItem>
								<ListItem>
									<ListItemText primary="Scene: Clocktower stairs" />
								</ListItem>
								<ListItem>
									<ListItemText primary="Scene: Archive basement" />
								</ListItem>
							</List>
						</Grid>
					</Grid>
				</Section>

				<Section
					title="Navigation"
					description="Tabs, breadcrumbs, and pagination."
				>
					<Stack spacing={2}>
						<LabeledDivider label="Breadcrumbs" />
						<Breadcrumbs aria-label="breadcrumb">
							{breadcrumbs.slice(0, 2).map((b) => (
								<Link key={b.label} href={b.href}>
									{b.label}
								</Link>
							))}
							<Typography color="text.primary">
								{breadcrumbs[2]?.label}
							</Typography>
						</Breadcrumbs>

						<LabeledDivider label="Tabs" />
						<Tabs
							value={tab}
							onChange={(_, next) => setTab(Number(next))}
						>
							<Tab label="Overview" />
							<Tab label="Chapters" />
							<Tab label="Notes" />
						</Tabs>

						<LabeledDivider label="Pagination" />
						<Pagination count={12} page={4} />
					</Stack>
				</Section>

				<Section
					title="Feedback"
					description="Alerts, snackbar trigger, and progress indicators."
				>
					<Stack spacing={2}>
						<LabeledDivider label="Alerts" />
						<Stack spacing={1}>
							<Alert
								severity="success"
								icon={<CheckCircleRoundedIcon />}
							>
								Autosave is enabled and working.
							</Alert>
							<Alert
								severity="warning"
								icon={<WarningRoundedIcon />}
							>
								This chapter has unresolved comments.
							</Alert>
							<Alert severity="error" icon={<ErrorRoundedIcon />}>
								Couldn’t sync changes. Check your connection and
								try again.
							</Alert>
						</Stack>

						<LabeledDivider label="Progress & snackbar" />
						<Stack
							direction="row"
							spacing={2}
							alignItems="center"
							flexWrap="wrap"
							useFlexGap
						>
							<Button
								variant="contained"
								onClick={() => setSnackbarOpen(true)}
							>
								Show snackbar
							</Button>
							<LinearProgress sx={{ flex: 1, minWidth: 220 }} />
							<CircularProgress size={28} />
						</Stack>

						<Snackbar
							open={snackbarOpen}
							autoHideDuration={3000}
							onClose={() => setSnackbarOpen(false)}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "center",
							}}
						>
							<Alert
								onClose={() => setSnackbarOpen(false)}
								severity="info"
								variant="filled"
								sx={{ width: "100%" }}
							>
								Theme Showcase snackbar: this is what transient
								feedback feels like.
							</Alert>
						</Snackbar>
					</Stack>
				</Section>

				<Section
					title="Data display"
					description="Chip, avatar, badge, and tooltip."
				>
					<Stack spacing={2}>
						<LabeledDivider label="Chips, avatar, badge, tooltip" />
						<Stack
							direction="row"
							spacing={1.5}
							alignItems="center"
							flexWrap="wrap"
							useFlexGap
						>
							<Chip label="Draft" />
							<Chip label="Needs review" variant="outlined" />
							<Chip label="Pinned" color="secondary" />
							<Avatar>LW</Avatar>
							<Badge badgeContent={7} color="primary">
								<NotificationsRoundedIcon />
							</Badge>
							<Tooltip title="Hover to check tooltip styling">
								<Button variant="text">Tooltip target</Button>
							</Tooltip>
						</Stack>
					</Stack>
				</Section>

				<Section
					title="Layout"
					description="Box, Stack, Divider, and Grid spacing/elevation checks."
				>
					<Stack spacing={2}>
						<LabeledDivider label="Surface on background" />
						<Paper elevation={1} sx={{ p: 2 }}>
							<Typography
								variant="h3"
								component="h3"
								gutterBottom
							>
								Elevation & readability
							</Typography>
							<Typography variant="body2" color="text.secondary">
								This paper block helps check how surfaces sit on
								the background, and whether text remains crisp
								and readable.
							</Typography>
						</Paper>

						<LabeledDivider label="Elevation scale" />

						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 6, md: 3 }}>
								<Paper elevation={0} sx={{ p: 2 }}>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Elevation 0
									</Typography>
									<Typography variant="body1">
										Flat surface
									</Typography>
								</Paper>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, md: 3 }}>
								<Paper elevation={1} sx={{ p: 2 }}>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Elevation 1
									</Typography>
									<Typography variant="body1">
										Subtle lift
									</Typography>
								</Paper>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, md: 3 }}>
								<Paper elevation={3} sx={{ p: 2 }}>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Elevation 3
									</Typography>
									<Typography variant="body1">
										Standard card
									</Typography>
								</Paper>
							</Grid>
							<Grid size={{ xs: 12, sm: 6, md: 3 }}>
								<Paper elevation={8} sx={{ p: 2 }}>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Elevation 8
									</Typography>
									<Typography variant="body1">
										High emphasis
									</Typography>
								</Paper>
							</Grid>
						</Grid>
					</Stack>
				</Section>
			</PageContainer>
		</Box>
	);
}

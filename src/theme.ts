import { alpha, createTheme } from "@mui/material/styles";

const tavern = {
	primaryLight: "#8B5A2B",
	primaryDark: "#D79A5A",
	secondaryLight: "#7B2D26",
	secondaryDark: "#F29B8E",
	bgDefaultLight: "#F5EADB",
	bgPaperLight: "#FBF4EA",
	bgDefaultDark: "#14100C",
	bgPaperDark: "#1B1611",
	textPrimaryLight: "#2B1F17",
	textSecondaryLight: "#5D4637",
	textPrimaryDark: "#F1E7DD",
	textSecondaryDark: "#CDBFB2",
	infoLight: "#2E6F7E",
	infoDark: "#7DC3D6",
	warningLight: "#B05E1C",
	warningDark: "#E0A15B",
	errorLight: "#B0342B",
	errorDark: "#F3A099",
	successLight: "#2F7D4F",
	successDark: "#5FBF86",
	gradientsLight: [
		"radial-gradient(1100px circle at 18% -10%, rgba(215,154,90,0.22), transparent 60%)",
		"radial-gradient(900px circle at 86% 12%, rgba(123,45,38,0.12), transparent 55%)",
		"linear-gradient(180deg, rgba(255,255,255,0.50), rgba(255,255,255,0))",
	],
	gradientsDark: [
		"radial-gradient(1100px circle at 18% -10%, rgba(215,154,90,0.14), transparent 62%)",
		"radial-gradient(900px circle at 86% 12%, rgba(123,45,38,0.12), transparent 58%)",
	],
	selectionLight: "rgba(215,154,90,0.24)",
	selectionDark: "rgba(215,154,90,0.26)",
	focusRingLight: "rgba(215,154,90,0.22)",
	focusRingDark: "rgba(215,154,90,0.22)",
} as const;

export const theme = createTheme({
	cssVariables: {
		colorSchemeSelector: "class",
	},
	colorSchemes: {
		light: {
			palette: {
				primary: {
					main: tavern.primaryLight,
					contrastText: "#FFFFFF",
				},
				secondary: {
					main: tavern.secondaryLight,
					// Filled components (e.g. Chip color="secondary") should be readable
					contrastText: "#FFF7F0",
				},
				success: { main: tavern.successLight },
				info: { main: tavern.infoLight },
				warning: { main: tavern.warningLight },
				error: { main: tavern.errorLight },
				background: {
					default: tavern.bgDefaultLight,
					paper: tavern.bgPaperLight,
				},
				text: {
					primary: tavern.textPrimaryLight,
					secondary: tavern.textSecondaryLight,
					disabled: "rgba(35,49,59,0.45)",
				},
				divider: "rgba(35,49,59,0.12)",
				action: {
					hover: alpha(tavern.textPrimaryLight, 0.04),
					selected: alpha(tavern.primaryLight, 0.12),
					focus: alpha(tavern.primaryLight, 0.18),
				},
			},
		},
		dark: {
			palette: {
				primary: {
					main: tavern.primaryDark,
					contrastText: "#08120D",
				},
				secondary: {
					main: tavern.secondaryDark,
					// Secondary in dark mode is light; prefer dark text
					contrastText: "#1C120E",
				},
				success: { main: tavern.successDark },
				info: { main: tavern.infoDark },
				warning: { main: tavern.warningDark },
				error: { main: tavern.errorDark },
				background: {
					default: tavern.bgDefaultDark,
					paper: tavern.bgPaperDark,
				},
				text: {
					primary: tavern.textPrimaryDark,
					secondary: tavern.textSecondaryDark,
					disabled: "rgba(232,238,233,0.42)",
				},
				divider: "rgba(232,238,233,0.12)",
				action: {
					hover: alpha(tavern.textPrimaryDark, 0.06),
					selected: alpha(tavern.primaryDark, 0.22),
					focus: alpha(tavern.primaryDark, 0.28),
				},
			},
		},
	},
	typography: {
		fontFamily: "Inter, system-ui, sans-serif",
		h1: {
			fontFamily: "Merriweather, serif",
			fontWeight: 700,
			letterSpacing: "-0.015em",
		},
		h2: {
			fontFamily: "Merriweather, serif",
			fontWeight: 700,
			letterSpacing: "-0.01em",
		},
		h3: {
			fontFamily: "Merriweather, serif",
			fontWeight: 700,
			letterSpacing: "-0.005em",
		},
		body1: {
			fontSize: 16,
			lineHeight: 1.65,
		},
		body2: {
			fontSize: 14.5,
			lineHeight: 1.6,
		},
		button: {
			textTransform: "none",
			letterSpacing: "0.01em",
		},
	},
	shape: {
		borderRadius: 12,
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: (themeParam) => ({
				body: {
					backgroundColor:
						themeParam.vars?.palette.background.default ??
						themeParam.palette.background.default,
					backgroundImage:
						themeParam.palette.mode === "dark"
							? tavern.gradientsDark.join(",")
							: tavern.gradientsLight.join(","),
					backgroundAttachment: "fixed",
					color:
						themeParam.vars?.palette.text.primary ??
						themeParam.palette.text.primary,
					textRendering: "optimizeLegibility",
					WebkitFontSmoothing: "antialiased",
				},
				a: {
					color:
						themeParam.vars?.palette.primary.main ??
						themeParam.palette.primary.main,
					textDecoration: "none",
				},
				"a:hover": {
					textDecoration: "underline",
				},
				"::selection": {
					backgroundColor:
						themeParam.palette.mode === "dark"
							? tavern.selectionDark
							: tavern.selectionLight,
				},
				// Keep a clear focus outline for interactive controls, but avoid
				// making text inputs look like they're in an "error" state.
				":where(a, button, [role='button'], [role='link']):focus-visible": {
					outline: `2px solid ${
						themeParam.vars?.palette.primary.main ??
						themeParam.palette.primary.main
					}`,
					outlineOffset: 2,
					borderRadius: 8,
				},
			}),
		},
		MuiCard: {
			styleOverrides: {
				root: ({ theme: t }) => ({
					borderRadius: 14,
					backgroundColor:
						t.vars?.palette.background.paper ??
						"var(--mui-palette-background-paper)",
					border: `1px solid ${
						t.vars?.palette.divider ?? "var(--mui-palette-divider)"
					}`,
					boxShadow:
						t.palette.mode === "dark"
							? "0px 10px 26px rgba(0,0,0,0.35)"
							: "0px 4px 12px rgba(0,0,0,0.08)",
				}),
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: ({ theme: t }) => ({
					border: `1px solid ${
						t.vars?.palette.divider ?? "var(--mui-palette-divider)"
					}`,
				}),
			},
		},
		MuiButton: {
			styleOverrides: {
				root: ({ theme: t }) => ({
					borderRadius: 10,
					fontWeight: 600,
					boxShadow: "none",
					transition: t.transitions.create(
						["background-color", "border-color", "color"],
						{ duration: t.transitions.duration.short }
					),
				}),
				containedPrimary: ({ theme: t }) => ({
					backgroundColor: t.palette.primary.main,
					color: t.palette.primary.contrastText,
					"&:hover": {
						backgroundColor: t.palette.primary.dark,
						boxShadow: "0px 3px 8px rgba(0,0,0,0.15)",
					},
				}),
				outlinedSecondary: ({ theme: t }) => ({
					borderColor:
						t.vars?.palette.secondary.main ??
						t.palette.secondary.main,
					color:
						t.vars?.palette.secondary.main ??
						t.palette.secondary.main,
					"&:hover": {
						borderColor:
							t.vars?.palette.secondary.main ??
							t.palette.secondary.main,
						backgroundColor:
							t.palette.mode === "dark"
								? "rgba(140,122,46,0.12)"
								: "rgba(140,122,46,0.10)",
					},
				}),
			},
			defaultProps: {
				disableElevation: true,
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: ({ theme: t }) => ({
					// Inputs should feel like "paper" surfaces (lighter than background)
					backgroundColor:
						t.vars?.palette.background.paper ??
						"var(--mui-palette-background-paper)",
					backgroundImage: `linear-gradient(${
						t.palette.mode === "dark"
							? alpha("#fff", 0.02)
							: alpha("#fff", 0.18)
					}, ${
						t.palette.mode === "dark"
							? alpha("#fff", 0.02)
							: alpha("#fff", 0.18)
					})`,
					transition: t.transitions.create(
						["background-color", "background-image", "box-shadow", "border-color"],
						{ duration: t.transitions.duration.short }
					),
					"&:hover": {
						backgroundImage: `linear-gradient(${
							t.palette.mode === "dark"
								? alpha("#fff", 0.04)
								: alpha("#fff", 0.28)
						}, ${
							t.palette.mode === "dark"
								? alpha("#fff", 0.04)
								: alpha("#fff", 0.28)
						})`,
					},
					"&.Mui-focused": {
						boxShadow:
							t.palette.mode === "dark"
								? `0 0 0 2px ${alpha(tavern.primaryDark, 0.22)}`
								: `0 0 0 2px ${alpha(tavern.primaryLight, 0.22)}`,
						backgroundImage: `linear-gradient(${
							t.palette.mode === "dark"
								? alpha("#fff", 0.04)
								: alpha("#fff", 0.28)
						}, ${
							t.palette.mode === "dark"
								? alpha("#fff", 0.04)
								: alpha("#fff", 0.28)
						})`,
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor:
							t.palette.mode === "dark"
								? alpha(tavern.primaryDark, 0.55)
								: alpha(tavern.primaryLight, 0.55),
						borderWidth: 1,
					},
				}),
				notchedOutline: ({ theme: t }) => ({
					borderColor: t.vars?.palette.divider ?? t.palette.divider,
				}),
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: ({ theme: t }) => ({
					"&::placeholder": {
						// Make placeholders readable on "paper" inputs in dark mode.
						color:
							t.palette.mode === "dark"
								? "color-mix(in srgb, var(--mui-palette-text-secondary) 78%, transparent)"
								: "color-mix(in srgb, var(--mui-palette-text-secondary) 70%, transparent)",
						opacity: 1,
					},
				}),
				inputMultiline: () => ({
					"&::placeholder": {
						color:
							"color-mix(in srgb, var(--mui-palette-text-secondary) 78%, transparent)",
						opacity: 1,
					},
				}),
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: ({ theme: t }) => ({
					borderRadius: 14,
					border: `1px solid ${
						t.vars?.palette.divider ?? "var(--mui-palette-divider)"
					}`,
				}),
				standardSuccess: ({ theme: t }) => ({
					backgroundColor:
						"color-mix(in srgb, var(--mui-palette-success-main) 14%, transparent)",
					borderColor:
						"color-mix(in srgb, var(--mui-palette-success-main) 32%, var(--mui-palette-divider))",
					borderLeft: "4px solid var(--mui-palette-success-main)",
					color:
						t.vars?.palette.text.primary ?? "var(--mui-palette-text-primary)",
					"& .MuiAlert-icon": { color: "var(--mui-palette-success-main)" },
				}),
				standardWarning: ({ theme: t }) => ({
					backgroundColor:
						"color-mix(in srgb, var(--mui-palette-warning-main) 14%, transparent)",
					borderColor:
						"color-mix(in srgb, var(--mui-palette-warning-main) 32%, var(--mui-palette-divider))",
					borderLeft: "4px solid var(--mui-palette-warning-main)",
					color:
						t.vars?.palette.text.primary ?? "var(--mui-palette-text-primary)",
					"& .MuiAlert-icon": { color: "var(--mui-palette-warning-main)" },
				}),
				standardError: ({ theme: t }) => ({
					backgroundColor:
						"color-mix(in srgb, var(--mui-palette-error-main) 14%, transparent)",
					borderColor:
						"color-mix(in srgb, var(--mui-palette-error-main) 32%, var(--mui-palette-divider))",
					borderLeft: "4px solid var(--mui-palette-error-main)",
					color:
						t.vars?.palette.text.primary ?? "var(--mui-palette-text-primary)",
					"& .MuiAlert-icon": { color: "var(--mui-palette-error-main)" },
				}),
				standardInfo: ({ theme: t }) => ({
					backgroundColor:
						"color-mix(in srgb, var(--mui-palette-info-main) 14%, transparent)",
					borderColor:
						"color-mix(in srgb, var(--mui-palette-info-main) 32%, var(--mui-palette-divider))",
					borderLeft: "4px solid var(--mui-palette-info-main)",
					color:
						t.vars?.palette.text.primary ?? "var(--mui-palette-text-primary)",
					"& .MuiAlert-icon": { color: "var(--mui-palette-info-main)" },
				}),
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: ({ theme: t }) => ({
					color: t.vars?.palette.text.secondary ?? t.palette.text.secondary,
					"&.Mui-focused": {
						color: t.vars?.palette.primary.main ?? t.palette.primary.main,
					},
				}),
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: ({ theme: t }) => ({
					marginLeft: 0,
					marginRight: 0,
					color: t.vars?.palette.text.secondary ?? t.palette.text.secondary,
				}),
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: ({ theme: t }) => ({
					borderColor: t.vars?.palette.divider ?? t.palette.divider,
				}),
			},
		},
	},
});

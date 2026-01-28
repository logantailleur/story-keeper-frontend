import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/merriweather/400.css";
import "@fontsource/merriweather/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";
import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline enableColorScheme />
					<App />
				</ThemeProvider>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>,
);

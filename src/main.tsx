import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ProviderContextProvider } from "./contexts/ProviderContext.tsx";
import "./index.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/merriweather/400.css";
import "@fontsource/merriweather/700.css";
import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<ProviderContextProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline enableColorScheme />
					<App />
				</ThemeProvider>
			</ProviderContextProvider>
		</BrowserRouter>
	</React.StrictMode>
);

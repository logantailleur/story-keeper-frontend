import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Health from "./pages/Health";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ThemeShowcase from "./pages/ThemeShowcase";

function App() {
	return (
		<Routes>
			<Route path="/health" element={<Health />} />
			<Route path="/login" element={<Login />} />
			<Route path="/theme-showcase" element={<ThemeShowcase />} />

			<Route element={<AppLayout />}>
				<Route
					path="/"
					element={<Navigate to="/dashboard" replace />}
				/>
				<Route path="/dashboard" element={<Home />} />
			</Route>
		</Routes>
	);
}

export default App;

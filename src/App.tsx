import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Health from "./pages/Health";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ThemeShowcase from "./pages/ThemeShowcase";
import Timeline from "./pages/Timeline";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			<Route element={<ProtectedRoute />}>
				<Route path="/health" element={<Health />} />
				<Route path="/theme-showcase" element={<ThemeShowcase />} />

				<Route element={<AppLayout />}>
					<Route
						path="/"
						element={<Navigate to="/dashboard" replace />}
					/>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/timeline" element={<Timeline />} />
					<Route path="/events" element={<Events />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;

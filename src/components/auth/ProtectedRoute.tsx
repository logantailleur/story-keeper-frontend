import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Route guard: blocks access when logged out.
 *
 * Usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 */
export function ProtectedRoute() {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: location.pathname + location.search }}
			/>
		);
	}

	return <Outlet />;
}

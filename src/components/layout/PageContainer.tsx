import { Box } from "@mui/material";
import type { PropsWithChildren } from "react";

interface PageContainerProps extends PropsWithChildren {
	fullWidth?: boolean;
}

export function PageContainer({ children, fullWidth = false }: PageContainerProps) {
	return (
		<Box
			sx={{
				width: "100%",
				maxWidth: fullWidth ? "none" : 1200,
				mx: "auto",
				px: { xs: 2, sm: 3, md: 4 },
				py: { xs: 3, sm: 4, md: 5 },
				display: "flex",
				flexDirection: "column",
				gap: 3,
			}}
		>
			{children}
		</Box>
	);
}


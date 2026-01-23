import { Box } from "@mui/material";
import type { PropsWithChildren } from "react";

export function PageContainer({ children }: PropsWithChildren) {
	return (
		<Box
			sx={{
				maxWidth: 1200,
				mx: "auto",
				px: { xs: 2, sm: 3, md: 4 },
				py: { xs: 3, sm: 4, md: 5 },
				display: "flex",
				flexDirection: "column",
				gap: 3,
				width: "100%",
			}}
		>
			{children}
		</Box>
	);
}


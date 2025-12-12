"use client";

import Cookies from "js-cookie";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { useEffect } from "react";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	useEffect(() => {
		// Sincroniza localStorage com cookies
		const theme = Cookies.get("webidelivery-theme") || "system";
		if (typeof window !== "undefined") {
			localStorage.setItem("webidelivery-theme", theme);
		}
	}, []);

	return (
		<NextThemesProvider
			{...props}
			nonce={undefined}
			scriptProps={{
				nonce: undefined,
			}}
		>
			{children}
		</NextThemesProvider>
	);
}

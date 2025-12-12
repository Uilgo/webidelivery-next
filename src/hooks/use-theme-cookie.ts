"use client";

import Cookies from "js-cookie";
import { useTheme as useNextTheme } from "next-themes";
import { useCallback } from "react";

export function useTheme() {
	const { theme, setTheme: setNextTheme, ...rest } = useNextTheme();

	const setTheme = useCallback(
		(newTheme: string) => {
			// Define no cookie
			Cookies.set("webidelivery-theme", newTheme, {
				expires: 365, // 1 ano
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
			});

			// Define no next-themes
			setNextTheme(newTheme);

			// Atualiza o data-theme imediatamente
			document.documentElement.setAttribute("data-theme", newTheme);
		},
		[setNextTheme],
	);

	return {
		theme,
		setTheme,
		...rest,
	};
}

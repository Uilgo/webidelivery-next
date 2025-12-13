"use client";

import Cookies from "js-cookie";
import { useTheme as useNextTheme } from "next-themes";
import { useCallback } from "react";

/**
 * Hook personalizado para gerenciar tema da aplicação
 * Sincroniza tema entre next-themes, cookies e DOM para persistência
 */
export function useTheme() {
	const { theme, setTheme: setNextTheme, ...rest } = useNextTheme();

	// Função otimizada para alterar tema com persistência completa
	const setTheme = useCallback(
		(newTheme: string) => {
			// Salva tema no cookie para persistir entre sessões
			Cookies.set("webidelivery-theme", newTheme, {
				expires: 365, // 1 ano
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
			});

			// Atualiza tema no next-themes
			setNextTheme(newTheme);

			// Aplica tema imediatamente no DOM para evitar flash
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

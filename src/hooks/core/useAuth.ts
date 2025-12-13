"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Hook básico para gerenciar estado de autenticação do usuário
 * DEPRECATED: Use useUser() para funcionalidades completas
 * Mantido para compatibilidade com código existente
 */
export function useSupabaseUser() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		// Busca dados do usuário atual na inicialização
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
			setLoading(false);
		};

		getUser();

		// Escuta mudanças de estado de autenticação (login/logout)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		// Limpa subscription ao desmontar componente
		return () => subscription.unsubscribe();
	}, [supabase.auth]);

	return { user, loading };
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";

/**
 * Provider que inicializa o store do usuário
 * Busca dados do usuário atual e escuta mudanças de autenticação
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
	const initialized = useRef(false);
	const [isClient, setIsClient] = useState(false);

	// Garantir que só executa no cliente
	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		// Só executar no cliente e evitar múltiplas inicializações
		if (!isClient || initialized.current) return;
		initialized.current = true;

		const supabase = createClient();

		// Buscar funções do store apenas quando necessário
		const { initialize, setUser } = useUserStore.getState();

		// Inicializar store na montagem da aplicação
		initialize();

		// Escutar mudanças de estado de autenticação
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			// Atualizar usuário no store quando houver mudanças
			setUser(session?.user ?? null);
		});

		// Cleanup da subscription
		return () => {
			subscription.unsubscribe();
			initialized.current = false;
		};
	}, [isClient]);

	return <>{children}</>;
}

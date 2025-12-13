"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";

/**
 * Hook principal para gerenciar usuário e perfil
 * Integra autenticação do Supabase com store Zustand
 */
export function useUser() {
	const {
		user,
		authLoading,
		perfil,
		perfilLoading,
		perfilError,
		setUser,
		fetchPerfil,
		updatePerfil,
		clearUser,
		isAuthenticated,
		isOnboardingComplete,
		hasEstabelecimento,
		getUserDisplayName,
		getUserRole,
	} = useUserStore();

	const supabase = createClient();

	useEffect(() => {
		/**
		 * Busca usuário inicial ao montar o componente
		 * Necessário para recuperar sessão existente
		 */
		const getInitialUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
		};

		getInitialUser();

		/**
		 * Escuta mudanças de estado de autenticação
		 * Atualiza store automaticamente em login/logout
		 */
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user ?? null);

			// Log para debug (remover em produção)
			console.log("Auth state changed:", event, session?.user?.email);
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth, setUser]);

	/**
	 * Recarrega dados do perfil manualmente
	 * Útil após atualizações ou para forçar refresh
	 */
	const refetchPerfil = async () => {
		await fetchPerfil();
	};

	/**
	 * Faz logout do usuário
	 * Limpa sessão no Supabase e dados do store
	 */
	const logout = async () => {
		await supabase.auth.signOut();
		clearUser();
	};

	return {
		// Estado
		user,
		authLoading,
		perfil,
		perfilLoading,
		perfilError,

		// Ações
		updatePerfil,
		refetchPerfil,
		logout,

		// Getters computados
		isAuthenticated: isAuthenticated(),
		isOnboardingComplete: isOnboardingComplete(),
		hasEstabelecimento: hasEstabelecimento(),
		displayName: getUserDisplayName(),
		userRole: getUserRole(),

		// Estados derivados
		isLoading: authLoading || perfilLoading === "loading",
		hasError: perfilError !== null,

		// Dados do estabelecimento
		estabelecimento: perfil?.estabelecimento || null,
		estabelecimentoId: perfil?.estabelecimento_id || null,
	};
}

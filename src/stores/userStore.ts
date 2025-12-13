"use client";

import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ApiResponse, LoadingState } from "@/shared/types/database";
import type { Perfil, PerfilCompleto } from "@/shared/types/tables/perfis";
import { createClient } from "@/utils/supabase/client";

/**
 * Interface do estado do usuário
 * Gerencia dados de autenticação e perfil do usuário logado
 */
interface UserState {
	// Estado de autenticação
	user: User | null;
	authLoading: boolean;

	// Estado do perfil
	perfil: PerfilCompleto | null;
	perfilLoading: LoadingState;
	perfilError: string | null;

	// Ações
	initialize: () => Promise<void>;
	setUser: (user: User | null) => void;
	fetchPerfil: () => Promise<void>;
	updatePerfil: (data: Partial<Perfil>) => Promise<ApiResponse<Perfil>>;
	clearUser: () => void;

	// Getters computados
	isAuthenticated: () => boolean;
	isOnboardingComplete: () => boolean;
	hasEstabelecimento: () => boolean;
	getUserDisplayName: () => string;
	getUserRole: () => string;
}

/**
 * Store principal do usuário usando Zustand
 * Centraliza estado de autenticação e perfil
 */
export const useUserStore = create<UserState>()(
	devtools(
		persist(
			(set, get) => ({
				// Estado inicial
				user: null,
				authLoading: true,
				perfil: null,
				perfilLoading: "idle",
				perfilError: null,

				// Ações
				/**
				 * Inicializa o store buscando usuário atual do Supabase
				 * Deve ser chamado na inicialização da aplicação
				 */
				initialize: async () => {
					try {
						const supabase = createClient();

						// Primeiro, tentar buscar sessão atual
						const {
							data: { session },
							error: sessionError,
						} = await supabase.auth.getSession();

						if (sessionError) {
							// Se erro de sessão, apenas definir como não autenticado
							console.log("Nenhuma sessão ativa:", sessionError.message);
							set({ authLoading: false, user: null });
							return;
						}

						// Se há sessão, buscar dados do usuário
						if (session?.user) {
							get().setUser(session.user);
						} else {
							// Sem sessão ativa
							set({ authLoading: false, user: null });
						}
					} catch (error) {
						console.error("Erro inesperado na inicialização:", error);
						set({ authLoading: false, user: null });
					}
				},

				/**
				 * Define o usuário autenticado e gerencia estado de loading
				 * Automaticamente busca perfil quando usuário faz login
				 */
				setUser: (user) => {
					set({ user, authLoading: false });

					// Se usuário logou, buscar perfil automaticamente
					if (user) {
						get().fetchPerfil();
					} else {
						// Se deslogou, limpar perfil
						set({ perfil: null, perfilLoading: "idle", perfilError: null });
					}
				},

				/**
				 * Busca dados do perfil do usuário no Supabase
				 * Inclui dados do estabelecimento via join
				 */
				fetchPerfil: async () => {
					const { user } = get();

					if (!user) {
						set({ perfilError: "Usuário não autenticado", perfilLoading: "error" });
						return;
					}

					set({ perfilLoading: "loading", perfilError: null });

					try {
						const supabase = createClient();

						// Buscar perfil com dados do estabelecimento
						const { data: perfil, error } = await supabase
							.from("perfis")
							.select(`
                *,
                estabelecimento:estabelecimentos(*)
              `)
							.eq("id", user.id)
							.single();

						if (error) {
							console.error("Erro ao buscar perfil:", error);
							set({
								perfilError: "Erro ao carregar perfil do usuário",
								perfilLoading: "error",
							});
							return;
						}

						set({
							perfil: perfil as PerfilCompleto,
							perfilLoading: "success",
							perfilError: null,
						});
					} catch (error) {
						console.error("Erro inesperado ao buscar perfil:", error);
						set({
							perfilError: "Erro inesperado ao carregar perfil",
							perfilLoading: "error",
						});
					}
				},

				/**
				 * Atualiza dados do perfil do usuário no Supabase
				 * Retorna resposta padronizada com dados atualizados
				 */
				updatePerfil: async (data) => {
					const { user, perfil } = get();

					if (!user || !perfil) {
						return {
							data: null,
							error: "Usuário não autenticado ou perfil não carregado",
							loading: false,
						};
					}

					set({ perfilLoading: "loading", perfilError: null });

					try {
						const supabase = createClient();

						const { data: updatedPerfil, error } = await supabase
							.from("perfis")
							.update(data)
							.eq("id", user.id)
							.select(`
                *,
                estabelecimento:estabelecimentos(*)
              `)
							.single();

						if (error) {
							console.error("Erro ao atualizar perfil:", error);
							set({
								perfilError: "Erro ao atualizar perfil",
								perfilLoading: "error",
							});
							return {
								data: null,
								error: "Erro ao atualizar perfil",
								loading: false,
							};
						}

						// Atualizar estado local
						set({
							perfil: updatedPerfil as PerfilCompleto,
							perfilLoading: "success",
							perfilError: null,
						});

						return {
							data: updatedPerfil as Perfil,
							error: null,
							loading: false,
						};
					} catch (error) {
						console.error("Erro inesperado ao atualizar perfil:", error);
						const errorMessage = "Erro inesperado ao atualizar perfil";

						set({
							perfilError: errorMessage,
							perfilLoading: "error",
						});

						return {
							data: null,
							error: errorMessage,
							loading: false,
						};
					}
				},

				/**
				 * Limpa todos os dados do usuário do store
				 * Usado no logout para resetar estado
				 */
				clearUser: () => {
					set({
						user: null,
						authLoading: false,
						perfil: null,
						perfilLoading: "idle",
						perfilError: null,
					});
				},

				// Getters computados
				/**
				 * Verifica se usuário está autenticado
				 */
				isAuthenticated: () => {
					return get().user !== null;
				},

				/**
				 * Verifica se usuário completou o onboarding
				 */
				isOnboardingComplete: () => {
					const { perfil } = get();
					return perfil?.onboarding === true;
				},

				/**
				 * Verifica se usuário tem estabelecimento vinculado
				 */
				hasEstabelecimento: () => {
					const { perfil } = get();
					return perfil?.estabelecimento_id !== null && perfil?.estabelecimento !== null;
				},

				/**
				 * Retorna nome completo do usuário para exibição
				 */
				getUserDisplayName: () => {
					const { perfil } = get();
					if (!perfil) return "Usuário";
					return `${perfil.nome} ${perfil.sobrenome}`.trim();
				},

				/**
				 * Retorna cargo/função do usuário
				 */
				getUserRole: () => {
					const { perfil } = get();
					return perfil?.cargo || "usuário";
				},
			}),
			{
				name: "webidelivery-user-store",
				// Persistir apenas dados não sensíveis
				partialize: (state) => ({
					user: state.user
						? {
								id: state.user.id,
								email: state.user.email,
							}
						: null,
				}),
			},
		),
		{
			name: "UserStore",
		},
	),
);

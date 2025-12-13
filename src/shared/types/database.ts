/**
 * Tipos globais do banco de dados Supabase
 * Contém apenas tipos compartilhados entre múltiplas tabelas
 */

// Tipos base do Supabase
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Enums globais do sistema
export type StatusPedido =
	| "pendente"
	| "aceito"
	| "preparo"
	| "pronto"
	| "entrega"
	| "concluido"
	| "cancelado";
export type MetodoPagamento = "dinheiro" | "pix" | "cartao_credito" | "cartao_debito";
export type TipoEntrega = "delivery" | "retirada";

// Estados de loading globais
export type LoadingState = "idle" | "loading" | "success" | "error";

// Tipos para respostas de API padronizadas
export interface ApiResponse<T> {
	data: T | null;
	error: string | null;
	loading: boolean;
}

// Tipos para paginação
export interface PaginationParams {
	page: number;
	limit: number;
	offset?: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	hasMore: boolean;
}

// Tipos para filtros genéricos
export interface BaseFilters {
	search?: string;
	dateFrom?: string;
	dateTo?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

// Tipos para timestamps padrão do Supabase
export interface TimestampFields {
	readonly created_at: string;
	readonly updated_at: string;
}

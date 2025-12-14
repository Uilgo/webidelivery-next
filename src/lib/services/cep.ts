/**
 * Serviço de consulta de CEP com fallback
 * BrasilAPI (principal) + ViaCEP (fallback)
 */

import { isValidCEP, unformatCEP } from "@/lib/formatters/address";

// Tipos para resposta da BrasilAPI
export interface BrasilApiCepResponse {
	cep: string;
	state: string;
	city: string;
	neighborhood: string;
	street: string;
	service: string;
	location: {
		type: string;
		coordinates: {
			longitude: string;
			latitude: string;
		};
	};
}

// Tipos para resposta do ViaCEP
export interface ViaCepResponse {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
	ibge: string;
	gia: string;
	ddd: string;
	siafi: string;
	erro?: boolean;
}

// Tipo unificado para resposta do serviço
export interface CepData {
	cep: string;
	rua: string;
	bairro: string;
	cidade: string;
	estado: string;
	coordinates?: {
		latitude: string;
		longitude: string;
	};
	service: "brasilapi" | "viacep";
}

// Tipo para erro de CEP
export interface CepError {
	message: string;
	code: "INVALID_FORMAT" | "NOT_FOUND" | "NETWORK_ERROR" | "UNKNOWN_ERROR";
}

/**
 * Busca CEP usando BrasilAPI (principal)
 */
async function fetchFromBrasilApi(cep: string): Promise<CepData> {
	const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error("CEP não encontrado");
		}
		if (response.status === 400) {
			throw new Error("CEP inválido");
		}
		throw new Error(`Erro na API: ${response.status}`);
	}

	const data: BrasilApiCepResponse = await response.json();

	return {
		cep: data.cep,
		rua: data.street,
		bairro: data.neighborhood,
		cidade: data.city,
		estado: data.state,
		coordinates: data.location?.coordinates
			? {
					latitude: data.location.coordinates.latitude,
					longitude: data.location.coordinates.longitude,
				}
			: undefined,
		service: "brasilapi",
	};
}

/**
 * Busca CEP usando ViaCEP (fallback)
 */
async function fetchFromViaCep(cep: string): Promise<CepData> {
	const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
		method: "GET",
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Erro na API: ${response.status}`);
	}

	const data: ViaCepResponse = await response.json();

	if (data.erro) {
		throw new Error("CEP não encontrado");
	}

	return {
		cep: data.cep,
		rua: data.logradouro,
		bairro: data.bairro,
		cidade: data.localidade,
		estado: data.uf,
		// ViaCEP não fornece coordenadas
		coordinates: undefined,
		service: "viacep",
	};
}

/**
 * Busca dados do CEP com fallback automático
 *
 * @param cep - CEP a ser consultado (com ou sem formatação)
 * @returns Promise com dados do CEP ou erro
 *
 * @example
 * const result = await fetchCepData("01234-567");
 * if (result.success) {
 *   console.log(result.data.cidade); // "São Paulo"
 * } else {
 *   console.error(result.error.message);
 * }
 */
export async function fetchCepData(
	cep: string,
): Promise<{ success: true; data: CepData } | { success: false; error: CepError }> {
	try {
		// Limpar e validar CEP
		const cleanCep = unformatCEP(cep);

		if (!isValidCEP(cleanCep)) {
			return {
				success: false,
				error: {
					message: "CEP deve ter 8 dígitos e não pode ter todos os números iguais",
					code: "INVALID_FORMAT",
				},
			};
		}

		// Tentar BrasilAPI primeiro
		try {
			const data = await fetchFromBrasilApi(cleanCep);
			return { success: true, data };
		} catch (_brasilApiError) {
			// Fallback para ViaCEP
			try {
				const data = await fetchFromViaCep(cleanCep);
				return { success: true, data };
			} catch (viaCepError) {
				// Determinar tipo de erro
				const errorMessage = String(viaCepError);
				if (errorMessage.includes("não encontrado")) {
					return {
						success: false,
						error: {
							message: "CEP não encontrado",
							code: "NOT_FOUND",
						},
					};
				}

				return {
					success: false,
					error: {
						message: "Erro ao consultar CEP. Tente novamente.",
						code: "NETWORK_ERROR",
					},
				};
			}
		}
	} catch (error) {
		console.error("Erro inesperado ao buscar CEP:", error);
		return {
			success: false,
			error: {
				message: "Erro inesperado. Tente novamente.",
				code: "UNKNOWN_ERROR",
			},
		};
	}
}

/**
 * Verifica se um CEP existe (sem retornar dados completos)
 * Útil para validação rápida
 */
export async function checkCepExists(cep: string): Promise<boolean> {
	const result = await fetchCepData(cep);
	return result.success;
}

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { isValidCEP, unformatCEP } from "@/lib/formatters/address";
import { type CepData, type CepError, fetchCepData } from "@/lib/services/cep";

export interface UseCepLookupReturn {
	// Estados
	isLoading: boolean;
	data: CepData | null;
	error: CepError | null;

	// Ações
	lookupCep: (cep: string) => Promise<void>;
	clearData: () => void;

	// Helpers
	isValidFormat: (cep: string) => boolean;
}

/**
 * Hook para busca manual de CEP
 *
 * @example
 * const { lookupCep, isLoading, data, error } = useCepLookup();
 *
 * // Busca manual
 * await lookupCep("01234-567");
 */
export function useCepLookup(): UseCepLookupReturn {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<CepData | null>(null);
	const [error, setError] = useState<CepError | null>(null);
	const [lastSearchedCep, setLastSearchedCep] = useState<string>("");

	/**
	 * Busca dados do CEP
	 */
	const lookupCep = useCallback(
		async (cep: string) => {
			const cleanCep = unformatCEP(cep);

			// Não buscar se CEP inválido ou já foi buscado
			if (!isValidCEP(cleanCep) || cleanCep === lastSearchedCep) {
				return;
			}

			setIsLoading(true);
			setError(null);
			setLastSearchedCep(cleanCep);

			try {
				const result = await fetchCepData(cleanCep);

				if (result.success) {
					setData(result.data);
					setError(null);
				} else {
					setData(null);
					setError(result.error);
				}
			} catch (err) {
				console.error("Erro no hook useCepLookup:", err);
				setData(null);
				setError({
					message: "Erro inesperado ao buscar CEP",
					code: "UNKNOWN_ERROR",
				});
			} finally {
				setIsLoading(false);
			}
		},
		[lastSearchedCep],
	);

	/**
	 * Limpa dados e erros
	 */
	const clearData = useCallback(() => {
		setData(null);
		setError(null);
		setLastSearchedCep("");
	}, []);

	/**
	 * Valida formato do CEP
	 */
	const isValidFormat = useCallback((cep: string) => {
		return isValidCEP(unformatCEP(cep));
	}, []);

	return {
		isLoading,
		data,
		error,
		lookupCep,
		clearData,
		isValidFormat,
	};
}

/**
 * Hook para busca automática de CEP com debounce
 * Busca automaticamente quando o CEP for válido
 *
 * @param cep - CEP atual do formulário
 * @param onDataFound - Callback chamado quando dados são encontrados
 * @param debounceMs - Tempo de debounce (padrão: 800ms)
 *
 * @example
 * const { isLoading, error } = useAutoCepLookup(
 *   watch("endereco_cep"),
 *   (data) => {
 *     setValue("endereco_rua", data.rua);
 *     setValue("endereco_bairro", data.bairro);
 *     setValue("endereco_cidade", data.cidade);
 *     setValue("endereco_estado", data.estado);
 *   }
 * );
 */
export function useAutoCepLookup(
	cep: string,
	onDataFound?: (data: CepData) => void,
	debounceMs: number = 800,
) {
	const { lookupCep, isLoading, data, error, clearData } = useCepLookup();

	// Debounce do CEP
	const [debouncedCep] = useDebounce(cep, debounceMs);

	// Buscar automaticamente quando CEP mudar
	useEffect(() => {
		if (debouncedCep && isValidCEP(unformatCEP(debouncedCep))) {
			lookupCep(debouncedCep);
		} else if (!debouncedCep) {
			clearData();
		}
	}, [debouncedCep, lookupCep, clearData]);

	// Chamar callback quando dados forem encontrados
	useEffect(() => {
		if (data && onDataFound) {
			onDataFound(data);
		}
	}, [data, onDataFound]);

	return {
		isLoading,
		data,
		error,
		clearData,
	};
}

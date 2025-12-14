import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { isValidCEP, unformatCEP } from "@/lib/formatters/address";
import { type CepData, type CepError, fetchCepData } from "@/lib/services/cep";

export interface UseCepLookupReturn {
	isLoading: boolean;
	data: CepData | null;
	error: CepError | null;
	lookupCep: (cep: string) => Promise<void>;
	clearData: () => void;
	isValidFormat: (cep: string) => boolean;
}

/**
 * Hook para busca manual de CEP
 */
export function useCepLookup(): UseCepLookupReturn {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<CepData | null>(null);
	const [error, setError] = useState<CepError | null>(null);
	const lastSearchedCepRef = useRef<string>("");

	const lookupCep = useCallback(async (cep: string) => {
		const cleanCep = unformatCEP(cep);

		// Não buscar se CEP inválido
		if (!isValidCEP(cleanCep)) {
			return;
		}

		// Não buscar se já foi buscado
		if (cleanCep === lastSearchedCepRef.current) {
			return;
		}

		setIsLoading(true);
		setError(null);
		lastSearchedCepRef.current = cleanCep;

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
			console.error("Erro ao buscar CEP:", err);
			setData(null);
			setError({
				message: "Erro inesperado ao buscar CEP",
				code: "UNKNOWN_ERROR",
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	const clearData = useCallback(() => {
		setData(null);
		setError(null);
		lastSearchedCepRef.current = "";
	}, []);

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
 */
export function useAutoCepLookup(
	cep: string,
	onDataFound?: (data: CepData) => void,
	debounceMs: number = 500,
) {
	const { lookupCep, isLoading, data, error, clearData } = useCepLookup();
	const onDataFoundRef = useRef(onDataFound);

	// Atualizar ref quando callback mudar
	onDataFoundRef.current = onDataFound;

	// Debounce do CEP
	const [debouncedCep] = useDebounce(cep || "", debounceMs);

	// Buscar automaticamente quando CEP com debounce mudar
	useEffect(() => {
		// Se não há CEP, limpar dados
		if (!debouncedCep || debouncedCep.trim() === "") {
			clearData();
			return;
		}

		const cleanCep = unformatCEP(debouncedCep);
		const valid = isValidCEP(cleanCep);

		// Se CEP é válido (8 dígitos), fazer busca
		if (valid) {
			lookupCep(debouncedCep);
		}
	}, [debouncedCep, lookupCep, clearData]);

	// Chamar callback quando dados forem encontrados
	useEffect(() => {
		if (data && onDataFoundRef.current) {
			onDataFoundRef.current(data);
		}
	}, [data]);

	return {
		isLoading,
		data,
		error,
		clearData,
	};
}

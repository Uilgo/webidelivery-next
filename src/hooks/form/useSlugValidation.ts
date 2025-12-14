"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { checkSlugAvailability } from "@/actions/validation";
import { generateSlug } from "@/lib/formatters/text";
import { slugSchema } from "@/shared/schemas/onboarding";

/**
 * Hook para validação de slug em tempo real
 * Integra validação Zod (formato) + RPC (disponibilidade)
 */
export function useSlugValidation() {
	const [slug, setSlug] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [isAvailable, setIsAvailable] = useState(false);
	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Ref para rastrear o último slug verificado (evita chamadas duplicadas)
	const lastCheckedSlug = useRef<string>("");

	// Debounce do slug para evitar muitas chamadas à RPC
	const [debouncedSlug] = useDebounce(slug, 600);

	/**
	 * Converter texto em slug válido usando formatter da lib
	 */
	const convertToSlug = useCallback((text: string): string => {
		return generateSlug(text);
	}, []);

	/**
	 * Validar formato do slug localmente usando Zod
	 */
	const validateSlugFormat = useCallback((slugValue: string): string | null => {
		if (!slugValue) {
			return null;
		}

		const result = slugSchema.safeParse(slugValue);
		return result.success ? null : result.error.issues[0]?.message || "Slug inválido";
	}, []);

	/**
	 * Verificar disponibilidade do slug no servidor via RPC
	 */
	const checkAvailability = useCallback(
		async (slugValue: string) => {
			if (!slugValue) {
				setIsValid(false);
				setIsAvailable(false);
				setError(null);
				return;
			}

			// 1. Validar formato primeiro (Zod tem prioridade)
			const formatError = validateSlugFormat(slugValue);
			if (formatError) {
				setIsValid(false);
				setIsAvailable(false);
				setError(formatError);
				return;
			}

			// 2. Se formato está OK, verificar disponibilidade via RPC
			setIsValid(true);
			setIsChecking(true);
			setError(null);

			try {
				const result = await checkSlugAvailability(slugValue);

				if (result.error) {
					setIsAvailable(false);
					setError(result.error);
				} else {
					setIsAvailable(result.available);
					if (!result.available) {
						setError("Este slug já está em uso");
					}
				}
			} catch (error) {
				console.error("Erro ao verificar slug:", error);
				setIsAvailable(false);
				setError("Erro ao verificar disponibilidade");
			} finally {
				setIsChecking(false);
			}
		},
		[validateSlugFormat],
	);

	// Efeito para verificar slug quando o valor debounced muda
	useEffect(() => {
		// Só verifica se o slug mudou de verdade
		if (debouncedSlug && debouncedSlug !== lastCheckedSlug.current) {
			lastCheckedSlug.current = debouncedSlug;
			checkAvailability(debouncedSlug);
		}
	}, [debouncedSlug, checkAvailability]); // Removido checkAvailability das dependências

	/**
	 * Função para atualizar o slug
	 */
	const handleSlugChange = useCallback(
		(value: string) => {
			const cleanedSlug = convertToSlug(value);
			setSlug(cleanedSlug);
		},
		[convertToSlug],
	);

	/**
	 * Função para validação manual (onBlur)
	 */
	const validateOnBlur = useCallback(() => {
		if (slug && !isChecking) {
			checkAvailability(slug);
		}
	}, [slug, isChecking, checkAvailability]);

	/**
	 * Gerar slug automaticamente baseado em texto
	 */
	const generateFromText = useCallback(
		(text: string) => {
			if (!slug && text) {
				// Só gera automaticamente se não há slug definido
				const autoSlug = convertToSlug(text);
				setSlug(autoSlug);
			}
		},
		[slug, convertToSlug],
	);

	return {
		// Estado
		slug,
		isValid,
		isAvailable,
		isChecking,
		error,

		// Ações
		handleSlugChange,
		validateOnBlur,
		validateSlugFormat,
		convertToSlug,
		generateFromText,

		// Estados derivados para UI
		showSuccess: isValid && isAvailable && !isChecking,
		showError: error !== null,
		showLoading: isChecking,
		errorMessage: error,
	};
}

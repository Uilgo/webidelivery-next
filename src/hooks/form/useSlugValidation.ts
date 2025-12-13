"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { checkSlugAvailability } from "@/actions/validation";
import { generateSlug } from "@/lib/formatters/text";
import { slugSchema } from "@/shared/schemas/onboarding";

/**
 * Hook para validação de slug em tempo real
 * Verifica se o slug já está em uso no sistema
 */
export function useSlugValidation() {
	const [slug, setSlug] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [isAvailable, setIsAvailable] = useState(false);
	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Debounce do slug para evitar muitas chamadas
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
	 * Verificar disponibilidade do slug no servidor
	 */
	const checkAvailability = useCallback(
		async (slugValue: string) => {
			if (!slugValue) {
				setIsValid(false);
				setIsAvailable(false);
				setError(null);
				return;
			}

			// Validar formato primeiro
			const formatError = validateSlugFormat(slugValue);
			if (formatError) {
				setIsValid(false);
				setIsAvailable(false);
				setError(formatError);
				return;
			}

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
		checkAvailability(debouncedSlug);
	}, [debouncedSlug, checkAvailability]);

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

		// Estados derivados
		showSuccess: isValid && isAvailable && !isChecking,
		showError: error !== null,
		showLoading: isChecking,
	};
}

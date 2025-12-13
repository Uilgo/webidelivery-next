"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { checkEmailAvailability } from "@/actions/validation";
import { normalizeEmail } from "@/lib/formatters/text";
import { emailSchema } from "@/shared/schemas/auth";

/**
 * Hook para validação de email em tempo real
 * Verifica se o email já está em uso no sistema
 */
export function useEmailValidation() {
	const [email, setEmail] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [isAvailable, setIsAvailable] = useState(false);
	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Debounce do email para evitar muitas chamadas
	const [debouncedEmail] = useDebounce(email, 800);

	/**
	 * Validar formato do email localmente usando Zod
	 */
	const validateEmailFormat = useCallback((emailValue: string): string | null => {
		if (!emailValue) {
			return null;
		}

		const result = emailSchema.safeParse(emailValue);
		return result.success ? null : result.error.issues[0]?.message || "Email inválido";
	}, []);

	/**
	 * Verificar disponibilidade do email no servidor
	 */
	const checkAvailability = useCallback(
		async (emailValue: string) => {
			if (!emailValue) {
				setIsValid(false);
				setIsAvailable(false);
				setError(null);
				return;
			}

			// Validar formato primeiro
			const formatError = validateEmailFormat(emailValue);
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
				const result = await checkEmailAvailability(emailValue);

				if (result.error) {
					setIsAvailable(false);
					setError(result.error);
				} else {
					setIsAvailable(result.available);
					if (!result.available) {
						setError("Este email já está cadastrado no sistema");
					}
				}
			} catch (error) {
				console.error("Erro ao verificar email:", error);
				setIsAvailable(false);
				setError("Erro ao verificar disponibilidade");
			} finally {
				setIsChecking(false);
			}
		},
		[validateEmailFormat],
	);

	// Efeito para verificar email quando o valor debounced muda
	useEffect(() => {
		checkAvailability(debouncedEmail);
	}, [debouncedEmail, checkAvailability]);

	/**
	 * Função para atualizar o email
	 */
	const handleEmailChange = useCallback((value: string) => {
		// Normalizar email usando formatter da lib
		const normalizedEmail = normalizeEmail(value);
		setEmail(normalizedEmail);
	}, []);

	/**
	 * Função para validação manual (onBlur)
	 */
	const validateOnBlur = useCallback(() => {
		if (email && !isChecking) {
			checkAvailability(email);
		}
	}, [email, isChecking, checkAvailability]);

	return {
		// Estado
		email,
		isValid,
		isAvailable,
		isChecking,
		error,

		// Ações
		handleEmailChange,
		validateOnBlur,
		validateEmailFormat,

		// Estados derivados
		showSuccess: isValid && isAvailable && !isChecking,
		showError: error !== null,
		showLoading: isChecking,
	};
}

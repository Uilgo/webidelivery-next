/**
 * Formatadores para números de telefone
 * Seguindo padrões brasileiros
 */

/**
 * Formata número de WhatsApp brasileiro
 * Aplica máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 *
 * @param value - Valor do input (pode conter caracteres não numéricos)
 * @returns Número formatado com máscara
 *
 * @example
 * formatWhatsApp("11999887766") // "(11) 99988-7766"
 * formatWhatsApp("1199988776") // "(11) 9998-8776"
 * formatWhatsApp("11 99988-7766") // "(11) 99988-7766"
 */
export function formatWhatsApp(value: string): string {
	// Remove todos os caracteres não numéricos
	const numbers = value.replace(/\D/g, "");

	// Limita a 11 dígitos (DDD + número)
	const limitedNumbers = numbers.slice(0, 11);

	// Aplica formatação baseada na quantidade de dígitos
	if (limitedNumbers.length <= 2) {
		return limitedNumbers;
	}

	if (limitedNumbers.length <= 6) {
		return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
	}

	if (limitedNumbers.length <= 10) {
		// Celular antigo (8 dígitos) ou fixo
		return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
	}

	// Celular novo (9 dígitos)
	return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
}

/**
 * Remove formatação do WhatsApp, retornando apenas números
 *
 * @param value - Número formatado
 * @returns Apenas os números
 *
 * @example
 * unformatWhatsApp("(11) 99988-7766") // "11999887766"
 */
export function unformatWhatsApp(value: string): string {
	return value.replace(/\D/g, "");
}

/**
 * Valida se o número de WhatsApp está no formato correto
 *
 * @param value - Número a ser validado
 * @returns true se válido, false caso contrário
 *
 * @example
 * isValidWhatsApp("(11) 99988-7766") // true
 * isValidWhatsApp("(11) 9998-8776") // true
 * isValidWhatsApp("11 99988") // false
 */
export function isValidWhatsApp(value: string): boolean {
	const numbers = unformatWhatsApp(value);

	// Deve ter 10 ou 11 dígitos (DDD + número)
	if (numbers.length < 10 || numbers.length > 11) {
		return false;
	}

	// DDD deve estar entre 11 e 99
	const ddd = parseInt(numbers.slice(0, 2), 10);
	if (ddd < 11 || ddd > 99) {
		return false;
	}

	// Para celular (11 dígitos), deve começar com 9
	if (numbers.length === 11 && numbers[2] !== "9") {
		return false;
	}

	return true;
}

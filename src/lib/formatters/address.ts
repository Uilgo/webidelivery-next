/**
 * Formatadores para endereços brasileiros
 * CEP, logradouros e componentes de endereço
 */

/**
 * Formata CEP brasileiro
 * Aplica máscara XXXXX-XXX
 *
 * @param value - Valor do input (pode conter caracteres não numéricos)
 * @returns CEP formatado com máscara
 *
 * @example
 * formatCEP("01234567") // "01234-567"
 * formatCEP("01234-567") // "01234-567"
 * formatCEP("012345") // "01234-5"
 */
export function formatCEP(value: string): string {
	// Remove todos os caracteres não numéricos
	const numbers = value.replace(/\D/g, "");

	// Limita a 8 dígitos
	const limitedNumbers = numbers.slice(0, 8);

	// Aplica formatação baseada na quantidade de dígitos
	if (limitedNumbers.length <= 5) {
		return limitedNumbers;
	}

	return `${limitedNumbers.slice(0, 5)}-${limitedNumbers.slice(5)}`;
}

/**
 * Remove formatação do CEP, retornando apenas números
 *
 * @param value - CEP formatado
 * @returns Apenas os números
 *
 * @example
 * unformatCEP("01234-567") // "01234567"
 */
export function unformatCEP(value: string): string {
	return value.replace(/\D/g, "");
}

/**
 * Valida se o CEP está no formato correto
 *
 * @param value - CEP a ser validado
 * @returns true se válido, false caso contrário
 *
 * @example
 * isValidCEP("01234-567") // true
 * isValidCEP("01234567") // true
 * isValidCEP("0123") // false
 */
export function isValidCEP(value: string): boolean {
	const numbers = unformatCEP(value);

	// Deve ter exatamente 8 dígitos
	if (numbers.length !== 8) {
		return false;
	}

	// Não pode ser todos os dígitos iguais
	const allSame = numbers.split("").every((digit) => digit === numbers[0]);
	if (allSame) {
		return false;
	}

	return true;
}

/**
 * Formata endereço completo para exibição
 *
 * @param endereco - Objeto com componentes do endereço
 * @returns Endereço formatado como string
 *
 * @example
 * formatFullAddress({
 *   rua: "Rua das Flores",
 *   numero: "123",
 *   complemento: "Apto 45",
 *   bairro: "Centro",
 *   cidade: "São Paulo",
 *   estado: "SP",
 *   cep: "01234567"
 * }) // "Rua das Flores, 123, Apto 45, Centro, São Paulo - SP, 01234-567"
 */
export function formatFullAddress(endereco: {
	rua?: string;
	numero?: string;
	complemento?: string;
	bairro?: string;
	cidade?: string;
	estado?: string;
	cep?: string;
}): string {
	const parts: string[] = [];

	// Logradouro + número
	if (endereco.rua) {
		let logradouro = endereco.rua;
		if (endereco.numero) {
			logradouro += `, ${endereco.numero}`;
		}
		parts.push(logradouro);
	}

	// Complemento
	if (endereco.complemento) {
		parts.push(endereco.complemento);
	}

	// Bairro
	if (endereco.bairro) {
		parts.push(endereco.bairro);
	}

	// Cidade + Estado
	if (endereco.cidade || endereco.estado) {
		let cidadeEstado = "";
		if (endereco.cidade) {
			cidadeEstado = endereco.cidade;
		}
		if (endereco.estado) {
			cidadeEstado += endereco.cidade ? ` - ${endereco.estado}` : endereco.estado;
		}
		parts.push(cidadeEstado);
	}

	// CEP
	if (endereco.cep) {
		parts.push(formatCEP(endereco.cep));
	}

	return parts.join(", ");
}

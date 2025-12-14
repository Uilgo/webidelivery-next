/**
 * Formatadores para valores monetários
 * Moeda brasileira (Real) e cálculos financeiros
 */

/**
 * Formata valor para moeda brasileira (Real)
 *
 * @param value - Valor numérico ou string
 * @returns Valor formatado em Real brasileiro
 *
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency("1234.56") // "R$ 1.234,56"
 * formatCurrency(0) // "R$ 0,00"
 */
export function formatCurrency(value: number | string): string {
	const numericValue = typeof value === "string" ? parseFloat(value) : value;

	if (Number.isNaN(numericValue)) {
		return "R$ 0,00";
	}

	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(numericValue);
}

/**
 * Formata valor monetário para input (sem símbolo da moeda)
 *
 * @param value - Valor do input
 * @returns Valor formatado para input
 *
 * @example
 * formatCurrencyInput("1234.56") // "1.234,56"
 * formatCurrencyInput("123456") // "1.234,56"
 */
export function formatCurrencyInput(value: string): string {
	// Remove tudo que não é número
	const numbers = value.replace(/\D/g, "");

	if (!numbers) return "";

	// Converte para centavos
	const cents = parseInt(numbers, 10);
	const reais = cents / 100;

	return new Intl.NumberFormat("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(reais);
}

/**
 * Converte valor formatado para número
 *
 * @param value - Valor formatado (ex: "R$ 1.234,56" ou "1.234,56")
 * @returns Valor numérico
 *
 * @example
 * parseCurrency("R$ 1.234,56") // 1234.56
 * parseCurrency("1.234,56") // 1234.56
 * parseCurrency("1234,56") // 1234.56
 */
export function parseCurrency(value: string): number {
	if (!value) return 0;

	// Remove símbolos de moeda e espaços
	const cleanValue = value
		.replace(/[R$\s]/g, "")
		.replace(/\./g, "") // Remove pontos (separadores de milhares)
		.replace(",", "."); // Substitui vírgula por ponto (separador decimal)

	const numericValue = parseFloat(cleanValue);
	return Number.isNaN(numericValue) ? 0 : numericValue;
}

/**
 * Valida se o valor monetário está no formato correto
 *
 * @param value - Valor a ser validado
 * @returns true se válido, false caso contrário
 *
 * @example
 * isValidCurrency("R$ 1.234,56") // true
 * isValidCurrency("1.234,56") // true
 * isValidCurrency("abc") // false
 */
export function isValidCurrency(value: string): boolean {
	if (!value) return false;

	const numericValue = parseCurrency(value);
	return !Number.isNaN(numericValue) && numericValue >= 0;
}

/**
 * Calcula porcentagem de um valor
 *
 * @param value - Valor base
 * @param percentage - Porcentagem a ser calculada
 * @returns Valor da porcentagem
 *
 * @example
 * calculatePercentage(100, 10) // 10
 * calculatePercentage(1234.56, 15) // 185.184
 */
export function calculatePercentage(value: number, percentage: number): number {
	return (value * percentage) / 100;
}

/**
 * Aplica desconto a um valor
 *
 * @param value - Valor original
 * @param discount - Desconto (pode ser valor fixo ou porcentagem)
 * @param isPercentage - Se true, desconto é porcentagem; se false, valor fixo
 * @returns Valor com desconto aplicado
 *
 * @example
 * applyDiscount(100, 10, true) // 90 (10% de desconto)
 * applyDiscount(100, 10, false) // 90 (R$ 10 de desconto)
 */
export function applyDiscount(
	value: number,
	discount: number,
	isPercentage: boolean = true,
): number {
	if (isPercentage) {
		const discountValue = calculatePercentage(value, discount);
		return Math.max(0, value - discountValue);
	}

	return Math.max(0, value - discount);
}

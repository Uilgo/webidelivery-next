/**
 * Formatadores para texto e strings
 * Email, slug, nomes e outros textos
 */

/**
 * Normaliza email para formato padrão
 * Remove espaços, converte para minúsculas
 *
 * @param email - Email a ser normalizado
 * @returns Email normalizado
 *
 * @example
 * normalizeEmail("  USER@EXAMPLE.COM  ") // "user@example.com"
 * normalizeEmail("User.Name+tag@Example.com") // "user.name+tag@example.com"
 */
export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

/**
 * Gera slug a partir de texto
 * Remove acentos, espaços especiais e caracteres inválidos
 *
 * @param text - Texto a ser convertido em slug
 * @returns Slug válido para URLs
 *
 * @example
 * generateSlug("Pizzaria do João & Cia") // "pizzaria-do-joao-cia"
 * generateSlug("Açaí & Vitaminas!!!") // "acai-vitaminas"
 * generateSlug("  Loja 123  ") // "loja-123"
 */
export function generateSlug(text: string): string {
	return (
		text
			.trim()
			.toLowerCase()
			// Remove acentos
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			// Remove caracteres especiais, mantém apenas letras, números e espaços
			.replace(/[^a-z0-9\s-]/g, "")
			// Substitui espaços múltiplos por um único espaço
			.replace(/\s+/g, " ")
			// Substitui espaços por hífens
			.replace(/\s/g, "-")
			// Remove hífens múltiplos
			.replace(/-+/g, "-")
			// Remove hífens do início e fim
			.replace(/^-+|-+$/g, "")
	);
}

/**
 * Valida se o slug está no formato correto
 *
 * @param slug - Slug a ser validado
 * @returns true se válido, false caso contrário
 *
 * @example
 * isValidSlug("pizzaria-do-joao") // true
 * isValidSlug("loja123") // true
 * isValidSlug("invalid slug") // false
 * isValidSlug("-invalid-") // false
 */
export function isValidSlug(slug: string): boolean {
	// Deve ter entre 3 e 50 caracteres
	if (slug.length < 3 || slug.length > 50) {
		return false;
	}

	// Deve conter apenas letras minúsculas, números e hífens
	if (!/^[a-z0-9-]+$/.test(slug)) {
		return false;
	}

	// Deve começar e terminar com letra ou número (não hífen)
	if (slug.startsWith("-") || slug.endsWith("-")) {
		return false;
	}

	// Não pode ter hífens duplos
	if (slug.includes("--")) {
		return false;
	}

	// Slugs reservados do sistema
	const reservedSlugs = [
		"api",
		"admin",
		"dashboard",
		"settings",
		"auth",
		"login",
		"signup",
		"forgot-password",
		"onboarding",
		"super-admin",
		"www",
		"mail",
		"ftp",
	];

	if (reservedSlugs.includes(slug)) {
		return false;
	}

	return true;
}

/**
 * Formata nome próprio (capitaliza primeira letra de cada palavra)
 *
 * @param name - Nome a ser formatado
 * @returns Nome formatado
 *
 * @example
 * formatProperName("joão silva santos") // "João Silva Santos"
 * formatProperName("MARIA DA SILVA") // "Maria Da Silva"
 * formatProperName("  pedro  ") // "Pedro"
 */
export function formatProperName(name: string): string {
	return name
		.trim()
		.toLowerCase()
		.split(" ")
		.filter((word) => word.length > 0)
		.map((word) => {
			// Preposições e artigos em minúscula (exceto se for a primeira palavra)
			const lowercaseWords = ["da", "de", "do", "das", "dos", "e", "&"];
			return lowercaseWords.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

/**
 * Trunca texto com reticências
 *
 * @param text - Texto a ser truncado
 * @param maxLength - Comprimento máximo
 * @returns Texto truncado
 *
 * @example
 * truncateText("Este é um texto muito longo", 15) // "Este é um tex..."
 * truncateText("Texto curto", 20) // "Texto curto"
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}

	return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Remove caracteres especiais mantendo apenas letras, números e espaços
 *
 * @param text - Texto a ser limpo
 * @returns Texto limpo
 *
 * @example
 * sanitizeText("Olá! Como você está? #123") // "Olá Como você está 123"
 */
export function sanitizeText(text: string): string {
	return text
		.replace(/[^\w\sÀ-ÿ]/g, " ") // Remove caracteres especiais, mantém acentos
		.replace(/\s+/g, " ") // Remove espaços múltiplos
		.trim();
}

import {
	differenceInDays,
	format,
	formatDistanceToNow,
	isToday,
	isTomorrow,
	isValid,
	isYesterday,
	parse,
	parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { format as formatTz, fromZonedTime, toZonedTime } from "date-fns-tz";

/**
 * Formatadores para datas e horários
 * Usando date-fns + date-fns-tz para melhor performance e funcionalidades
 * Padrões brasileiros com locale pt-BR e timezone America/Sao_Paulo
 */

// Timezone padrão do Brasil
export const BRAZIL_TIMEZONE = "America/Sao_Paulo";

/**
 * Converte string ou Date para objeto Date válido no timezone brasileiro
 *
 * @param date - Data a ser convertida
 * @param timezone - Timezone a ser usado (padrão: America/Sao_Paulo)
 * @returns Date válido ou null se inválido
 */
function parseDateSafe(date: Date | string, timezone: string = BRAZIL_TIMEZONE): Date | null {
	if (date instanceof Date) {
		return isValid(date) ? date : null;
	}

	if (typeof date === "string") {
		// Tenta parse ISO primeiro
		const isoDate = parseISO(date);
		if (isValid(isoDate)) {
			// Converte para timezone brasileiro se for UTC
			return toZonedTime(isoDate, timezone);
		}

		// Tenta parse de data brasileira (DD/MM/AAAA)
		const brDate = parse(date, "dd/MM/yyyy", new Date());
		if (isValid(brDate)) {
			return brDate;
		}

		// Tenta parse de data e hora brasileira (DD/MM/AAAA HH:MM)
		const brDateTime = parse(date, "dd/MM/yyyy HH:mm", new Date());
		if (isValid(brDateTime)) {
			return brDateTime;
		}
	}

	return null;
}

/**
 * Obtém a data atual no timezone brasileiro
 *
 * @returns Data atual no timezone do Brasil
 */
export function getNowInBrazil(): Date {
	return toZonedTime(new Date(), BRAZIL_TIMEZONE);
}

/**
 * Converte data UTC para timezone brasileiro
 *
 * @param date - Data em UTC
 * @returns Data no timezone brasileiro
 */
export function toBrazilTime(date: Date | string): Date {
	const dateObj = typeof date === "string" ? parseISO(date) : date;
	return toZonedTime(dateObj, BRAZIL_TIMEZONE);
}

/**
 * Converte data do timezone brasileiro para UTC
 *
 * @param date - Data no timezone brasileiro
 * @returns Data em UTC
 */
export function toUTC(date: Date | string): Date {
	const dateObj = typeof date === "string" ? parse(date, "dd/MM/yyyy HH:mm", new Date()) : date;
	return fromZonedTime(dateObj, BRAZIL_TIMEZONE);
}

/**
 * Formata data para padrão brasileiro (DD/MM/AAAA)
 *
 * @param date - Data a ser formatada
 * @returns Data formatada
 *
 * @example
 * formatDate(new Date("2024-12-13")) // "13/12/2024"
 * formatDate("2024-12-13") // "13/12/2024"
 */
export function formatDate(date: Date | string): string {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return "";
	}

	return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
}

/**
 * Formata data e hora para padrão brasileiro (DD/MM/AAAA HH:MM)
 *
 * @param date - Data a ser formatada
 * @returns Data e hora formatadas
 *
 * @example
 * formatDateTime(new Date("2024-12-13T15:30:00")) // "13/12/2024 15:30"
 */
export function formatDateTime(date: Date | string): string {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return "";
	}

	return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

/**
 * Formata apenas o horário (HH:MM)
 *
 * @param date - Data a ser formatada
 * @returns Horário formatado
 *
 * @example
 * formatTime(new Date("2024-12-13T15:30:00")) // "15:30"
 */
export function formatTime(date: Date | string): string {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return "";
	}

	return format(dateObj, "HH:mm", { locale: ptBR });
}

/**
 * Formata data de forma relativa (há X dias, ontem, hoje, etc.)
 *
 * @param date - Data a ser formatada
 * @returns Data relativa
 *
 * @example
 * formatRelativeDate(new Date()) // "hoje"
 * formatRelativeDate(new Date(Date.now() - 86400000)) // "ontem"
 * formatRelativeDate(new Date(Date.now() - 172800000)) // "há 2 dias"
 */
export function formatRelativeDate(date: Date | string): string {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return "";
	}

	if (isToday(dateObj)) {
		return "hoje";
	}

	if (isYesterday(dateObj)) {
		return "ontem";
	}

	if (isTomorrow(dateObj)) {
		return "amanhã";
	}

	const daysDiff = differenceInDays(new Date(), dateObj);

	// Para datas recentes (até 7 dias)
	if (daysDiff > 0 && daysDiff <= 7) {
		return `há ${daysDiff} dias`;
	}

	if (daysDiff < 0 && daysDiff >= -7) {
		return `em ${Math.abs(daysDiff)} dias`;
	}

	// Para datas mais antigas, usar formatação completa
	return formatDate(dateObj);
}

/**
 * Formata distância de tempo de forma humanizada
 *
 * @param date - Data a ser comparada com agora
 * @returns Distância formatada
 *
 * @example
 * formatDistanceToNowBR(new Date(Date.now() - 3600000)) // "cerca de 1 hora"
 * formatDistanceToNowBR(new Date(Date.now() - 300000)) // "5 minutos"
 */
export function formatDistanceToNowBR(date: Date | string): string {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return "";
	}

	return formatDistanceToNow(dateObj, {
		locale: ptBR,
		addSuffix: true,
	});
}

/**
 * Formata input de data (DD/MM/AAAA)
 *
 * @param value - Valor do input
 * @returns Data formatada para input
 *
 * @example
 * formatDateInput("13122024") // "13/12/2024"
 * formatDateInput("131224") // "13/12/24"
 */
export function formatDateInput(value: string): string {
	// Remove tudo que não é número
	const numbers = value.replace(/\D/g, "");

	if (numbers.length <= 2) {
		return numbers;
	} else if (numbers.length <= 4) {
		return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
	} else if (numbers.length <= 8) {
		return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
	}

	return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
}

/**
 * Valida se a data está no formato correto usando date-fns
 *
 * @param value - Data a ser validada (DD/MM/AAAA)
 * @returns true se válida, false caso contrário
 *
 * @example
 * isValidDate("13/12/2024") // true
 * isValidDate("32/13/2024") // false
 * isValidDate("13/12/24") // false (ano deve ter 4 dígitos)
 */
export function isValidDate(value: string): boolean {
	const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
	const match = value.match(dateRegex);

	if (!match) {
		return false;
	}

	// Usar date-fns para validação mais robusta
	const parsedDate = parse(value, "dd/MM/yyyy", new Date());
	return isValid(parsedDate);
}

/**
 * Converte data brasileira (DD/MM/AAAA) para ISO (AAAA-MM-DD)
 *
 * @param value - Data no formato brasileiro
 * @returns Data no formato ISO
 *
 * @example
 * parseDate("13/12/2024") // "2024-12-13"
 */
export function parseDate(value: string): string {
	if (!isValidDate(value)) {
		return "";
	}

	const parsedDate = parse(value, "dd/MM/yyyy", new Date());
	return format(parsedDate, "yyyy-MM-dd");
}

/**
 * Formata data para exibição em diferentes contextos
 *
 * @param date - Data a ser formatada
 * @param context - Contexto da formatação
 * @returns Data formatada conforme contexto
 *
 * @example
 * formatDateByContext(new Date(), "short") // "13/12"
 * formatDateByContext(new Date(), "medium") // "13/12/2024"
 * formatDateByContext(new Date(), "long") // "13 de dezembro de 2024"
 */
export function formatDateByContext(
	date: Date | string,
	context: "short" | "medium" | "long" | "full" = "medium",
): string {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return "";
	}

	const formats = {
		short: "dd/MM",
		medium: "dd/MM/yyyy",
		long: "dd 'de' MMMM 'de' yyyy",
		full: "EEEE, dd 'de' MMMM 'de' yyyy",
	};

	return format(dateObj, formats[context], { locale: ptBR });
}
/**
 * Formata data com timezone específico
 *
 * @param date - Data a ser formatada
 * @param timezone - Timezone desejado (padrão: America/Sao_Paulo)
 * @param formatPattern - Padrão de formatação
 * @returns Data formatada no timezone especificado
 *
 * @example
 * formatDateWithTimezone(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm") // "13/12/2024 15:30"
 * formatDateWithTimezone(new Date(), "UTC", "yyyy-MM-dd'T'HH:mm:ss'Z'") // "2024-12-13T18:30:00Z"
 */
export function formatDateWithTimezone(
	date: Date | string,
	timezone: string = BRAZIL_TIMEZONE,
	formatPattern: string = "dd/MM/yyyy HH:mm",
): string {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return "";
	}

	return formatTz(dateObj, formatPattern, { timeZone: timezone, locale: ptBR });
}

/**
 * Formata data e hora no timezone brasileiro com indicação de fuso
 *
 * @param date - Data a ser formatada
 * @returns Data formatada com timezone brasileiro
 *
 * @example
 * formatDateTimeBR(new Date()) // "13/12/2024 15:30 (BRT)"
 * formatDateTimeBR("2024-12-13T18:30:00Z") // "13/12/2024 15:30 (BRT)"
 */
export function formatDateTimeBR(date: Date | string): string {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return "";
	}

	return formatTz(dateObj, "dd/MM/yyyy HH:mm (zzz)", {
		timeZone: BRAZIL_TIMEZONE,
		locale: ptBR,
	});
}

/**
 * Formata horário de funcionamento brasileiro
 *
 * @param startTime - Horário de início
 * @param endTime - Horário de fim
 * @returns Horário formatado
 *
 * @example
 * formatBusinessHours("09:00", "18:00") // "09:00 às 18:00"
 * formatBusinessHours(new Date(), new Date()) // "15:30 às 16:30"
 */
export function formatBusinessHours(startTime: string | Date, endTime: string | Date): string {
	const start = typeof startTime === "string" ? startTime : formatTime(startTime);
	const end = typeof endTime === "string" ? endTime : formatTime(endTime);

	return `${start} às ${end}`;
}

/**
 * Verifica se uma data está no horário comercial brasileiro
 *
 * @param date - Data a ser verificada
 * @param startHour - Hora de início (0-23)
 * @param endHour - Hora de fim (0-23)
 * @returns true se está no horário comercial
 *
 * @example
 * isBusinessHours(new Date(), 9, 18) // true se entre 9h e 18h
 */
export function isBusinessHours(
	date: Date | string,
	startHour: number = 9,
	endHour: number = 18,
): boolean {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return false;
	}

	const brazilTime = toZonedTime(dateObj, BRAZIL_TIMEZONE);
	const hour = brazilTime.getHours();

	return hour >= startHour && hour < endHour;
}

/**
 * Obtém informações de timezone brasileiro
 *
 * @param date - Data para obter informações (padrão: agora)
 * @returns Informações do timezone
 *
 * @example
 * getBrazilTimezoneInfo() // { timezone: "America/Sao_Paulo", offset: "-03:00", isDST: false }
 */
export function getBrazilTimezoneInfo(date: Date = new Date()) {
	const brazilTime = toZonedTime(date, BRAZIL_TIMEZONE);
	const utcTime = toUTC(brazilTime);
	const offsetMinutes = (brazilTime.getTime() - utcTime.getTime()) / (1000 * 60);
	const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
	const offsetMins = Math.abs(offsetMinutes) % 60;
	const offsetSign = offsetMinutes >= 0 ? "+" : "-";
	const offset = `${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMins.toString().padStart(2, "0")}`;

	// Verifica se está no horário de verão (Brasil não usa mais desde 2019, mas mantemos a lógica)
	const isDST = offset === "-02:00";

	return {
		timezone: BRAZIL_TIMEZONE,
		offset,
		isDST,
		abbreviation: isDST ? "BRST" : "BRT",
	};
}

/**
 * Converte timestamp Unix para data brasileira
 *
 * @param timestamp - Timestamp Unix (segundos)
 * @returns Data no timezone brasileiro
 *
 * @example
 * fromUnixTimestamp(1702483200) // Data correspondente no timezone brasileiro
 */
export function fromUnixTimestamp(timestamp: number): Date {
	const date = new Date(timestamp * 1000);
	return toZonedTime(date, BRAZIL_TIMEZONE);
}

/**
 * Converte data brasileira para timestamp Unix
 *
 * @param date - Data no timezone brasileiro
 * @returns Timestamp Unix (segundos)
 *
 * @example
 * toUnixTimestamp(new Date()) // 1702483200
 */
export function toUnixTimestamp(date: Date | string): number {
	const dateObj = parseDateSafe(date);

	if (!dateObj) {
		return 0;
	}

	const utcDate = fromZonedTime(dateObj, BRAZIL_TIMEZONE);
	return Math.floor(utcDate.getTime() / 1000);
}

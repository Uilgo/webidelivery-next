import { cookies } from "next/headers";

export async function getServerTheme() {
	const cookieStore = await cookies();
	return cookieStore.get("webidelivery-theme")?.value || "system";
}

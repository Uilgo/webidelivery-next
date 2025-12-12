import { getServerTheme } from "@/lib/theme-server";
import { ModeToggleClient } from "./mode-toggle-client";

export async function ModeToggle() {
	const serverTheme = await getServerTheme();

	return <ModeToggleClient initialTheme={serverTheme} />;
}

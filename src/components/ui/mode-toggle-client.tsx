"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/ui/useTheme";

interface ModeToggleClientProps {
	initialTheme: string;
}

export function ModeToggleClient({ initialTheme }: ModeToggleClientProps) {
	const { setTheme, theme } = useTheme();
	const [currentTheme, setCurrentTheme] = useState(initialTheme);

	useEffect(() => {
		if (theme) {
			setCurrentTheme(theme);
		}
	}, [theme]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="cursor-pointer border-0 outline-0 ring-0 shadow-none focus:border-0 focus:outline-0 focus:ring-0 focus-visible:border-0 focus-visible:outline-0 focus-visible:ring-0 active:border-0 active:outline-0 active:ring-0"
				>
					<Sun
						className={`h-[1.2rem] w-[1.2rem] transition-all ${currentTheme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}
					/>
					<Moon
						className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${currentTheme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"}`}
					/>
					<Monitor
						className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${currentTheme === "system" ? "scale-100 rotate-0" : "scale-0 rotate-90"}`}
					/>
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => setTheme("light")}
					className="cursor-pointer flex items-center justify-between"
				>
					<div className="flex items-center">
						<Sun className="mr-2 h-4 w-4" />
						Light
					</div>
					{currentTheme === "light" && <Check className="h-4 w-4 text-primary" />}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dark")}
					className="cursor-pointer flex items-center justify-between"
				>
					<div className="flex items-center">
						<Moon className="mr-2 h-4 w-4" />
						Dark
					</div>
					{currentTheme === "dark" && <Check className="h-4 w-4 text-primary" />}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("system")}
					className="cursor-pointer flex items-center justify-between"
				>
					<div className="flex items-center">
						<Monitor className="mr-2 h-4 w-4" />
						System
					</div>
					{currentTheme === "system" && <Check className="h-4 w-4 text-primary" />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

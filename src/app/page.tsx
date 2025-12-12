import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Se o usuário estiver logado, redireciona para o dashboard
	if (user) {
		redirect("/dashboard");
	}

	// Se não estiver logado, redireciona para o login
	redirect("/login");
}

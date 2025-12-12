import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

const Home = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-svh">
			<h1 className="text-3xl font-bold">Olá Mundo!</h1>

			<ModeToggle />
			<Button className="cursor-pointer">Botão</Button>
		</div>
	);
};

export default Home;

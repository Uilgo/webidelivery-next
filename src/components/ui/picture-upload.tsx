"use client";

import { ImagePlus, Link, Loader2, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PictureUploadProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	hint?: string;
	error?: string;
	previewBg?: "light" | "dark";
	maxSize?: number;
	maxSizeKB?: number;
	disabled?: boolean;
	id?: string;
}

// Função auxiliar para validar URLs de imagem
const validateImageUrl = async (url: string): Promise<boolean> => {
	if (url.startsWith("data:image/")) {
		return /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/.test(url);
	}

	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		return false;
	}

	const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?.*)?$/i;
	if (imageExtensions.test(url)) {
		return true;
	}

	const knownServices = [
		"imgur.com",
		"cloudinary.com",
		"unsplash.com",
		"pexels.com",
		"picsum.photos",
		"placeholder.com",
		"via.placeholder.com",
		"gravatar.com",
		"githubusercontent.com",
		"googleusercontent.com",
		"supabase.co",
		"supabase.in",
		"images.unsplash.com",
	];

	if (knownServices.some((service) => url.includes(service))) {
		return true;
	}

	return new Promise((resolve) => {
		const img = new window.Image();
		const timeout = setTimeout(() => resolve(true), 3000);
		img.onload = () => {
			clearTimeout(timeout);
			resolve(true);
		};
		img.onerror = () => {
			clearTimeout(timeout);
			resolve(false);
		};
		img.src = url;
	});
};

// Função auxiliar para calcular tamanho da imagem
const calculateImageSize = async (imageUrl: string): Promise<number | null> => {
	if (imageUrl.startsWith("data:")) {
		const base64 = imageUrl.split(",")[1];
		if (base64) {
			const sizeBytes = (base64.length * 3) / 4;
			return Math.round(sizeBytes / 1024);
		}
	} else {
		try {
			const res = await fetch(imageUrl, { method: "HEAD" });
			const contentLength = res.headers.get("content-length");
			if (contentLength) {
				return Math.round(Number.parseInt(contentLength, 10) / 1024);
			}
		} catch {
			// Ignorar erros de fetch
		}
	}
	return null;
};

// Hook personalizado para gerenciar estado
function usePictureUpload(value: string, onChange: (value: string) => void) {
	const [tempUrl, setTempUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [imageError, setImageError] = useState(false);
	const [imageSizeKB, setImageSizeKB] = useState<number | null>(null);

	useEffect(() => {
		if (value) {
			setImageError(false);
			calculateImageSize(value).then(setImageSizeKB);
		} else {
			setImageSizeKB(null);
		}
	}, [value]);

	const applyUrl = async () => {
		if (!tempUrl.trim()) return;
		setIsLoading(true);
		setImageError(false);

		try {
			const isValid = await validateImageUrl(tempUrl);
			if (isValid) {
				onChange(tempUrl);
				setTempUrl("");
			} else {
				setImageError(true);
			}
		} catch (error) {
			console.error("Erro ao validar imagem:", error);
			setImageError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const removeImage = () => {
		onChange("");
		setImageError(false);
	};

	const handlePreviewClick = () => {
		if (value && !isLoading) {
			setShowPreviewModal(true);
		}
	};

	return {
		tempUrl,
		setTempUrl,
		isLoading,
		showPreviewModal,
		setShowPreviewModal,
		imageError,
		imageSizeKB,
		applyUrl,
		removeImage,
		handlePreviewClick,
	};
}

// Componente para o conteúdo do preview
function PreviewContent({
	value,
	isLoading,
	imageError,
}: {
	value: string;
	isLoading: boolean;
	imageError: boolean;
}) {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center">
				<Loader2 className="size-8 animate-spin text-primary" />
				<span className="mt-1 text-xs text-muted-foreground">Validando...</span>
			</div>
		);
	}

	if (value && !imageError) {
		return (
			<>
				<Image
					src={value}
					alt="Preview"
					width={100}
					height={100}
					className="h-full w-full rounded-xl object-cover"
					onError={() => {}}
				/>
				<div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition-all hover:bg-black/40">
					<ZoomIn className="size-6 text-white opacity-0 transition-opacity hover:opacity-100" />
				</div>
			</>
		);
	}

	if (!value) {
		return (
			<div className="flex flex-col items-center">
				<ImagePlus className="size-8 text-muted-foreground" />
				<span className="mt-1 text-xs text-muted-foreground">URL</span>
			</div>
		);
	}

	if (imageError) {
		return (
			<div className="flex flex-col items-center">
				<X className="size-8 text-destructive" />
				<span className="mt-1 text-xs text-destructive">Erro</span>
			</div>
		);
	}

	return null;
}

// Componente do preview
function PreviewArea({
	value,
	isLoading,
	imageError,
	previewBgClass,
	handlePreviewClick,
	removeImage,
}: {
	value: string;
	isLoading: boolean;
	imageError: boolean;
	previewBgClass: string;
	handlePreviewClick: () => void;
	removeImage: () => void;
}) {
	return (
		<button
			type="button"
			className={`
				relative flex h-[100px] w-[100px] shrink-0 items-center justify-center 
				rounded-xl border-2 transition-all
				${value ? "border-border cursor-pointer hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" : "border-dashed border-muted-foreground/50"}
				${imageError ? "border-destructive" : "border-border"}
				${previewBgClass}
			`}
			onClick={handlePreviewClick}
			disabled={!value || isLoading}
			aria-label={value ? "Visualizar imagem em tamanho completo" : "Área de preview da imagem"}
		>
			<PreviewContent value={value} isLoading={isLoading} imageError={imageError} />

			{value && !isLoading && (
				<button
					type="button"
					className="absolute -right-2 -top-2 z-10 flex size-5 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
					title="Remover"
					onClick={(e) => {
						e.stopPropagation();
						removeImage();
					}}
				>
					<X className="size-3" />
				</button>
			)}
		</button>
	);
}

// Componente para os controles de input
function InputControls({
	value,
	tempUrl,
	setTempUrl,
	inputId,
	disabled,
	isLoading,
	applyUrl,
	removeImage,
}: {
	value: string;
	tempUrl: string;
	setTempUrl: (value: string) => void;
	inputId: string;
	disabled: boolean;
	isLoading: boolean;
	applyUrl: () => void;
	removeImage: () => void;
}) {
	if (!value) {
		return (
			<div className="flex items-stretch gap-2">
				<Input
					id={inputId}
					value={tempUrl}
					onChange={(e) => setTempUrl(e.target.value)}
					placeholder="https://exemplo.com/logo.png"
					className="min-w-[180px]"
					disabled={disabled || isLoading}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							applyUrl();
						}
					}}
				/>
				<Button
					type="button"
					disabled={!tempUrl.trim() || isLoading || disabled}
					onClick={applyUrl}
					className="shrink-0 px-3"
				>
					{isLoading ? <Loader2 className="size-4 animate-spin" /> : <Link className="size-4" />}
				</Button>
			</div>
		);
	}

	return (
		<Button
			type="button"
			variant="outline"
			disabled={disabled || isLoading}
			onClick={removeImage}
			className="flex items-center gap-2"
		>
			<Link className="size-4" />
			Alterar
		</Button>
	);
}

/**
 * Componente de upload de imagem via URL com preview
 */
export function PictureUpload({
	value,
	onChange,
	label,
	hint,
	error,
	previewBg = "light",
	maxSize = 512,
	maxSizeKB = 100,
	disabled = false,
	id,
}: PictureUploadProps) {
	const generatedId = useId();
	const inputId = id || `picture-upload-${generatedId}`;
	const {
		tempUrl,
		setTempUrl,
		isLoading,
		showPreviewModal,
		setShowPreviewModal,
		imageError,
		imageSizeKB,
		applyUrl,
		removeImage,
		handlePreviewClick,
	} = usePictureUpload(value, onChange);

	const previewBgClass = previewBg === "dark" ? "bg-gray-900" : "bg-white";

	return (
		<div className="space-y-2">
			{/* Label sempre presente, mas só associada quando há input visível */}
			{label && <div className="block text-sm font-medium">{label}</div>}

			<div className="flex items-start gap-3">
				<div className="flex flex-col items-center gap-2">
					<PreviewArea
						value={value}
						isLoading={isLoading}
						imageError={imageError}
						previewBgClass={previewBgClass}
						handlePreviewClick={handlePreviewClick}
						removeImage={removeImage}
					/>
					<p className="whitespace-nowrap text-xs text-muted-foreground">
						{hint || "Fundo transparente"}
					</p>
				</div>

				<div className="flex flex-1 flex-col gap-2">
					<InputControls
						value={value}
						tempUrl={tempUrl}
						setTempUrl={setTempUrl}
						inputId={inputId}
						disabled={disabled}
						isLoading={isLoading}
						applyUrl={applyUrl}
						removeImage={removeImage}
					/>

					<div className="space-y-1 text-xs text-muted-foreground">
						<p>PNG, JPG ou SVG</p>
						<p>
							Recomendado: {maxSize}x{maxSize}px
						</p>
						<p>{imageSizeKB ? `Tamanho: ${imageSizeKB}KB` : `Máximo: ${maxSizeKB}KB`}</p>
					</div>
				</div>
			</div>

			{(error || imageError) && (
				<p className="text-xs text-destructive">{error || "URL de imagem inválida"}</p>
			)}

			{showPreviewModal && value && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold mb-4">Preview da Imagem</h3>
						<div className="flex flex-col items-center gap-4">
							<div
								className={`flex items-center justify-center rounded-xl border-2 border-border p-4 ${previewBgClass}`}
							>
								<Image
									src={value}
									alt="Preview completo"
									width={400}
									height={400}
									className="max-h-[400px] max-w-[400px] object-contain"
								/>
							</div>
							<p className="text-sm text-muted-foreground">
								Recomendado: {maxSize}x{maxSize}px
							</p>
						</div>
						<div className="flex justify-end mt-4">
							<Button variant="outline" onClick={() => setShowPreviewModal(false)}>
								Fechar
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

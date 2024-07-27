import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Mapjsx from "./Map.js";
import { useRouter } from "next/navigation";
import SkeletonForm from "./SkeletonForm";
import { getAuth } from "firebase/auth";

const Form = ({ type, submitting, handleSubmit }) => {
	const [loading, setLoading] = useState(true);
	const [userUID, setUserUID] = useState(null);
	const [errors, setErrors] = useState({});
	const [tempMessage, setTempMessage] = useState("");

	const forbiddenWords = [
		// Palabrotas y lenguaje ofensivo
		"mierda",
		"puto",
		"puta",
		"cabrón",
		"gilipollas",
		"imbécil",
		"idiota",
		"joder",
		"culo",
		"hostia",
		"coño",
		"hijoputa",
		"maricón",
		"zorra",
		"pendejo",
		"chinga",
		"mmg",
		"verga",
		"ñema",

		// Productos ilegales
		"cocaína",
		"heroína",
		"metanfetamina",
		"crack",
		"éxtasis",
		"lsd",
		"marihuana",
		"cannabis",
		"arma",
		"rifle",
		"explosivo",
		"dildo",

		// Términos discriminatorios
		"gay",
		"marica",
		"sudaca",
		"inmigrante",
		"retrasado",

		// Términos relacionados con violencia
		"matar",
		"violar",
		"asesinar",
		"torturar",
		"golpear",
		"abusar",
	];

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setUserUID(user.uid);
			} else {
				setUserUID(null);
			}
		});

		return () => unsubscribe();
	}, []);

	const router = useRouter();
	const [formData, setFormData] = useState({
		storeName: "",
		phoneNumber: "",
		delivery: "Sin delivery",
		productName: "",
		price: "",
		category: "Seleccione una categoria",
		description: "",
		location: null,
		image: null,
		imagePreview: "/assets/images/add-image.svg",
	});

	const validateContent = (text) => {
		if (!text) return true; // Si el texto está vacío, lo consideramos válido

		const normalizedText = text.toLowerCase().trim();

		return !forbiddenWords.some((word) => {
			const regex = new RegExp(`\\b${word}\\b`, "i");
			return regex.test(normalizedText);
		});
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleMapClick = (lat, lng) => {
		setFormData((prevState) => ({
			...prevState,
			location: { lat, lng },
		}));
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData((prevState) => ({
					...prevState,
					image: file,
					imagePreview: reader.result,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCancel = (e) => {
		e.preventDefault();
		const confirmCancel = confirm("¿Estás seguro que deseas cancelar?");
		if (confirmCancel) {
			router.push("/");
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.location) {
			newErrors.location = "Por favor, seleccione una ubicación en el mapa.";
		}

		if (formData.category === "Seleccione una categoria") {
			newErrors.category = "Por favor, seleccione una categoría.";
		}

		if (!formData.storeName.trim()) {
			newErrors.storeName = "El nombre de la tienda es obligatorio.";
		}

		if (!formData.productName.trim()) {
			newErrors.productName = "El nombre del producto es obligatorio.";
		}

		if (!formData.price.trim()) {
			newErrors.price = "El precio es obligatorio.";
		}

		if (!formData.image) {
			newErrors.image = "Por favor, suba una imagen del producto.";
		}

		// Validación de contenido inapropiado
		if (!validateContent(formData.storeName)) {
			newErrors.storeName =
				"El nombre de la tienda contiene lenguaje inapropiado.";
		}
		if (!validateContent(formData.productName)) {
			newErrors.productName =
				"El nombre del producto contiene lenguaje inapropiado.";
		}
		if (!validateContent(formData.description)) {
			newErrors.description = "La descripción contiene lenguaje inapropiado.";
		}
		if (formData.Phone && !/^\d{10}$/.test(formData.Phone)) {
			newErrors.phone = "El número de teléfono debe tener exactamente 10 dígitos.";
		}

		return newErrors;
	};

	const onSubmit = (e) => {
		e.preventDefault();

		const newErrors = validateForm();

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setTempMessage("Por favor, rellene todos los campos obligatorios");
			window.scrollTo({ top: 0, behavior: "smooth" });
			setTimeout(() => setTempMessage(""), 5000);
			return;
		}

		// Si no hay errores, procede con el envío
		const formDataWithUID = {
			...formData,
			Added_by: userUID,
		};

		console.log("Form submitted");
		handleSubmit(formDataWithUID);
	};

	useEffect(() => {
		setLoading(false);
	}, []);

	if (loading) {
		return <SkeletonForm />;
	}
	return (
		<section className="w-full max-w-full flex-col px-6">
			{tempMessage && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-40 py-10 rounded absolute mb-4 mt-2"
					role="alert">
					<span className="block sm:inline">{tempMessage}</span>
				</div>
			)}
			<h1 className="head_text text-left">
				<span className="head_text"> Publicar productos</span>
			</h1>

			

			<form
				onSubmit={onSubmit}
				className="mt-10 w-full flex flex-col gap-5 border-t-2">
				<div className="flex flex-wrap border-b-2">
					<div className="flex flex-col w-full lg:w-1/2 flex-grow">
						<Mapjsx
							onMapClick={handleMapClick}
							error={errors.location ? true : false}
						/>
						{errors.location && (
							<p className="error-message ml-5 lg:ml-10 text-red-500">
								{errors.location}
							</p>
						)}
					</div>
					<div className="flex flex-col w-full lg:w-1/2">
						<p className="desc text-left max-w-md">
							1. Seleccionar en el mapa la ubicación de la tienda que vende el
							producto. Haga clic en el mapa para seleccionar la ubicación.{" "}
							<small className="font-bold italic">- Obligatorio</small>
						</p>
						<p className="desc text-left max-w-md">
							2. Llenar los campos con la información del local.
						</p>
						<label>
							<span className="font-inter font-semibold text-base text-white">
								Nombre de la tienda{" "}
								<small className="font-bold italic">- Obligatorio</small>
							</span>
							<textarea
								name="storeName"
								value={formData.storeName}
								onChange={handleInputChange}
								placeholder="Escriba el nombre de la tienda"
								className={`form_textarea resize-none ${
									errors.storeName ? "error-input" : ""
								}`}
							/>
							{errors.storeName && (
								<p className="error-message">{errors.storeName}</p>
							)}
						</label>
						<div className="flex flex-row pt-2 w-full mb-4">
							<label className="w-1/2 mr-1">
								<span className="font-inter font-semibold text-base text-white">
									Número teléfono
								</span>
								<input
									type="tel"
									name="phoneNumber"
									value={formData.phoneNumber}
									onChange={handleInputChange}
									placeholder="1234567890"
									pattern="[0-9]{10}"
									className="form_textarea_sm resize-none"
								/>
								<span className="text-gray-500 text-xs">
									{" "}
									Solo 10 digitos, no se admiten simbilos ni espacios.
								</span>
							</label>
							<label className="w-1/2 ml-1">
								<span className="font-inter font-semibold text-base text-white">
									Delivery
								</span>
								<select
									name="delivery"
									value={formData.delivery}
									onChange={handleInputChange}
									className="form_textarea_sm">
									<option value="Sin delivery">Sin delivery</option>
									<option value="Llamada">Llamada</option>
									<option value="Aplicación">Aplicación</option>
									<option value="Llamada y Aplicación">
										Llamada y Aplicación
									</option>
								</select>
							</label>
						</div>
					</div>
				</div>
				<p className="text-sm text-white sm:text-xl max-w-2xl text-left ml-4">
					3. Llenar los campos con la información del producto.
				</p>
				<div className="flex flex-wrap w-full">
					<div className="file-select-img mb-4 ml-4 mr-4">
						<label className="flex flex-col flex-center mt-8 mb-4">
							<Image
								src={formData.imagePreview}
								alt="Imagen del producto"
								width={70}
								height={30}
								className="object-contain"
							/>
							<input
								type="file"
								onChange={handleImageUpload}
								accept="image/*"
								capture="environment"
								className="src-file"
							/>
							{formData.image ? "Cambiar imagen" : "Subir imagen"}
						</label>
						{errors.image && <p className="error-message">{errors.image}</p>}
					</div>
					<div className="w-full lg:w-1/2">
						<label>
							<span className="font-inter font-semibold text-base text-white">
								Nombre del producto{" "}
								<small className="font-bold italic">- Obligatorio</small>
							</span>
							<textarea
								name="productName"
								value={formData.productName}
								onChange={handleInputChange}
								placeholder="Escriba el nombre"
								className={`form_textarea resize-none ${
									errors.productName ? "error-input" : ""
								}`}
							/>
							{errors.productName && (
								<p className="error-message">{errors.productName}</p>
							)}
						</label>
						<div className="flex flex-row pt-2 w-full">
							<label className="w-1/2 mr-1">
								<span className="font-inter font-semibold text-base text-white">
									Precio{" "}
									<small className="font-bold italic">- Obligatorio</small>
								</span>
								<input
									type="number"
									name="price"
									value={formData.price}
									onChange={handleInputChange}
									placeholder="Escriba el precio"
									step="0.01"
									min="0"
									className={`form_textarea_sm resize-none ${
										errors.price ? "error-input" : ""
									}`}
								/>
								{errors.price && (
									<p className="error-message">{errors.price}</p>
								)}
							</label>
							<label className="w-1/2 ml-1">
								<span className="font-inter font-semibold text-base text-white">
									Categoría{" "}
									<small className="font-bold italic">- Obligatorio</small>
								</span>
								<select
									name="category"
									value={formData.category}
									onChange={handleInputChange}
									className={`form_textarea_sm ${
										errors.category ? "error-input" : ""
									}`}
									defaultValue="Otros">
									<option value="Seleccione una categoria" hidden disabled>
										Seleccione una categoria
									</option>
									<option value="Ropa">Ropa</option>
									<option value="Tecnología">Tecnología</option>
									<option value="Comestibles">Comestibles</option>
									<option value="Hogar">Hogar</option>
									<option value="Deportes">Deportes</option>
									<option value="Salud">Salud</option>
									<option value="Otros">Otros</option>
								</select>
								{errors.category && (
									<p className="error-message">{errors.category}</p>
								)}
							</label>
						</div>
					</div>
				</div>
				<label>
					<span className="font-inter font-semibold text-base text-white">
						Descripción del producto
					</span>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						placeholder="Descripción general del producto"
						className={`form_textarea_desc resize-none ${
							errors.description ? "error-input" : ""
						}`}
					/>
					{errors.description && (
						<p className="error-message">{errors.description}</p>
					)}
				</label>
				<div className="flex-center mx-3 mb-5 gap-4">
					<Link
						href="/"
						className="text-sm hover:underline h-full text-black"
						onClick={handleCancel}>
						Cancelar
					</Link>
					<button type="submit" disabled={submitting} className="white_btn">
						{submitting ? `${type}...` : type}
					</button>
				</div>
			</form>
		</section>
	);
};

export default Form;

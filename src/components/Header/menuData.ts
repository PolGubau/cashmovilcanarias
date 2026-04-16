import type { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
	{
		id: 1,
		title: "Popular",
		newTab: false,
		path: "/",
	},
	{
		id: 2,
		title: "Tienda",
		newTab: false,
		path: "/shop-with-sidebar",
	},
	{
		id: 3,
		title: "Contacto",
		newTab: false,
		path: "/contact",
	},
	{
		id: 6,
		title: "Páginas",
		newTab: false,
		path: "/",
		submenu: [
			{
				id: 61,
				title: "Tienda con barra lateral",
				newTab: false,
				path: "/shop-with-sidebar",
			},
			{
				id: 62,
				title: "Tienda sin barra lateral",
				newTab: false,
				path: "/shop-without-sidebar",
			},
			{
				id: 64,
				title: "Pago",
				newTab: false,
				path: "/checkout",
			},
			{
				id: 65,
				title: "Carrito",
				newTab: false,
				path: "/cart",
			},
			{
				id: 66,
				title: "Lista de deseos",
				newTab: false,
				path: "/wishlist",
			},
			{
				id: 67,
				title: "Iniciar sesión",
				newTab: false,
				path: "/signin",
			},
			{
				id: 68,
				title: "Registrarse",
				newTab: false,
				path: "/signup",
			},
			{
				id: 69,
				title: "Mi cuenta",
				newTab: false,
				path: "/my-account",
			},
			{
				id: 70,
				title: "Contacto",
				newTab: false,
				path: "/contact",
			},
			{
				id: 62,
				title: "Error",
				newTab: false,
				path: "/error",
			},
			{
				id: 63,
				title: "Correo enviado",
				newTab: false,
				path: "/mail-success",
			},
		],
	},
];

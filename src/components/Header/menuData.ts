import type { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
	{
		id: 1,
		title: "Inicio",
		newTab: false,
		path: "/",
	},
	{
		id: 2,
		title: "Tienda",
		newTab: false,
		path: "/tienda",
	},
	{
		id: 3,
		title: "Marcas",
		newTab: false,
		path: "/tienda",
		submenu: [
			{
				id: 31,
				title: "Apple (iPhone / iPad)",
				newTab: false,
				path: "/tienda?brand=Apple",
			},
			{
				id: 32,
				title: "Samsung",
				newTab: false,
				path: "/tienda?brand=Samsung",
			},
			{ id: 33, title: "Xiaomi", newTab: false, path: "/tienda?brand=Xiaomi" },
			{
				id: 34,
				title: "OnePlus",
				newTab: false,
				path: "/tienda?brand=OnePlus",
			},
			{
				id: 35,
				title: "Google Pixel",
				newTab: false,
				path: "/tienda?brand=Google",
			},
		],
	},
	{
		id: 4,
		title: "Contacto",
		newTab: false,
		path: "/contact",
	},
];

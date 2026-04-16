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
		title: "Smartphones",
		newTab: false,
		path: "/tienda",
		submenu: [
			{
				id: 31,
				title: "iPhone",
				newTab: false,
				path: "/tienda",
			},
			{
				id: 32,
				title: "Samsung Galaxy",
				newTab: false,
				path: "/tienda",
			},
			{
				id: 33,
				title: "Xiaomi",
				newTab: false,
				path: "/tienda",
			},
			{
				id: 34,
				title: "OnePlus",
				newTab: false,
				path: "/tienda",
			},
		],
	},
	{
		id: 4,
		title: "Tablets",
		newTab: false,
		path: "/tienda",
		submenu: [
			{
				id: 41,
				title: "iPad",
				newTab: false,
				path: "/tienda",
			},
			{
				id: 42,
				title: "Tablets Android",
				newTab: false,
				path: "/tienda",
			},
		],
	},
	{
		id: 5,
		title: "Contacto",
		newTab: false,
		path: "/contact",
	},
];

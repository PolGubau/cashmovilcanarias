import type { Category } from "@/types/category";

const data: Category[] = [
	{
		id: 1,
		title: "iPhone",
		img: "/images/categories/categories-01.png",
		href: "/tienda?brand=Apple&category=smartphone",
	},
	{
		id: 2,
		title: "Samsung",
		img: "/images/categories/categories-02.png",
		href: "/tienda?brand=Samsung&category=smartphone",
	},
	{
		id: 3,
		title: "Xiaomi",
		img: "/images/categories/categories-03.png",
		href: "/tienda?brand=Xiaomi&category=smartphone",
	},
	{
		id: 4,
		title: "iPad",
		img: "/images/categories/categories-04.png",
		href: "/tienda?brand=Apple&category=tablet",
	},
	{
		id: 5,
		title: "Tablets Android",
		img: "/images/categories/categories-05.png",
		href: "/tienda?category=tablet",
	},
	{
		id: 6,
		title: "Smartwatch",
		img: "/images/categories/categories-06.png",
		href: "/tienda?category=smartwatch",
	},
	{
		id: 7,
		title: "Auriculares",
		img: "/images/categories/categories-07.png",
		href: "/tienda?category=auriculares",
	},
	{
		id: 8,
		title: "Fundas",
		img: "/images/categories/categories-04.png",
		href: "/tienda?category=fundas_protectores",
	},
	{
		id: 9,
		title: "Cargadores",
		img: "/images/categories/categories-05.png",
		href: "/tienda?category=cargadores_cables",
	},
	{
		id: 10,
		title: "Power Bank",
		img: "/images/categories/categories-06.png",
		href: "/tienda?category=power_bank",
	},
	{
		id: 11,
		title: "Guess",
		img: "/images/categories/categories-03.png",
		href: "/tienda?category=guess",
	},
	{
		id: 12,
		title: "Reacondicionados",
		img: "/images/categories/categories-07.png",
		href: "/tienda?condition=like_new",
	},
];

export default data;

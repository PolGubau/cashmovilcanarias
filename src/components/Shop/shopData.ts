// Mock data matching ProductFull from Supabase.
// Products and images sourced from https://cashmovil.shop
// Replace with real Supabase queries when backend is ready.
// The `category` field maps directly to the products.category column in Supabase.
import type { ProductFull } from "@/lib/supabase/types";

const shopData: ProductFull[] = [
	// ── Smartphones ──────────────────────────────────────────────────────────
	{
		id: "a1b2c3d4-0001-0000-0000-000000000001",
		name: "Google Pixel 9a Seminuevo",
		brand: "Google",
		base_model: "Pixel 9a",
		category: "smartphone",
		description:
			'Google Pixel 9a seminuevo en perfecto estado. Cámara de 48 MP con IA, pantalla OLED de 6,3" y chip Google Tensor G4. Batería >85%.',
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16831-large_default/google-pixel-9a-seminuevo.jpg",
		variant_count: 2,
		total_stock: 5,
		price_from: 249.0,
		created_at: "2024-01-01T00:00:00.000Z",
		updated_at: "2024-01-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0002-0000-0000-000000000002",
		name: "iPhone 14 Plus 256GB Seminuevo",
		brand: "Apple",
		base_model: "iPhone 14 Plus",
		category: "smartphone",
		description:
			'iPhone 14 Plus seminuevo en estado excelente. Pantalla Super Retina XDR de 6,7", chip A15 Bionic y hasta 26h de batería.',
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16353-large_default/iphone-14-plus-256gb-seminuevo-.jpg",
		variant_count: 3,
		total_stock: 8,
		price_from: 449.0,
		created_at: "2024-01-01T00:00:00.000Z",
		updated_at: "2024-01-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0003-0000-0000-000000000003",
		name: "Samsung S25 Ultra Seminuevo",
		brand: "Samsung",
		base_model: "Galaxy S25 Ultra",
		category: "smartphone",
		description:
			'Galaxy S25 Ultra seminuevo con S Pen integrado, cámara de 200 MP, pantalla Dynamic AMOLED 2X de 6,9" y chip Snapdragon 8 Elite.',
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/14363-large_default/samsung-s25-ultra-seminuevo.jpg",
		variant_count: 2,
		total_stock: 4,
		price_from: 849.0,
		created_at: "2024-01-01T00:00:00.000Z",
		updated_at: "2024-01-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0004-0000-0000-000000000004",
		name: "Google Pixel 10 Pro Seminuevo",
		brand: "Google",
		base_model: "Pixel 10 Pro",
		category: "smartphone",
		description:
			'Google Pixel 10 Pro seminuevo. Cámara Pro de 50 MP con zoom 5x, pantalla LTPO OLED de 6,3" y chip Google Tensor G5.',
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16831-large_default/google-pixel-9a-seminuevo.jpg",
		variant_count: 2,
		total_stock: 3,
		price_from: 799.0,
		created_at: "2024-01-01T00:00:00.000Z",
		updated_at: "2024-01-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0005-0000-0000-000000000005",
		name: "iPhone 16 Pro Max 256GB",
		brand: "Apple",
		base_model: "iPhone 16 Pro Max",
		category: "smartphone",
		description:
			'iPhone 16 Pro Max con chip A18 Pro, cámara de 48 MP con zoom 5x, pantalla Super Retina XDR de 6,9" y titanio.',
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16353-large_default/iphone-14-plus-256gb-seminuevo-.jpg",
		variant_count: 3,
		total_stock: 6,
		price_from: 1299.0,
		created_at: "2024-01-01T00:00:00.000Z",
		updated_at: "2024-01-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0006-0000-0000-000000000006",
		name: "Samsung Galaxy A55 128GB",
		brand: "Samsung",
		base_model: "Galaxy A55",
		category: "smartphone",
		description:
			'Galaxy A55 con pantalla Super AMOLED de 6,6", triple cámara de 50 MP, resistencia IP67 y batería de 5000 mAh.',
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/14363-large_default/samsung-s25-ultra-seminuevo.jpg",
		variant_count: 2,
		total_stock: 18,
		price_from: 349.0,
		created_at: "2024-01-01T00:00:00.000Z",
		updated_at: "2024-01-01T00:00:00.000Z",
	},
	// ── Tablets ───────────────────────────────────────────────────────────────
	{
		id: "a1b2c3d4-0007-0000-0000-000000000007",
		name: 'Apple iPad Pro M4 11" 256GB',
		brand: "Apple",
		base_model: "iPad Pro M4 11-inch",
		category: "tablet",
		description:
			'iPad Pro con chip M4, pantalla Ultra Retina XDR OLED de 11" y conectividad WiFi 6E. El iPad más potente jamás creado.',
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16353-large_default/iphone-14-plus-256gb-seminuevo-.jpg",
		variant_count: 2,
		total_stock: 7,
		price_from: 1099.0,
		created_at: "2024-01-01T00:00:00.000Z",
		updated_at: "2024-01-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0008-0000-0000-000000000008",
		name: "Samsung Galaxy Tab S9 FE 128GB",
		brand: "Samsung",
		base_model: "Galaxy Tab S9 FE",
		category: "tablet",
		description:
			'Galaxy Tab S9 FE con pantalla TFT LCD de 10,9", S Pen incluido, resistencia IP68 y batería de 8000 mAh.',
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/14363-large_default/samsung-s25-ultra-seminuevo.jpg",
		variant_count: 2,
		total_stock: 11,
		price_from: 379.0,
		created_at: "2024-01-01T00:00:00.000Z",
		updated_at: "2024-01-01T00:00:00.000Z",
	},
	// ── Smartwatch ────────────────────────────────────────────────────────────
	{
		id: "a1b2c3d4-0009-0000-0000-000000000009",
		name: "Apple Watch SE 3 GPS 40mm",
		brand: "Apple",
		base_model: "Apple Watch SE 3",
		category: "smartwatch",
		description:
			"Apple Watch SE 3 GPS con chip S9, detección de caída y accidentes de tráfico, monitorización de frecuencia cardíaca y altímetro.",
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16749-large_default/apple-watch-se-3-gps-.jpg",
		variant_count: 3,
		total_stock: 9,
		price_from: 199.0,
		created_at: "2024-02-01T00:00:00.000Z",
		updated_at: "2024-02-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0010-0000-0000-000000000010",
		name: "Smartwatch HiFuture Vela",
		brand: "HiFuture",
		base_model: "HiFuture Vela",
		category: "smartwatch",
		description:
			"Smartwatch HiFuture Vela con pantalla AMOLED, monitorización de salud avanzada, GPS integrado y hasta 7 días de autonomía.",
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16749-large_default/apple-watch-se-3-gps-.jpg",
		variant_count: 2,
		total_stock: 6,
		price_from: 79.9,
		created_at: "2024-02-01T00:00:00.000Z",
		updated_at: "2024-02-01T00:00:00.000Z",
	},
	// ── Auriculares ───────────────────────────────────────────────────────────
	{
		id: "a1b2c3d4-0011-0000-0000-000000000011",
		name: "Auriculares OWS Ai306",
		brand: "WIWU",
		base_model: "WIWU Ai306 OWS",
		category: "auriculares",
		description:
			"Auriculares de conducción ósea OWS con diseño abierto, graves potentes, hasta 10h de reproducción y resistencia al sudor.",
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16868-large_default/auriculares-ows-ai306.jpg",
		variant_count: 2,
		total_stock: 15,
		price_from: 33.9,
		created_at: "2024-02-01T00:00:00.000Z",
		updated_at: "2024-02-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0012-0000-0000-000000000012",
		name: "Guess Auricular Bluetooth TWS ENC 4G Logo",
		brand: "Guess",
		base_model: "Guess TWS ENC 4G",
		category: "auriculares",
		description:
			"Auriculares TWS Guess con cancelación activa de ruido ENC, logo 4G metálico, estuche de carga y hasta 24h de autonomía total.",
		warranty_months: 12,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16868-large_default/auriculares-ows-ai306.jpg",
		variant_count: 1,
		total_stock: 10,
		price_from: 34.95,
		created_at: "2024-02-01T00:00:00.000Z",
		updated_at: "2024-02-01T00:00:00.000Z",
	},
	// ── Fundas y Protectores ──────────────────────────────────────────────────
	{
		id: "a1b2c3d4-0013-0000-0000-000000000013",
		name: "Funda iPhone 15 Pro Silicona",
		brand: "Apple",
		base_model: "Funda iPhone 15 Pro",
		category: "fundas_protectores",
		description:
			"Funda de silicona compatible con iPhone 15 Pro. Material suave con interior de microfibra, protección de bordes y esquinas.",
		warranty_months: 0,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16764-large_default/guess-colgante-muneca-4g-charm.jpg",
		variant_count: 4,
		total_stock: 40,
		price_from: 29.0,
		created_at: "2024-03-01T00:00:00.000Z",
		updated_at: "2024-03-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0014-0000-0000-000000000014",
		name: "Cristal Templado Samsung S25 Ultra",
		brand: "Samsung",
		base_model: "Protector S25 Ultra",
		category: "fundas_protectores",
		description:
			"Protector de pantalla de cristal templado 9H con bordes curvados para Samsung Galaxy S25 Ultra. Instalación sencilla.",
		warranty_months: 0,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16764-large_default/guess-colgante-muneca-4g-charm.jpg",
		variant_count: 1,
		total_stock: 60,
		price_from: 9.9,
		created_at: "2024-03-01T00:00:00.000Z",
		updated_at: "2024-03-01T00:00:00.000Z",
	},
	// ── Cargadores y Cables ───────────────────────────────────────────────────
	{
		id: "a1b2c3d4-0015-0000-0000-000000000015",
		name: "Cargador USB-C 65W GaN",
		brand: "Genérico",
		base_model: "Cargador GaN 65W",
		category: "cargadores_cables",
		description:
			"Cargador USB-C GaN de 65W compatible con iPhone, Samsung, Xiaomi y portátiles. Carga rápida PD 3.0. Compacto y ligero.",
		warranty_months: 6,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16862-large_default/powerbank-ultrafino-5000mah-naranja.jpg",
		variant_count: 1,
		total_stock: 35,
		price_from: 25.0,
		created_at: "2024-03-01T00:00:00.000Z",
		updated_at: "2024-03-01T00:00:00.000Z",
	},
	// ── Power Bank ────────────────────────────────────────────────────────────
	{
		id: "a1b2c3d4-0016-0000-0000-000000000016",
		name: "Powerbank Ultrafino 5000mAh",
		brand: "WIWU",
		base_model: "WIWU PowerBank Slim 5000",
		category: "power_bank",
		description:
			"Batería externa ultrafina WIWU de 5000 mAh. Compatible con MagSafe y Qi, carga inalámbrica 15W. Diseño compacto en color naranja.",
		warranty_months: 6,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16862-large_default/powerbank-ultrafino-5000mah-naranja.jpg",
		variant_count: 3,
		total_stock: 20,
		price_from: 29.9,
		created_at: "2024-03-01T00:00:00.000Z",
		updated_at: "2024-03-01T00:00:00.000Z",
	},
	// ── Guess ─────────────────────────────────────────────────────────────────
	{
		id: "a1b2c3d4-0017-0000-0000-000000000017",
		name: "Guess Colgante Muñeca 4G Charm",
		brand: "Guess",
		base_model: "Guess 4G Charm Wristlet",
		category: "guess",
		description:
			"Colgante de muñeca Guess colección 4G Charm. Fabricado en piel sintética con logo metálico. Disponible en rosa y negro.",
		warranty_months: 0,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16764-large_default/guess-colgante-muneca-4g-charm.jpg",
		variant_count: 2,
		total_stock: 14,
		price_from: 12.9,
		created_at: "2024-04-01T00:00:00.000Z",
		updated_at: "2024-04-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0018-0000-0000-000000000018",
		name: "Guess Auricular Bluetooth TWS ENC 4G Logo",
		brand: "Guess",
		base_model: "Guess TWS ENC 4G Logo",
		category: "guess",
		description:
			"Auriculares Bluetooth Guess TWS con cancelación de ruido ENC, logo 4G dorado, estuche de carga y hasta 24h de batería total.",
		warranty_months: 6,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16868-large_default/auriculares-ows-ai306.jpg",
		variant_count: 1,
		total_stock: 9,
		price_from: 34.95,
		created_at: "2024-04-01T00:00:00.000Z",
		updated_at: "2024-04-01T00:00:00.000Z",
	},
	{
		id: "a1b2c3d4-0019-0000-0000-000000000019",
		name: "Guess Funda iPhone 16 Pro Max 4G",
		brand: "Guess",
		base_model: "Guess iPhone 16 Pro Max 4G",
		category: "guess",
		description:
			"Funda Guess para iPhone 16 Pro Max colección 4G Logo. Piel sintética con logo metálico, acabado premium y protección de bordes.",
		warranty_months: 0,
		is_published: true,
		primary_image_url:
			"https://cashmovil.shop/16764-large_default/guess-colgante-muneca-4g-charm.jpg",
		variant_count: 3,
		total_stock: 12,
		price_from: 44.95,
		created_at: "2024-04-01T00:00:00.000Z",
		updated_at: "2024-04-01T00:00:00.000Z",
	},
];

export default shopData;

export type UserRole = "admin" | "staff" | "customer";
export type ProductCondition = "new" | "excellent" | "good" | "fair";
export type DeviceCondition =
	| "new"
	| "excellent"
	| "good"
	| "fair"
	| "poor"
	| "parts_only";
export type DeviceStatus =
	| "purchased"
	| "in_stock"
	| "reserved"
	| "sold"
	| "in_repair"
	| "returned"
	| "written_off";
export type RepairStatus =
	| "received"
	| "diagnosing"
	| "waiting_parts"
	| "in_progress"
	| "ready"
	| "delivered"
	| "cancelled";
export type OrderStatus =
	| "pending"
	| "confirmed"
	| "completed"
	| "cancelled"
	| "refunded";
export type MovementReason =
	| "purchase"
	| "sale"
	| "repair_in"
	| "repair_out"
	| "return"
	| "write_off"
	| "correction"
	| "reservation"
	| "reservation_cancelled";

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: Profile;
				Insert: ProfileInsert;
				Update: ProfileUpdate;
				Relationships: [];
			};
			customers: {
				Row: Customer;
				Insert: CustomerInsert;
				Update: CustomerUpdate;
				Relationships: [];
			};
			devices: {
				Row: Device;
				Insert: DeviceInsert;
				Update: DeviceUpdate;
				Relationships: [];
			};
			stock_movements: {
				Row: StockMovement;
				Insert: StockMovementInsert;
				Update: never;
				Relationships: [];
			};
			repairs: {
				Row: Repair;
				Insert: RepairInsert;
				Update: RepairUpdate;
				Relationships: [];
			};
			orders: {
				Row: Order;
				Insert: OrderInsert;
				Update: OrderUpdate;
				Relationships: [];
			};
			order_items: {
				Row: OrderItem;
				Insert: OrderItemInsert;
				Update: OrderItemUpdate;
				Relationships: [];
			};
			products: {
				Row: Product;
				Insert: ProductInsert;
				Update: ProductUpdate;
				Relationships: [];
			};
			product_variants: {
				Row: ProductVariant;
				Insert: ProductVariantInsert;
				Update: ProductVariantUpdate;
				Relationships: [];
			};
			product_images: {
				Row: ProductImage;
				Insert: ProductImageInsert;
				Update: never;
				Relationships: [];
			};
		};
		Views: {
			v_inventory_status: { Row: InventoryStatusView; Relationships: [] };
			v_devices_full: { Row: DeviceFull; Relationships: [] };
			v_orders_full: { Row: OrderFull; Relationships: [] };
			v_repairs_full: { Row: RepairFull; Relationships: [] };
			v_device_margins: { Row: DeviceMargin; Relationships: [] };
			v_products_full: { Row: ProductFull; Relationships: [] };
			v_customer_history: { Row: CustomerHistoryItem; Relationships: [] };
		};
		Functions: Record<
			string,
			{ Args: Record<string, unknown>; Returns: unknown }
		>;
		Enums: Record<string, string[]>;
		CompositeTypes: Record<string, Record<string, unknown>>;
	};
}

export interface Profile {
	id: string;
	role: UserRole;
	full_name: string | null;
	phone: string | null;
	avatar_url: string | null;
	created_at: string;
	updated_at: string;
}
export type ProfileInsert = Omit<Profile, "created_at" | "updated_at">;
export type ProfileUpdate = Partial<ProfileInsert>;

export interface Customer {
	id: string;
	user_id: string | null;
	full_name: string;
	phone: string | null;
	email: string | null;
	dni: string | null;
	address: string | null;
	city: string | null;
	postal_code: string | null;
	notes: string | null;
	is_supplier: boolean;
	created_at: string;
	updated_at: string;
}
export type CustomerInsert = Omit<Customer, "id" | "created_at" | "updated_at">;
export type CustomerUpdate = Partial<CustomerInsert>;

export interface Device {
	id: string;
	imei: string;
	imei2: string | null;
	brand: string;
	model: string;
	storage_gb: number | null;
	color: string | null;
	condition: DeviceCondition;
	status: DeviceStatus;
	cost_price: number;
	purchase_date: string;
	supplier_id: string | null;
	purchase_invoice: string | null;
	sale_price: number | null;
	sold_at: string | null;
	buyer_id: string | null;
	unlock_status: string | null;
	battery_health: number | null;
	notes: string | null;
	images: string[] | null;
	created_by: string | null;
	created_at: string;
	updated_at: string;
}
export type DeviceInsert = Omit<Device, "id" | "created_at" | "updated_at">;
export type DeviceUpdate = Partial<DeviceInsert>;

export interface StockMovement {
	id: string;
	device_id: string;
	from_status: DeviceStatus | null;
	to_status: DeviceStatus;
	reason: MovementReason;
	actor_id: string | null;
	reference_id: string | null;
	reference_type: string | null;
	notes: string | null;
	created_at: string;
}
export type StockMovementInsert = Omit<StockMovement, "id" | "created_at">;

export interface Repair {
	id: string;
	device_id: string | null;
	customer_id: string;
	device_brand: string | null;
	device_model: string | null;
	device_imei: string | null;
	status: RepairStatus;
	description: string;
	diagnosis: string | null;
	solution: string | null;
	parts_used: string[] | null;
	budget: number | null;
	cost: number | null;
	deposit_paid: number;
	warranty_days: number;
	warranty_expires_at: string | null;
	received_at: string;
	diagnosed_at: string | null;
	completed_at: string | null;
	delivered_at: string | null;
	estimated_ready_at: string | null;
	assigned_to: string | null;
	created_by: string | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
}
export type RepairInsert = Omit<Repair, "id" | "created_at" | "updated_at">;
export type RepairUpdate = Partial<RepairInsert>;

export interface Order {
	id: string;
	customer_id: string;
	status: OrderStatus;
	subtotal: number;
	discount: number;
	total: number;
	payment_method: string | null;
	payment_reference: string | null;
	paid_at: string | null;
	invoice_number: string | null;
	notes: string | null;
	created_by: string | null;
	created_at: string;
	updated_at: string;
}
export type OrderInsert = Omit<
	Order,
	"id" | "created_at" | "updated_at" | "invoice_number"
>;
export type OrderUpdate = Partial<OrderInsert>;

export interface OrderItem {
	id: string;
	order_id: string;
	device_id: string;
	price_sold: number;
	margin: number | null;
	notes: string | null;
	created_at: string;
}
export type OrderItemInsert = Omit<OrderItem, "id" | "created_at" | "margin">;
export type OrderItemUpdate = Partial<OrderItemInsert>;

// View types
export interface InventoryStatusView {
	status: DeviceStatus;
	count: number;
	total_cost: number;
	avg_cost: number;
}
export interface DeviceFull extends Device {
	supplier_name: string | null;
	supplier_phone: string | null;
	supplier_dni: string | null;
	buyer_name: string | null;
	buyer_phone: string | null;
}
export interface OrderFull extends Order {
	customer_name: string;
	customer_phone: string | null;
	customer_email: string | null;
	item_count: number;
}
export interface RepairFull extends Repair {
	customer_name: string;
	customer_phone: string | null;
	resolved_brand: string | null;
	resolved_model: string | null;
	resolved_imei: string | null;
}
export interface DeviceMargin {
	id: string;
	imei: string;
	brand: string;
	model: string;
	cost_price: number;
	price_sold: number;
	margin: number;
	margin_pct: number;
	invoice_number: string;
	paid_at: string | null;
	buyer_name: string;
}

// ─── Products & Variants ─────────────────────────────────────────────────────

export interface Product {
	id: string;
	name: string;
	brand: string;
	base_model: string;
	description: string | null;
	warranty_months: number;
	is_published: boolean;
	created_at: string;
	updated_at: string;
}
export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at">;
export type ProductUpdate = Partial<ProductInsert>;

export interface ProductVariant {
	id: string;
	product_id: string;
	capacity: string | null;
	color: string | null;
	condition: ProductCondition | null;
	battery_health: number | null;
	stock: number;
	price: number;
	purchase_price: number | null;
	sku: string | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}
export type ProductVariantInsert = Omit<
	ProductVariant,
	"id" | "created_at" | "updated_at"
>;
export type ProductVariantUpdate = Partial<ProductVariantInsert>;

export interface ProductImage {
	id: string;
	product_id: string;
	url: string;
	alt: string | null;
	sort_order: number;
	is_primary: boolean;
	created_at: string;
}
export type ProductImageInsert = Omit<ProductImage, "id" | "created_at">;

export interface ProductFull extends Product {
	primary_image_url: string | null;
	variant_count: number;
	total_stock: number;
	price_from: number | null;
}

export interface CustomerHistoryItem {
	customer_id: string;
	order_id: string;
	order_date: string;
	total: number;
	order_status: string;
	invoice_number: string | null;
	device_id: string;
	brand: string;
	model: string;
	imei: string;
	condition: string;
	price_sold: number;
	warranty_months: number | null;
	warranty_expires_at: string | null;
}

import { readFileSync } from "node:fs";
// scripts/seed.mjs — Seed realista para CashMóvil Canarias
// Uso: node scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";

// Lee las vars desde .env.local (split sólo en el primer '=' para JWTs con '=')
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#") && l.trim() !== "")
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ── 1. CLIENTES & PROVEEDORES ─────────────────────────────────────────────────
const CUSTOMERS_DATA = [
  // Proveedores
  { full_name: "TechReuse Canarias SL", phone: "928100001", email: "compras@techreuse.es", dni: "B76543210", address: "Pol. Ind. Arinaga, Nave 12", city: "Agüimes", postal_code: "35118", is_supplier: true, notes: "Proveedor principal iPhone/Samsung" },
  { full_name: "MoviRecycle Madrid", phone: "911200002", email: "ventas@movirecycle.com", dni: "B12345678", address: "Calle Alcalá 200", city: "Madrid", postal_code: "28009", is_supplier: true, notes: "Lotes de reacondicionados. Pago 30 días" },
  { full_name: "Phone4U Barcelona", phone: "934500003", email: "stock@phone4u.es", dni: "B87654321", address: "Gran Via 450", city: "Barcelona", postal_code: "08015", is_supplier: true, notes: "Especialista Xiaomi y Google Pixel" },
  // Clientes
  { full_name: "Carlos Rodríguez Pérez", phone: "928611001", email: "carlos.rodriguez@gmail.com", dni: "42123456A", address: "C/ Mesa y López 34, 3ºB", city: "Las Palmas de GC", postal_code: "35006", is_supplier: false, notes: null },
  { full_name: "María González Martín", phone: "928722002", email: "maria.gonzalez@hotmail.com", dni: "42234567B", address: "Av. de Canarias 12, 1ºA", city: "Telde", postal_code: "35200", is_supplier: false, notes: null },
  { full_name: "Jorge Hernández López", phone: "922833003", email: "jorge.hernandez@yahoo.es", dni: "78345678C", address: "C/ Castillo 45, 4ºC", city: "Santa Cruz de Tf.", postal_code: "38003", is_supplier: false, notes: "Prefiere contacto por WhatsApp" },
  { full_name: "Ana Pérez Rodríguez", phone: "928944004", email: "ana.perez@gmail.com", dni: "42456789D", address: "C/ León y Castillo 8", city: "Arrecife", postal_code: "35500", is_supplier: false, notes: null },
  { full_name: "Luis Suárez Díaz", phone: "928055005", email: "luis.suarez@icloud.com", dni: "42567890E", address: "Av. Primero de Mayo 22", city: "Puerto del Rosario", postal_code: "35600", is_supplier: false, notes: null },
  { full_name: "Elena Martín García", phone: "928166006", email: "elena.martin@gmail.com", dni: "42678901F", address: "C/ Triana 67, 2ºD", city: "Las Palmas de GC", postal_code: "35002", is_supplier: false, notes: "Cliente recurrente. VIP" },
  { full_name: "David Ramírez Torres", phone: "922277007", email: "david.ramirez@gmail.com", dni: "78789012G", address: "Rambla del Pulido 5", city: "Santa Cruz de Tf.", postal_code: "38004", is_supplier: false, notes: null },
  { full_name: "Sofía López Fernández", phone: "922388008", email: "sofia.lopez@outlook.com", dni: "78890123H", address: "C/ Noria 3, 1ºA", city: "La Laguna", postal_code: "38200", is_supplier: false, notes: null },
  { full_name: "Alejandro García Ruiz", phone: "928499009", email: "alejandro.garcia@gmail.com", dni: "42901234I", address: "C/ Mayor de Triana 89", city: "Las Palmas de GC", postal_code: "35002", is_supplier: false, notes: null },
  { full_name: "Carmen Torres Jiménez", phone: "928510010", email: "carmen.torres@gmail.com", dni: "42012345J", address: "C/ Albareda 14, 3ºB", city: "Las Palmas de GC", postal_code: "35007", is_supplier: false, notes: null },
  { full_name: "Roberto Sánchez Moreno", phone: "928621011", email: "roberto.sanchez@yahoo.es", dni: "42123450K", address: "C/ Real 56", city: "Arrecife", postal_code: "35500", is_supplier: false, notes: null },
  { full_name: "Isabel Díaz Castro", phone: "928732012", email: "isabel.diaz@gmail.com", dni: "42234561L", address: "Av. de la Constitución 3", city: "Las Palmas de GC", postal_code: "35010", is_supplier: false, notes: null },
  { full_name: "Marcos Vera Álvarez", phone: "922843013", email: "marcos.vera@gmail.com", dni: "78345672M", address: "C/ Bethencourt Alfonso 12", "city": "Santa Cruz de Tf.", postal_code: "38001", is_supplier: false, notes: null },
  { full_name: "Patricia Fuentes Reyes", phone: "928954014", email: "patricia.fuentes@hotmail.com", dni: "42456783N", address: "Av. Juan XXIII 7", city: "Las Palmas de GC", postal_code: "35004", is_supplier: false, notes: "Estudiante universitaria" },
];

// ── 2. DISPOSITIVOS (inventario físico con IMEI) ──────────────────────────────
// Se construyen después de insertar clientes, referenciando sus IDs.
function buildDevices(sup) {
  // sup[0]=TechReuse, sup[1]=MoviRecycle, sup[2]=Phone4U
  return [
    // ── EN STOCK ──────────────────────────────────────────────────────────────
    { imei: "351234560000001", brand: "Apple", model: "iPhone 14 Pro", storage_gb: 128, color: "Space Black", condition: "excellent", status: "in_stock", cost_price: 520, sale_price: null, purchase_date: daysAgo(45), supplier_id: sup[0], battery_health: 91, notes: "Face ID OK. Sin rayones." },
    { imei: "351234560000002", brand: "Apple", model: "iPhone 13", storage_gb: 256, color: "Midnight", condition: "good", status: "in_stock", cost_price: 310, sale_price: null, purchase_date: daysAgo(30), supplier_id: sup[0], battery_health: 84, notes: "Pequeña marca en marco." },
    { imei: "351234560000003", brand: "Samsung", model: "Galaxy S24 Ultra", storage_gb: 256, color: "Titanium Gray", condition: "excellent", status: "in_stock", cost_price: 680, sale_price: null, purchase_date: daysAgo(20), supplier_id: sup[1], battery_health: 95, notes: "Como nuevo. Completo." },
    { imei: "351234560000004", brand: "Samsung", model: "Galaxy S23+", storage_gb: 256, color: "Cream", condition: "good", status: "in_stock", cost_price: 390, sale_price: null, purchase_date: daysAgo(35), supplier_id: sup[1], battery_health: 88, notes: null },
    { imei: "351234560000005", brand: "Xiaomi", model: "13T Pro", storage_gb: 256, color: "Alpine Blue", condition: "excellent", status: "in_stock", cost_price: 290, sale_price: null, purchase_date: daysAgo(15), supplier_id: sup[2], battery_health: 93, notes: "Completo con caja." },
    { imei: "351234560000006", brand: "Google", model: "Pixel 8 Pro", storage_gb: 128, color: "Bay", condition: "excellent", status: "in_stock", cost_price: 480, sale_price: null, purchase_date: daysAgo(10), supplier_id: sup[2], battery_health: 97, notes: "Sin uso prácticamente." },
    { imei: "351234560000007", brand: "Apple", model: "iPhone 15", storage_gb: 128, color: "Pink", condition: "excellent", status: "in_stock", cost_price: 590, sale_price: null, purchase_date: daysAgo(8), supplier_id: sup[0], battery_health: 96, notes: null },
    { imei: "351234560000008", brand: "Samsung", model: "Galaxy A55", storage_gb: 128, color: "Navy", condition: "good", status: "in_stock", cost_price: 195, sale_price: null, purchase_date: daysAgo(22), supplier_id: sup[1], battery_health: 87, notes: "Batería rebajada." },
    // ── VENDIDOS ─────────────────────────────────────────────────────────────
    { imei: "351234560000011", brand: "Apple", model: "iPhone 14", storage_gb: 128, color: "Midnight", condition: "good", status: "sold", cost_price: 380, sale_price: 499, sold_at: daysAgo(5), purchase_date: daysAgo(60), supplier_id: sup[0], battery_health: 85, notes: null },
    { imei: "351234560000012", brand: "Apple", model: "iPhone 13 mini", storage_gb: 128, color: "Blue", condition: "good", status: "sold", cost_price: 240, sale_price: 319, sold_at: daysAgo(8), purchase_date: daysAgo(55), supplier_id: sup[0], battery_health: 82, notes: null },
    { imei: "351234560000013", brand: "Samsung", model: "Galaxy S23", storage_gb: 128, color: "Phantom Black", condition: "excellent", status: "sold", cost_price: 420, sale_price: 549, sold_at: daysAgo(12), purchase_date: daysAgo(50), supplier_id: sup[1], battery_health: 90, notes: null },
    { imei: "351234560000014", brand: "Xiaomi", model: "Redmi Note 13 Pro", storage_gb: 256, color: "Aurora Purple", condition: "good", status: "sold", cost_price: 155, sale_price: 219, sold_at: daysAgo(15), purchase_date: daysAgo(45), supplier_id: sup[2], battery_health: 86, notes: null },
    { imei: "351234560000015", brand: "Apple", model: "iPhone 12", storage_gb: 64, color: "White", condition: "fair", status: "sold", cost_price: 180, sale_price: 259, sold_at: daysAgo(18), purchase_date: daysAgo(70), supplier_id: sup[0], battery_health: 78, notes: "Batería algo baja." },
    { imei: "351234560000016", brand: "Samsung", model: "Galaxy A54", storage_gb: 128, color: "Awesome Lime", condition: "good", status: "sold", cost_price: 165, sale_price: 229, sold_at: daysAgo(22), purchase_date: daysAgo(40), supplier_id: sup[1], battery_health: 89, notes: null },
    { imei: "351234560000017", brand: "Google", model: "Pixel 7", storage_gb: 128, color: "Obsidian", condition: "excellent", status: "sold", cost_price: 290, sale_price: 379, sold_at: daysAgo(28), purchase_date: daysAgo(65), supplier_id: sup[2], battery_health: 92, notes: null },
    { imei: "351234560000018", brand: "Apple", model: "iPhone 14 Plus", storage_gb: 256, color: "Purple", condition: "excellent", status: "sold", cost_price: 450, sale_price: 579, sold_at: daysAgo(32), purchase_date: daysAgo(75), supplier_id: sup[0], battery_health: 94, notes: null },
    { imei: "351234560000019", brand: "Apple", model: "iPhone 13 Pro", storage_gb: 256, color: "Sierra Blue", condition: "good", status: "sold", cost_price: 400, sale_price: 519, sold_at: daysAgo(38), purchase_date: daysAgo(80), supplier_id: sup[0], battery_health: 83, notes: null },
    { imei: "351234560000020", brand: "Samsung", model: "Galaxy S22", storage_gb: 128, color: "White", condition: "good", status: "sold", cost_price: 280, sale_price: 359, sold_at: daysAgo(42), purchase_date: daysAgo(85), supplier_id: sup[1], battery_health: 87, notes: null },
    { imei: "351234560000021", brand: "Xiaomi", model: "13", storage_gb: 256, color: "Black", condition: "excellent", status: "sold", cost_price: 320, sale_price: 409, sold_at: daysAgo(50), purchase_date: daysAgo(90), supplier_id: sup[2], battery_health: 95, notes: null },
    { imei: "351234560000022", brand: "Apple", model: "iPhone 12 Pro", storage_gb: 128, color: "Pacific Blue", condition: "good", status: "sold", cost_price: 290, sale_price: 369, sold_at: daysAgo(58), purchase_date: daysAgo(95), supplier_id: sup[0], battery_health: 80, notes: null },
    { imei: "351234560000023", brand: "Samsung", model: "Galaxy S21 FE", storage_gb: 128, color: "Graphite", condition: "fair", status: "sold", cost_price: 145, sale_price: 199, sold_at: daysAgo(65), purchase_date: daysAgo(100), supplier_id: sup[1], battery_health: 76, notes: null },
    { imei: "351234560000024", brand: "Apple", model: "iPhone 15 Pro", storage_gb: 256, color: "Natural Titanium", condition: "excellent", status: "sold", cost_price: 750, sale_price: 949, sold_at: daysAgo(3), purchase_date: daysAgo(25), supplier_id: sup[0], battery_health: 98, notes: "Prácticamente nuevo." },
    // ── EN REPARACIÓN ────────────────────────────────────────────────────────
    { imei: "351234560000031", brand: "Apple", model: "iPhone 11", storage_gb: 64, color: "Black", condition: "fair", status: "in_repair", cost_price: 130, sale_price: null, purchase_date: daysAgo(5), supplier_id: null, battery_health: 68, notes: "Pantalla rota." },
    { imei: "351234560000032", brand: "Samsung", model: "Galaxy A52s", storage_gb: 128, color: "Awesome Black", condition: "fair", status: "in_repair", cost_price: 90, sale_price: null, purchase_date: daysAgo(3), supplier_id: null, battery_health: 75, notes: "No carga." },
    // ── RESERVADOS ───────────────────────────────────────────────────────────
    { imei: "351234560000041", brand: "Apple", model: "iPhone 14 Pro Max", storage_gb: 256, color: "Deep Purple", condition: "excellent", status: "reserved", cost_price: 650, sale_price: 829, purchase_date: daysAgo(18), supplier_id: sup[0], battery_health: 93, notes: "Reservado para cliente." },
  ];
}

// ── 3. REPARACIONES (sin device del inventario propio) ────────────────────────
function buildRepairs(customerIds) {
  const [, , , c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14] = customerIds;
  return [
    { customer_id: c1, device_brand: "Apple", device_model: "iPhone X", device_imei: "359876540000001", status: "delivered", description: "Pantalla rota, no táctil", diagnosis: "Pantalla LCD dañada por golpe", solution: "Cambio de pantalla original", parts_used: ["Pantalla iPhone X"], budget: 89, cost: 72, deposit_paid: 30, warranty_days: 90, received_at: daysAgo(70), diagnosed_at: daysAgo(69), completed_at: daysAgo(67), delivered_at: daysAgo(65), warranty_expires_at: daysAgo(-20), notes: null },
    { customer_id: c2, device_brand: "Samsung", device_model: "Galaxy S20", device_imei: "359876540000002", status: "delivered", description: "Batería no carga", diagnosis: "Batería hinchada", solution: "Sustitución batería original", parts_used: ["Batería Samsung S20"], budget: 65, cost: 48, deposit_paid: 20, warranty_days: 90, received_at: daysAgo(55), diagnosed_at: daysAgo(54), completed_at: daysAgo(52), delivered_at: daysAgo(50), warranty_expires_at: daysAgo(-35), notes: null },
    { customer_id: c3, device_brand: "Apple", device_model: "iPhone 12", device_imei: "359876540000003", status: "delivered", description: "Conector carga no funciona", diagnosis: "Puerto lightning oxidado", solution: "Cambio conector carga", parts_used: ["Conector Lightning"], budget: 55, cost: 40, deposit_paid: 20, warranty_days: 90, received_at: daysAgo(45), diagnosed_at: daysAgo(44), completed_at: daysAgo(42), delivered_at: daysAgo(40), warranty_expires_at: daysAgo(-45), notes: null },
    { customer_id: c4, device_brand: "Xiaomi", device_model: "Redmi Note 10 Pro", device_imei: "359876540000004", status: "ready", description: "Pantalla con manchas", diagnosis: "LCD dañado internamente", solution: "Pantalla de reemplazo colocada", parts_used: ["Pantalla Redmi Note 10 Pro"], budget: 75, cost: 58, deposit_paid: 30, warranty_days: 90, received_at: daysAgo(10), diagnosed_at: daysAgo(9), completed_at: daysAgo(7), delivered_at: null, estimated_ready_at: daysAgo(-1), notes: "Cliente avisado por WhatsApp" },
    { customer_id: c5, device_brand: "Apple", device_model: "iPhone 13", device_imei: "359876540000005", status: "in_progress", description: "Cámara trasera no enfoca", diagnosis: "Módulo de cámara defectuoso", solution: null, parts_used: [], budget: 110, cost: null, deposit_paid: 40, warranty_days: 90, received_at: daysAgo(5), diagnosed_at: daysAgo(4), completed_at: null, delivered_at: null, estimated_ready_at: daysAgo(-3), notes: null },
    { customer_id: c6, device_brand: "Samsung", device_model: "Galaxy A53", device_imei: "359876540000006", status: "diagnosing", description: "Se apaga solo", diagnosis: null, solution: null, parts_used: [], budget: null, cost: null, deposit_paid: 0, warranty_days: 90, received_at: daysAgo(2), diagnosed_at: null, completed_at: null, delivered_at: null, estimated_ready_at: daysAgo(-5), notes: "Pendiente diagnóstico" },
    { customer_id: c7, device_brand: "Apple", device_model: "iPhone 11 Pro", device_imei: "359876540000007", status: "waiting_parts", description: "Face ID no funciona", diagnosis: "Flex Face ID dañado", solution: null, parts_used: [], budget: 95, cost: null, deposit_paid: 40, warranty_days: 90, received_at: daysAgo(8), diagnosed_at: daysAgo(7), completed_at: null, delivered_at: null, estimated_ready_at: daysAgo(-4), notes: "Pendiente pieza de proveedor" },
    { customer_id: c8, device_brand: "Samsung", device_model: "Galaxy S21", device_imei: "359876540000008", status: "received", description: "Pantalla parpadeante", diagnosis: null, solution: null, parts_used: [], budget: null, cost: null, deposit_paid: 0, warranty_days: 90, received_at: daysAgo(1), diagnosed_at: null, completed_at: null, delivered_at: null, estimated_ready_at: daysAgo(-6), notes: null },
  ];
}

// ── 4. ÓRDENES ────────────────────────────────────────────────────────────────
// Se construyen después de devices e insertar los datos
function buildOrders(customerIds) {
  const [, , , c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14] = customerIds;
  // Pares [customer_id, imei_device, price_sold, days_ago, payment_method]
  return [
    { customer_id: c1, status: "completed", discount: 0, payment_method: "tarjeta", daysAgoN: 5 },
    { customer_id: c2, status: "completed", discount: 0, payment_method: "efectivo", daysAgoN: 8 },
    { customer_id: c3, status: "completed", discount: 20, payment_method: "tarjeta", daysAgoN: 12 },
    { customer_id: c4, status: "completed", discount: 0, payment_method: "bizum", daysAgoN: 15 },
    { customer_id: c5, status: "completed", discount: 10, payment_method: "tarjeta", daysAgoN: 18 },
    { customer_id: c6, status: "completed", discount: 0, payment_method: "efectivo", daysAgoN: 22 },
    { customer_id: c7, status: "completed", discount: 0, payment_method: "tarjeta", daysAgoN: 28 },
    { customer_id: c8, status: "completed", discount: 25, payment_method: "bizum", daysAgoN: 32 },
    { customer_id: c9, status: "completed", discount: 0, payment_method: "tarjeta", daysAgoN: 38 },
    { customer_id: c10, status: "completed", discount: 0, payment_method: "efectivo", daysAgoN: 42 },
    { customer_id: c11, status: "completed", discount: 0, payment_method: "tarjeta", daysAgoN: 50 },
    { customer_id: c12, status: "completed", discount: 15, payment_method: "tarjeta", daysAgoN: 58 },
    { customer_id: c13, status: "completed", discount: 0, payment_method: "bizum", daysAgoN: 65 },
    { customer_id: c14, status: "completed", discount: 0, payment_method: "tarjeta", daysAgoN: 3 },
  ];
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Iniciando seed de CashMóvil Canarias…\n");

  // 1. Clientes
  console.log("👥 Insertando clientes y proveedores…");
  const { data: customers, error: cErr } = await supabase
    .from("customers")
    .insert(CUSTOMERS_DATA)
    .select("id");
  if (cErr) { console.error("❌ Clientes:", cErr.message); process.exit(1); }
  const cIds = customers.map((c) => c.id);
  console.log(`   ✅ ${cIds.length} clientes insertados`);

  // 2. Dispositivos
  console.log("📱 Insertando inventario de dispositivos…");
  const supIds = [cIds[0], cIds[1], cIds[2]]; // TechReuse, MoviRecycle, Phone4U
  const devicesData = buildDevices(supIds);
  const { data: devices, error: dErr } = await supabase
    .from("devices")
    .insert(devicesData)
    .select("id, imei, status, cost_price, sale_price, sold_at");
  if (dErr) { console.error("❌ Dispositivos:", dErr.message); process.exit(1); }
  console.log(`   ✅ ${devices.length} dispositivos insertados`);

  // 3. Órdenes + order_items ligando dispositivos vendidos a clientes
  console.log("🛒 Insertando órdenes de venta…");
  const soldDevices = devices.filter((d) => d.status === "sold");
  const orderTemplates = buildOrders(cIds);
  let ordersCreated = 0;

  for (let i = 0; i < Math.min(soldDevices.length, orderTemplates.length); i++) {
    const dev = soldDevices[i];
    const tmpl = orderTemplates[i];
    const subtotal = dev.sale_price;
    const total = subtotal - tmpl.discount;
    const paidAt = daysAgo(tmpl.daysAgoN);

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        customer_id: tmpl.customer_id,
        status: tmpl.status,
        subtotal,
        discount: tmpl.discount,
        total,
        payment_method: tmpl.payment_method,
        paid_at: paidAt,
        notes: null,
        created_by: null,
        payment_reference: null,
      })
      .select("id")
      .single();
    if (oErr) { console.warn(`   ⚠️  Orden ${i + 1}: ${oErr.message}`); continue; }

    // Actualizar buyer_id del dispositivo
    await supabase.from("devices").update({ buyer_id: tmpl.customer_id }).eq("id", dev.id);

    const { error: iErr } = await supabase.from("order_items").insert({
      order_id: order.id,
      device_id: dev.id,
      price_sold: dev.sale_price,
      notes: null,
    });
    if (iErr) console.warn(`   ⚠️  OrderItem ${i + 1}: ${iErr.message}`);

    // Stock movement: sold
    await supabase.from("stock_movements").insert({
      device_id: dev.id,
      from_status: "in_stock",
      to_status: "sold",
      reason: "sale",
      reference_id: order.id,
      reference_type: "order",
      notes: `Venta orden #${order.id.slice(0, 8)}`,
    });

    ordersCreated++;
  }
  console.log(`   ✅ ${ordersCreated} órdenes insertadas`);

  // 4. Stock movements para dispositivos en stock (compra)
  console.log("📦 Insertando movimientos de stock…");
  const inStockDevices = devices.filter((d) => d.status === "in_stock");
  for (const dev of inStockDevices) {
    await supabase.from("stock_movements").insert({
      device_id: dev.id,
      from_status: null,
      to_status: "in_stock",
      reason: "purchase",
      notes: "Compra inicial al proveedor",
    });
  }
  const inRepairDevices = devices.filter((d) => d.status === "in_repair");
  for (const dev of inRepairDevices) {
    await supabase.from("stock_movements").insert({
      device_id: dev.id,
      from_status: null,
      to_status: "in_repair",
      reason: "repair_in",
      notes: "Recibido para reparación",
    });
  }
  console.log(`   ✅ ${inStockDevices.length + inRepairDevices.length} movimientos insertados`);

  // 5. Reparaciones
  console.log("🔧 Insertando reparaciones…");
  const repairsData = buildRepairs(cIds);
  const { data: repairs, error: rErr } = await supabase
    .from("repairs")
    .insert(repairsData)
    .select("id");
  if (rErr) { console.error("❌ Reparaciones:", rErr.message); process.exit(1); }
  console.log(`   ✅ ${repairs.length} reparaciones insertadas`);

  console.log("\n✨ Seed completado con éxito.");
  console.log(`   👥 Clientes/proveedores : ${cIds.length}`);
  console.log(`   📱 Dispositivos         : ${devices.length}`);
  console.log(`   🛒 Órdenes de venta     : ${ordersCreated}`);
  console.log(`   🔧 Reparaciones         : ${repairs.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

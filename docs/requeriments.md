# 🧾 HOJA TÉCNICA — Sistema CashMobile Canarias

**Cliente:** Belén (CashMobile Canarias)
**Stack objetivo:** Next.js (FE + BFF), backend + DB (tipo Supabase)
**Tipo sistema:** Ecommerce + Backoffice unificado (sustituye PrestaShop)

---

# 1. OBJETIVO DEL SISTEMA

Sistema centralizado que permita:

* Gestión de stock en tiempo real (tienda + web) (no debe ser real time de verdad pero si muy cómodo consultar la API)
* Ecommerce rápido y fiable
* Control completo de clientes (histórico + garantías)
* Sistema de tickets (servicio técnico)
* Analytics avanzados de negocio
* Base para fidelización y crecimiento

---

# 2. MÓDULOS DEL SISTEMA

## 2.1. PRODUCTOS & STOCK (CORE)

### Requisitos funcionales

* CRUD de productos
* Gestión de variantes:

  * Capacidad (128 / 256 / 512…)
  * Color
  * Estado (nuevo / seminuevo)
  * Salud batería (o estado simplificado tipo: excelente / bueno)
* Stock por variante
* Precio de compra y venta
* Margen automático calculado

### Requisitos clave

* Sistema de **variantes simplificado (NO explosión combinatoria tipo PrestaShop)**
* Posibilidad de:

  * Modelo único (iPhone 13)
  * Variantes dentro (estado + capacidad + color)

### UX críticos

* Crear producto rápido:

  * Pegado directo de imágenes (clipboard)
  * Copiar HTML descripción (ej: desde Xataka)
* Bulk creation (para pedidos grandes)

---

## 2.2. ECOMMERCE

### Requisitos funcionales

* Catálogo productos
* Filtros:

  * Modelo
  * Estado
  * Precio
* Página de producto:

  * Variantes seleccionables
* Carrito
* Checkout rápido

### Pagos

* Tarjeta
* Bizum
* (Futuro) Apple Pay / Google Pay

### Requisitos críticos

* Velocidad (compra impulsiva)
* Mobile first
* UX tipo:

  * Amazon
  * Shein
  * Backmarket

---

## 2.3. CLIENTES (CRÍTICO — MVP)

### Requisitos funcionales

* CRUD cliente:

  * Nombre
  * DNI
  * Teléfono
* Historial completo:

  * Compras
  * Productos
  * Tickets técnicos
* Búsqueda rápida:

  * Nombre
  * DNI
  * Teléfono

### Requisitos clave

* Vista tipo “ficha cliente”
* Acceso inmediato a:

  * Qué compró
  * Cuándo
  * Garantía

---

## 2.4. SISTEMA DE GARANTÍAS

### Requisitos funcionales

* Cada producto tiene:

  * Tiempo de garantía configurable
* Cálculo automático:

  * ¿Está en garantía o no?

### UX

* Mostrar en cliente:

  * ✅ En garantía
  * ❌ Fuera de garantía

---

## 2.5. SERVICIO TÉCNICO (TICKETS)

### Requisitos funcionales

* Crear ticket asociado a cliente + producto
* Datos del ticket:

  * Problema
  * Fecha entrada
  * Estado:

    * pendiente
    * en reparación
    * listo
* Generar resguardo (PDF futuro opcional)
* Cerrar ticket con resultado

### Requisitos clave

* Todo queda registrado en la ficha del cliente

---

## 2.6. ANALYTICS (CRÍTICO — MVP)

### Problema actual

→ “Estamos a ciegas”

### Requisitos funcionales

* Ventas:

  * Por día
  * Por franja horaria
  * Por producto
* Margen:

  * Beneficio por producto
* Ranking:

  * Más vendidos
* Insights:

  * Qué compensa vender vs no

### Ejemplos reales pedidos

* Ventas lunes X horas
* Productos más rentables
* Performance campañas (base futura)

---

## 2.7. EMPLEADOS (FASE 2 - NO IMPLEMENTAR AÚN)

### Requisitos funcionales

* Tracking ventas por empleado
* KPIs:

  * Accesorios vendidos
* Base para:

  * Sistema de incentivos

---

## 2.8. FIDELIZACIÓN (FASE 2 - NO IMPLEMENTAR AÚN)

### Requisitos funcionales

* Sistema puntos:

  * Ej: 10€ → +0.10€
* Saldo acumulado
* Redención en compra

---

## 2.9. AUTENTICACIÓN

### Requisitos

* Login:

  * Email + password
  * Google
  * Facebook
* Persistencia sesión rápida

---

## 2.10. BACKOFFICE

### Usuarios internos

* 3 usuarios concurrentes

### Requisitos

* Panel simple (NO complejo tipo PrestaShop)
* Acciones rápidas:

  * Crear producto
  * Buscar cliente
  * Ver ventas
* UX minimal (anti “dashboard caos”)

---

# 3. REQUISITOS NO FUNCIONALES

## 3.1. PERFORMANCE

* Tiempo carga < 2s
* Checkout < 1s interacción
* Mobile optimizado

---

## 3.2. FIABILIDAD

* Sin desincronización stock (web vs tienda)
* Sin bugs en checkout
* Sistema estable (problema actual grave)

---

## 3.3. ESCALABILIDAD

* Arquitectura modular (por fases)
* Añadir features sin romper core

---

## 3.4. USABILIDAD

* Aprendizaje < 1 día
* Flujo natural tienda

---

# 4. ARQUITECTURA PROPUESTA

### Frontend

* Next.js (App Router)
* SSR/ISR para ecommerce

### Backend

* Supabase:

  * Postgres
  * Auth
  * Storage

### Capas (hexagonal)

```
/domain
/application
/infrastructure
/ui
```

---

# 5. MODELO DE DATOS (HIGH LEVEL)

### Product

* id
* name
* base_model
* is_new / is_used

### ProductVariant

* product_id
* capacity
* color
* condition
* battery_health
* stock
* price
* purchase_price

### Customer

* id
* name
* dni
* phone

### Order

* id
* customer_id
* total
* created_at

### OrderItem

* order_id
* variant_id
* quantity
* price

### Ticket

* id
* customer_id
* product_id
* issue
* status
* created_at

---

# 6. MVP DEFINIDO (FASE 1)

### INCLUYE:

* Productos + variantes
* Stock unificado
* Ecommerce básico
* Clientes (ficha completa)
* Garantías
* Tickets básicos
* Analytics básicos

### NO incluye:

* Fidelización
* Incentivos empleados
* Automatizaciones avanzadas

---

# 7. PROBLEMAS CRÍTICOS A RESOLVER

1. ❌ Desincronización stock
2. ❌ Cero visibilidad negocio
3. ❌ Gestión cliente pobre
4. ❌ UX ecommerce lenta / inconsistente
5. ❌ Dependencia de programador externo

---

# 8. MÉTRICAS DE ÉXITO

* ↓ errores operativos
* ↑ velocidad creación productos
* ↑ conversión ecommerce
* ↑ control de márgenes
* ↓ tiempo gestión cliente

---

# 9. CHECKLIST PARA AUGMENT

Puedes usar esto directamente:

* [ ] CRUD productos
* [ ] Sistema variantes flexible
* [ ] Stock por variante
* [ ] Ecommerce (listado + PDP + checkout)
* [ ] Pagos integrados
* [ ] CRUD clientes
* [ ] Historial cliente
* [ ] Sistema garantías
* [ ] Tickets servicio técnico
* [ ] Analytics básicos
* [ ] Backoffice usable
 
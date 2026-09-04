const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  getTimeSegment,
  getGreeting,
  calculateTotal,
  countItems,
  sanitizeCart,
  validateOrder,
  normalizePhone,
  buildOrderMessage,
  buildWhatsAppUrl,
  MENU, BRANCHES, PHOTOS, HIGHLIGHTS,
} = require('../app.js');

const root = path.join(__dirname, '..');

test('every menu item has a local photograph and source classification', () => {
  assert.ok(MENU && PHOTOS, 'menu and photo catalog must be exported');
  for (const item of Object.values(MENU).flatMap(segment => segment.items)) {
    const photo = PHOTOS[item.id];
    assert.ok(photo && photo.src && photo.source);
    assert.ok(fs.existsSync(path.join(root, photo.src)), item.name);
  }
});

test('the hero ships a local video and a static poster fallback', () => {
  assert.ok(fs.existsSync(path.join(root, 'assets/hero/mar-olas.mp4')));
  assert.ok(fs.existsSync(path.join(root, 'assets/hero/mar-olas-poster.jpg')));
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /id="hero-poster"/);
  assert.match(html, /id="hero-video"/);
  // El video nunca se precarga: solo entra si el visitante acepta movimiento.
  assert.match(html, /preload="none"/);
});

test('each branch shows a local storefront photograph', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const branch of BRANCHES) {
    const file = `assets/sucursales/${branch.id}.jpg`;
    assert.ok(fs.existsSync(path.join(root, file)), file);
    assert.ok(html.includes(file), `index.html debe mostrar ${file}`);
  }
});

test('highlights reuse existing menu dishes instead of inventing promotions', () => {
  assert.ok(Array.isArray(HIGHLIGHTS) && HIGHLIGHTS.length >= 3);
  const ids = new Set(Object.values(MENU).flatMap(segment => segment.items).map(item => item.id));
  for (const highlight of HIGHLIGHTS) {
    assert.ok(ids.has(highlight.id), `${highlight.id} debe existir en el menú`);
    assert.ok(highlight.kicker && highlight.kicker.length > 0);
    // Sin descuentos, vigencias ni precios especiales inventados.
    assert.doesNotMatch(highlight.kicker, /%|descuento|oferta|promo|gratis|2x1/i);
  }
});

test('uses the five verified branches with test WhatsApp destinations flagged as such', () => {
  assert.ok(BRANCHES, 'branches must be exported');
  assert.deepEqual(BRANCHES.map(branch => branch.name), ['Ciudad Obregón', 'Guaymas', 'Hermosillo Reforma', 'Hermosillo Morelos', 'San Carlos']);
  // Números de prueba, nunca líneas oficiales del restaurante.
  assert.ok(BRANCHES.every(branch => branch.phoneIsTest === true));
  // Reparto propuesto: hermano en EE. UU. (+1), usuario en México (+52).
  const byId = Object.fromEntries(BRANCHES.map(branch => [branch.id, branch.phone]));
  assert.equal(byId.obregon, '16232399551');
  assert.equal(byId['hermosillo-reforma'], '16232399551');
  assert.equal(byId['hermosillo-morelos'], '16232399551');
  assert.equal(byId.guaymas, '526221424577');
  assert.equal(byId['san-carlos'], '526221424577');
});

test('selects the correct menu at every time boundary', () => {
  assert.equal(getTimeSegment(7), 'night');
  assert.equal(getTimeSegment(8), 'breakfast');
  assert.equal(getTimeSegment(11), 'breakfast');
  assert.equal(getTimeSegment(12), 'lunch');
  assert.equal(getTimeSegment(17), 'lunch');
  assert.equal(getTimeSegment(18), 'night');
});

test('returns a warm greeting for the current period', () => {
  assert.equal(getGreeting(9), 'Buenos días');
  assert.equal(getGreeting(15), 'Buenas tardes');
  assert.equal(getGreeting(22), 'Buenas noches');
});

test('calculates totals and unit counts from price and quantity', () => {
  const items = [{ price: 185, quantity: 2 }, { price: 198, quantity: 1 }];
  assert.equal(calculateTotal(items), 568);
  assert.equal(countItems(items), 3);
});

test('removes malformed persisted cart entries and keeps per-dish notes', () => {
  assert.deepEqual(sanitizeCart([
    { id: 'chilaquiles', name: 'Chilaquiles', price: 185, quantity: 2, note: 'Salsa verde' },
    { id: '', name: 'Bad', price: 12, quantity: 1 },
    { id: 'negative', name: 'Bad', price: -5, quantity: 1 },
  ]), [{ id: 'chilaquiles', name: 'Chilaquiles', price: 185, quantity: 2, note: 'Salsa verde' }]);
  assert.deepEqual(sanitizeCart('not-an-array'), []);
  // Una nota ausente o inválida no descarta el platillo.
  assert.equal(sanitizeCart([{ id: 'a', name: 'A', price: 10, quantity: 1 }])[0].note, '');
});

test('normalizes phone numbers to digits', () => {
  assert.equal(normalizePhone('(622) 142-4577'), '6221424577');
  assert.equal(normalizePhone('+1 623 239 9551'), '16232399551');
  assert.equal(normalizePhone(''), '');
});

test('requires name and phone, and an address only for delivery', () => {
  const items = [{ id: 'a', name: 'A', price: 10, quantity: 1 }];
  const base = { branch: 'Guaymas', customer: 'Ana', phone: '6221424577', address: '', items };

  assert.deepEqual(validateOrder({ ...base, mode: 'pickup' }), {});
  // A domicilio la dirección es obligatoria; para recoger no.
  assert.equal(validateOrder({ ...base, mode: 'delivery' }).address, 'Escribe la dirección de entrega.');
  assert.deepEqual(validateOrder({ ...base, mode: 'delivery', address: 'Calle 1' }), {});

  assert.ok(validateOrder({ ...base, mode: 'pickup', items: [] }).items);
  assert.ok(validateOrder({ ...base, mode: 'pickup', branch: '' }).branch);
  assert.ok(validateOrder({ ...base, mode: 'pickup', customer: '   ' }).customer);
  assert.ok(validateOrder({ ...base, mode: 'pickup', phone: '' }).phone);
  assert.ok(validateOrder({ ...base, mode: 'pickup', phone: '622142' }).phone);
});

test('builds a detailed pickup order message', () => {
  const message = buildOrderMessage({
    folio: 1,
    date: new Date('2026-09-04T15:30:00Z'),
    mode: 'pickup',
    branch: 'Hermosillo Reforma',
    customer: 'Ana',
    phone: '6621234567',
    items: [{ name: 'Chilaquiles del Rey', price: 185, quantity: 2, note: 'Salsa verde' }],
  });
  assert.match(message, /Pedido No\. 1966-001/);
  assert.match(message, /Sucursal: Hermosillo Reforma/);
  assert.match(message, /Modalidad: Recoger en sucursal/);
  assert.match(message, /Nombre: Ana/);
  assert.match(message, /Teléfono: 6621234567/);
  assert.match(message, /2 × Chilaquiles del Rey — \$185 c\/u — Subtotal \$370/);
  assert.match(message, /↳ Salsa verde/);
  assert.match(message, /Total de productos \(2 piezas\): \$370 MXN/);
  // Sin domicilio no se menciona envío.
  assert.doesNotMatch(message, /Envío/);
});

test('delivery message carries the address and flags shipping as pending', () => {
  const message = buildOrderMessage({
    folio: 7,
    date: new Date('2026-09-04T15:30:00Z'),
    mode: 'delivery',
    branch: 'Guaymas',
    customer: 'Luis',
    phone: '6221424577',
    address: 'Calle Serdán 123',
    references: 'Portón azul',
    notes: 'Para las 3 pm',
    items: [
      { name: 'Camarones Culichi', price: 298, quantity: 1, note: '' },
      { name: 'Tarro Michelado', price: 58, quantity: 2, note: 'Bien frío' },
    ],
  });
  assert.match(message, /Pedido No\. 1966-007/);
  assert.match(message, /Modalidad: A domicilio/);
  assert.match(message, /Dirección: Calle Serdán 123/);
  assert.match(message, /Referencias: Portón azul/);
  assert.match(message, /Notas: Para las 3 pm/);
  assert.match(message, /Total de productos \(3 piezas\): \$414 MXN/);
  // Nunca se inventa una tarifa: el costo queda explícitamente por confirmar.
  assert.match(message, /Envío: por confirmar con el encargado \(no incluido en el total\)\./);
  assert.doesNotMatch(message, /\$\d+\s*de envío/i);
});

test('the message never claims the order is confirmed', () => {
  const message = buildOrderMessage({
    folio: 2, date: new Date(), mode: 'pickup', branch: 'Guaymas',
    customer: 'Ana', phone: '6221424577',
    items: [{ name: 'Sopa', price: 100, quantity: 1, note: '' }],
  });
  assert.doesNotMatch(message, /confirmad|pedido enviado|gracias por tu compra|pagado/i);
});

test('the page tells the visitor that opening WhatsApp is not a confirmation', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /Todavía tienes que enviar el mensaje/);
  assert.match(html, /números de WhatsApp configurados son de prueba/);
});

test('the main call to action asks to place an order', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /Encargar pedido/);
  assert.doesNotMatch(html, /Ver comanda/);
});

test('the full menu PDF is reachable from the top of the menu section', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /class="menu-pdf-button"/);
  assert.ok(fs.existsSync(path.join(root, 'assets/menu/menu-marzo-2026.pdf')));
  // El botón vive en la barra del menú, antes de la lista de platillos.
  assert.ok(html.indexOf('menu-pdf-button') < html.indexOf('id="menu-grid"'));
});

test('the unreadable stamp was removed and the fact kept in the copy', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.doesNotMatch(html, /one-peso-stamp/);
  assert.doesNotMatch(css, /one-peso-stamp/);
  assert.match(html, /class="first-sale"/);
  assert.match(html, /La primera venta fue de/);
});

test('typography uses Instrument Serif with Bricolage Grotesque', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.match(html, /family=Instrument\+Serif/);
  assert.match(html, /family=Bricolage\+Grotesque/);
  // Las tipografías anteriores quedaron fuera por genéricas.
  assert.doesNotMatch(css, /Inter/);
  assert.doesNotMatch(css, /Fraunces/);
  assert.doesNotMatch(css, /Archivo/);
});

test('interactive surfaces get a soft 5px radius, pills and circles keep theirs', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.match(css, /border-radius: 5px;/);
  for (const sel of ['.header-order', '.hero-cta', '.menu-pdf-button', '.send-order', '.stepper button']) {
    assert.ok(css.includes(sel), `${sel} debe recibir el redondeo`);
  }
  // Estas conservan su forma a propósito.
  assert.match(css, /\.segment-nav button \{ border-radius: 100px; \}/);
  assert.match(css, /\.carousel-arrow \{ border-radius: 50%; \}/);
});

test('the brand pattern is used once, softly, over the dark section', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.ok(fs.existsSync(path.join(root, 'assets/pattern/mar-y-corona.jpg')));
  // Una sola sección: repetirlo le quitaba elegancia.
  assert.equal((html.match(/pattern-band/g) || []).length, 1);
  assert.match(html, /class="history-section pattern-band"/);
  // Debe quedarse en textura, no en estampado.
  const opacity = Number(css.match(/\.pattern-band::before[\s\S]*?opacity: \.(\d+);/)[1]) / 100;
  assert.ok(opacity <= 0.2, `el patrón debe ser sutil, opacidad ${opacity}`);
});

test('the highlights carousel hides the native scrollbar', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.match(css, /\.carousel-track::-webkit-scrollbar \{ display: none; \}/);
  assert.match(css, /scrollbar-width: none/);
});

test('builds a WhatsApp URL only when a destination exists', () => {
  assert.equal(buildWhatsAppUrl(null, 'Pedido'), null);
  const url = buildWhatsAppUrl('526624920600', 'Línea 1\nLínea 2');
  assert.equal(url, 'https://wa.me/526624920600?text=L%C3%ADnea%201%0AL%C3%ADnea%202');
});

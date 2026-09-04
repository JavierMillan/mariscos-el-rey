(function () {
  'use strict';

  const MENU = {
    breakfast: {
      label: 'Desayuno',
      title: 'Desayunos',
      note: 'De 8:00 a 11:59',
      line: 'Para empezar el día como manda el norte.',
      image: 'assets/menu/desayuno.jpg',
      items: [
        { id: 'chilaquiles', name: 'Chilaquiles del Rey', price: 185, description: 'Tortilla doradita bañada en salsa roja o verde, con huevos al gusto, frijoles y guacamole.' },
        { id: 'rancheros', name: 'Huevos Rancheros', price: 168, description: 'Huevos estrellados con jamón y queso sobre tortilla doradita, bañados en salsa ranchera.' },
        { id: 'omelette-camaron', name: 'Omelette de Camarones', price: 198, description: 'Relleno de camarones y queso, coronado con salsa bandera y papa hash brown.' },
        { id: 'salmon-toast', name: 'Salmón Ahumado Toast', price: 176, description: 'Pan de masa madre, crema de queso de cabra y miel, salmón ahumado y germinado.' },
      ],
    },
    lunch: {
      label: 'Comida',
      title: 'Comida',
      note: 'De 12:00 a 17:59',
      line: 'Mar, brasa y cuchara. Lo bueno está saliendo.',
      image: 'assets/menu/comida.jpg',
      items: [
        { id: 'culichi', name: 'Camarones Culichi', price: 298, description: 'Salteados en cremosa salsa de chile poblano, coronados con julianas de chile morrón.' },
        { id: 'princesa', name: 'Tostada Princesa', price: 248, description: 'Láminas de atún fresco, camarones cocidos, callo de hacha y aguacate.' },
        { id: 'arrachera', name: 'Arrachera Sonorense', price: 497, description: 'Asada al carbón, con papa sonorense, guacamole y tortillas de harina.' },
        { id: 'sopa-variedad', name: 'Sopa de Variedad', price: 287, description: 'Caldo de camarón levantamuertos, con pulpo, camarón, caracol, pescado y mejillones.' },
      ],
    },
    night: {
      label: 'Noche',
      title: 'Noche y barra',
      note: 'De 18:00 a 7:59',
      line: 'Cuando baja el sol, sube el antojo.',
      image: 'assets/menu/noche.jpg',
      items: [
        { id: 'rib-eye', name: 'Rib Eye Del Rey', price: 529, description: 'Corte premium asado al carbón, sabor mantequilloso típico del norte.' },
        { id: 'california', name: 'California Roll', price: 184, description: 'Camarón, pepino, aguacate y queso Philadelphia, forrado con ajonjolí.' },
        { id: 'margarita', name: 'Margarita', price: 130, description: 'Clásica, tequila, triple sec y limón.' },
        { id: 'michelado', name: 'Tarro Michelado', price: 58, description: 'Con Clamato salseado, limón y sal.' },
      ],
    },
  };

  // Teléfonos de prueba autorizados por el usuario para la demostración.
  // NO son líneas oficiales del restaurante. Formato E.164 sin el signo +.
  // Hermano: (623) 239-9551 confirmado como Estados Unidos (+1).
  // Usuario: 622 142 4577, Sonora, México (+52).
  const TEST_PHONE_BROTHER = '16232399551';
  const TEST_PHONE_OWNER = '526221424577';

  const BRANCHES = [
    { id: 'obregon', name: 'Ciudad Obregón', phone: TEST_PHONE_BROTHER, phoneIsTest: true },
    { id: 'guaymas', name: 'Guaymas', phone: TEST_PHONE_OWNER, phoneIsTest: true },
    { id: 'hermosillo-reforma', name: 'Hermosillo Reforma', phone: TEST_PHONE_BROTHER, phoneIsTest: true },
    { id: 'hermosillo-morelos', name: 'Hermosillo Morelos', phone: TEST_PHONE_BROTHER, phoneIsTest: true },
    { id: 'san-carlos', name: 'San Carlos', phone: TEST_PHONE_OWNER, phoneIsTest: true },
  ];

  const PHOTOS = {
    'chilaquiles': { src: 'assets/menu/chilaquiles.png', source: 'Mariscos El Rey' },
    'rancheros': { src: 'assets/menu/rancheros.png', source: 'Mariscos El Rey' },
    'omelette-camaron': { src: 'assets/menu/omelette.png', source: 'Mariscos El Rey' },
    'salmon-toast': { src: 'assets/menu/desayuno.jpg', source: 'Mariscos El Rey' },
    'culichi': { src: 'assets/menu/culichi.jpg', source: 'Mariscos El Rey' },
    'princesa': { src: 'assets/menu/comida.jpg', source: 'Mariscos El Rey' },
    'arrachera': { src: 'assets/menu/arrachera.jpg', source: 'Alejandro Aznar / Pexels', reference: true },
    'sopa-variedad': { src: 'assets/menu/sopa.jpg', source: 'Mariscos El Rey' },
    'rib-eye': { src: 'assets/menu/rib-eye.jpg', source: 'Mariscos El Rey' },
    'california': { src: 'assets/menu/noche.jpg', source: 'Mariscos El Rey' },
    'margarita': { src: 'assets/menu/margarita.jpg', source: 'Dasha Klimova / Pexels', reference: true },
    'michelado': { src: 'assets/menu/michelada.jpg', source: 'Arina Krasnikova / Pexels', reference: true },
  };

  // Destacados = platillos del menú vigente. No hay promociones confirmadas
  // por el restaurante, así que no se anuncian descuentos ni vigencias.
  const HIGHLIGHTS = [
    { id: 'culichi', kicker: 'De la casa' },
    { id: 'sopa-variedad', kicker: 'Para compartir' },
    { id: 'princesa', kicker: 'Fresco del día' },
    { id: 'rib-eye', kicker: 'De la brasa' },
    { id: 'chilaquiles', kicker: 'Para empezar' },
  ];

  const HERO_VIDEO = 'assets/hero/mar-olas.mp4';

  const STORAGE_KEY = 'mariscos-el-rey-cart-v2';
  const DETAILS_KEY = 'mariscos-el-rey-details-v1';
  const FOLIO_KEY = 'mariscos-el-rey-folio-v1';

  function getTimeSegment(hour) {
    if (hour >= 8 && hour < 12) return 'breakfast';
    if (hour >= 12 && hour < 18) return 'lunch';
    return 'night';
  }

  function getGreeting(hour) {
    if (hour >= 8 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function countItems(items) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  function sanitizeCart(value) {
    if (!Array.isArray(value)) return [];
    return value.filter((item) => (
      item && typeof item.id === 'string' && item.id.length > 0 &&
      typeof item.name === 'string' && item.name.length > 0 &&
      Number.isFinite(item.price) && item.price >= 0 &&
      Number.isInteger(item.quantity) && item.quantity > 0
    )).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      note: typeof item.note === 'string' ? item.note.slice(0, 140) : '',
    }));
  }

  function money(value) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
    }).format(value);
  }

  function normalizePhone(value) {
    return String(value || '').replace(/\D/g, '');
  }

  // Valida los datos del cliente según la modalidad. Devuelve un mapa de
  // errores por campo; vacío significa que el pedido puede continuar.
  function validateOrder({ mode, branch, customer, phone, address, items }) {
    const errors = {};
    if (!items || items.length === 0) errors.items = 'Agrega al menos un platillo.';
    if (!branch) errors.branch = 'Elige una sucursal.';
    if (!customer || !customer.trim()) errors.customer = 'Escribe tu nombre.';
    const digits = normalizePhone(phone);
    if (!digits) errors.phone = 'Escribe un teléfono de contacto.';
    else if (digits.length < 10) errors.phone = 'El teléfono debe tener al menos 10 dígitos.';
    if (mode === 'delivery' && (!address || !address.trim())) {
      errors.address = 'Escribe la dirección de entrega.';
    }
    return errors;
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit',
    }).format(date);
  }

  function buildOrderMessage({ folio, date, mode, branch, customer, phone, address, references, notes, items }) {
    const total = calculateTotal(items);
    const units = countItems(items);
    const isDelivery = mode === 'delivery';
    const lines = [
      `*Pedido No. 1966-${String(folio).padStart(3, '0')}*`,
      `Fecha: ${formatDate(date || new Date())}`,
      `Sucursal: ${branch}`,
      `Modalidad: ${isDelivery ? 'A domicilio' : 'Recoger en sucursal'}`,
      '',
      `Nombre: ${customer.trim()}`,
      `Teléfono: ${phone.trim()}`,
    ];
    if (isDelivery) {
      lines.push(`Dirección: ${address.trim()}`);
      if (references && references.trim()) lines.push(`Referencias: ${references.trim()}`);
    }
    lines.push('', '*Productos*');
    items.forEach((item) => {
      lines.push(`${item.quantity} × ${item.name} — ${money(item.price)} c/u — Subtotal ${money(item.price * item.quantity)}`);
      if (item.note && item.note.trim()) lines.push(`   ↳ ${item.note.trim()}`);
    });
    lines.push('', `Total de productos (${units} ${units === 1 ? 'pieza' : 'piezas'}): ${money(total)} MXN`);
    if (isDelivery) lines.push('Envío: por confirmar con el encargado (no incluido en el total).');
    if (notes && notes.trim()) lines.push('', `Notas: ${notes.trim()}`);
    lines.push('', 'Quedo al pendiente de que me confirmen disponibilidad y tiempo.');
    return lines.join('\n');
  }

  function buildWhatsAppUrl(phone, message) {
    if (!phone) return null;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      getTimeSegment, getGreeting, calculateTotal, countItems, sanitizeCart,
      validateOrder, normalizePhone, buildOrderMessage, buildWhatsAppUrl,
      MENU, BRANCHES, PHOTOS, HIGHLIGHTS,
    };
  }

  if (typeof document === 'undefined') return;

  const allItems = Object.values(MENU).flatMap((segment) => segment.items);
  const itemById = new Map(allItems.map((item) => [item.id, item]));
  let storageAvailable = true;
  let cart = [];
  let manualSegment = false;
  let currentSegment = getTimeSegment(new Date().getHours());
  let activeSegment = currentSegment;
  let drawerTrigger = null;
  let carouselIndex = 0;
  let showErrors = false;

  const els = {};

  function loadCart() {
    try {
      cart = sanitizeCart(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch (_error) {
      cart = [];
      storageAvailable = false;
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (_error) {
      storageAvailable = false;
      els.storageNotice.hidden = false;
    }
  }

  function saveDetails() {
    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify({
        mode: getMode(),
        branch: els.branch.value,
        customer: els.customer.value,
        phone: els.phone.value,
        address: els.address.value,
        references: els.references.value,
        notes: els.orderNotes.value,
      }));
    } catch (_error) {
      storageAvailable = false;
    }
  }

  function loadDetails() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(DETAILS_KEY) || 'null');
    } catch (_error) {
      return;
    }
    if (!saved || typeof saved !== 'object') return;
    if (saved.mode === 'delivery') {
      const radio = document.querySelector('input[name="mode"][value="delivery"]');
      if (radio) radio.checked = true;
    }
    if (typeof saved.branch === 'string' && BRANCHES.some((b) => b.id === saved.branch)) els.branch.value = saved.branch;
    if (typeof saved.customer === 'string') els.customer.value = saved.customer.slice(0, 80);
    if (typeof saved.phone === 'string') els.phone.value = saved.phone.slice(0, 20);
    if (typeof saved.address === 'string') els.address.value = saved.address.slice(0, 160);
    if (typeof saved.references === 'string') els.references.value = saved.references.slice(0, 160);
    if (typeof saved.notes === 'string') els.orderNotes.value = saved.notes.slice(0, 300);
  }

  function getFolio() {
    try {
      const folio = Number.parseInt(localStorage.getItem(FOLIO_KEY) || '1', 10);
      return Number.isInteger(folio) && folio > 0 ? folio : 1;
    } catch (_error) {
      return 1;
    }
  }

  function getMode() {
    const checked = document.querySelector('input[name="mode"]:checked');
    return checked ? checked.value : 'pickup';
  }

  function findCartItem(id) {
    return cart.find((item) => item.id === id);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[char]));
  }

  function announce(message) {
    els.live.textContent = '';
    requestAnimationFrame(() => { els.live.textContent = message; });
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // El video es decorativo: solo se carga si el visitante no pidió reducir
  // movimiento. El póster estático queda siempre como alternativa.
  function setupHero() {
    if (!els.heroVideo) return;
    const reduced = prefersReducedMotion();
    els.motionToggle.hidden = false;
    els.motionToggle.querySelector('.motion-label').textContent = reduced ? 'Activar movimiento' : 'Pausar movimiento';
    els.motionToggle.setAttribute('aria-pressed', String(!reduced));
    if (!reduced) playHero();
    els.motionToggle.addEventListener('click', () => {
      const playing = els.motionToggle.getAttribute('aria-pressed') === 'true';
      if (playing) pauseHero(); else playHero();
    });
    els.heroVideo.addEventListener('error', pauseHero);
  }

  function playHero() {
    if (!els.heroVideo.getAttribute('src')) els.heroVideo.setAttribute('src', HERO_VIDEO);
    const attempt = els.heroVideo.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(pauseHero);
    els.heroVideo.classList.add('is-playing');
    els.motionToggle.setAttribute('aria-pressed', 'true');
    els.motionToggle.querySelector('.motion-label').textContent = 'Pausar movimiento';
  }

  function pauseHero() {
    els.heroVideo.pause();
    els.heroVideo.classList.remove('is-playing');
    els.motionToggle.setAttribute('aria-pressed', 'false');
    els.motionToggle.querySelector('.motion-label').textContent = 'Activar movimiento';
  }

  function updateClock() {
    const now = new Date();
    const nextCurrent = getTimeSegment(now.getHours());
    currentSegment = nextCurrent;
    if (!manualSegment && activeSegment !== currentSegment) {
      activeSegment = currentSegment;
      renderMenu();
    }
    els.greeting.textContent = getGreeting(now.getHours());
    els.clock.textContent = now.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
    renderSegments();
  }

  function renderSegments() {
    els.segmentButtons.forEach((button) => {
      const key = button.dataset.segment;
      button.setAttribute('aria-pressed', String(key === activeSegment));
      button.classList.toggle('is-active', key === activeSegment);
      const dot = button.querySelector('.now-dot');
      dot.hidden = key !== currentSegment;
    });
  }

  function renderCarousel() {
    els.carouselTrack.innerHTML = HIGHLIGHTS.map((highlight) => {
      const item = itemById.get(highlight.id);
      const photo = PHOTOS[highlight.id];
      if (!item || !photo) return '';
      return `<article class="highlight-card" data-highlight="${item.id}">
        <figure>
          <img src="${photo.src}" alt="${escapeHtml(item.name)}${photo.reference ? ', imagen de referencia' : ''}" loading="lazy" width="640" height="480">
          ${photo.reference ? '<figcaption>Imagen de referencia</figcaption>' : ''}
        </figure>
        <p class="highlight-kicker">${escapeHtml(highlight.kicker)}</p>
        <h3>${escapeHtml(item.name)}</h3>
        <p class="highlight-desc">${escapeHtml(item.description)}</p>
        <div class="highlight-foot">
          <span class="highlight-price">${money(item.price)}</span>
          <button class="add-dish" type="button" data-add="${item.id}">Agregar</button>
        </div>
      </article>`;
    }).join('');

    els.carouselDots.innerHTML = HIGHLIGHTS.map((highlight, index) => {
      const item = itemById.get(highlight.id);
      return `<button type="button" role="tab" data-slide="${index}" aria-label="Ver ${escapeHtml(item ? item.name : 'destacado')}" aria-selected="${index === 0}"></button>`;
    }).join('');
  }

  function scrollCarousel(index) {
    const cards = [...els.carouselTrack.querySelectorAll('.highlight-card')];
    if (!cards.length) return;
    carouselIndex = Math.max(0, Math.min(index, cards.length - 1));
    const card = cards[carouselIndex];
    els.carouselTrack.scrollTo({
      left: card.offsetLeft - els.carouselTrack.offsetLeft,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    syncCarouselControls();
  }

  function syncCarouselControls() {
    const cards = [...els.carouselTrack.querySelectorAll('.highlight-card')];
    els.carouselDots.querySelectorAll('[data-slide]').forEach((dot, index) => {
      dot.setAttribute('aria-selected', String(index === carouselIndex));
    });
    els.carouselPrev.disabled = carouselIndex === 0;
    els.carouselNext.disabled = carouselIndex >= cards.length - 1;
  }

  function renderMenu() {
    const segment = MENU[activeSegment];
    els.menuTitle.textContent = segment.title;
    els.menuNote.textContent = segment.note;
    els.menuLine.textContent = segment.line;
    els.featureImage.src = segment.image;
    els.featureImage.alt = `Platillo de ${segment.title.toLowerCase()} de Mariscos El Rey`;
    els.featureFallback.hidden = true;
    els.featureImage.hidden = false;
    els.menuGrid.innerHTML = segment.items.map((item) => {
      const quantity = findCartItem(item.id)?.quantity || 0;
      const photo = PHOTOS[item.id];
      return `<article class="dish-row">
        <figure class="dish-photo">
          <img src="${photo.src}" alt="${escapeHtml(item.name)}${photo.reference ? ', imagen de referencia' : ''}" loading="lazy" width="640" height="480">
          ${photo.reference ? '<figcaption>Imagen de referencia</figcaption>' : ''}
        </figure>
        <div class="dish-copy">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <button class="add-dish" type="button" data-add="${item.id}">
            <span aria-hidden="true">${quantity ? '✓' : '+'}</span> ${quantity ? `Agregado (${quantity})` : 'Agregar'}
          </button>
        </div>
        <p class="dish-price">${money(item.price)}</p>
      </article>`;
    }).join('');
    els.menuGrid.querySelectorAll('.dish-photo img').forEach(image => image.addEventListener('error', () => {
      image.hidden = true;
      image.parentElement.classList.add('image-unavailable');
    }, { once: true }));
    renderSegments();
  }

  function renderCart() {
    const count = countItems(cart);
    const total = calculateTotal(cart);
    els.orderCount.textContent = count === 0 ? 'Tu pedido está vacío' : `${count} ${count === 1 ? 'platillo' : 'platillos'} · ${money(total)}`;
    els.orderTotal.textContent = money(total);
    els.orderFolio.textContent = `Pedido No. 1966-${String(getFolio()).padStart(3, '0')}`;
    els.emptyOrder.hidden = cart.length > 0;
    els.orderItems.hidden = cart.length === 0;

    els.orderItems.innerHTML = cart.map((item) => {
      const photo = PHOTOS[item.id];
      const safeName = escapeHtml(item.name);
      return `<li class="order-item">
        <img class="order-thumb" src="${photo ? photo.src : ''}" alt="" loading="lazy" width="120" height="90">
        <div class="order-item-main">
          <strong>${safeName}</strong>
          <small>${money(item.price)} c/u</small>
          <label class="item-note-label" for="note-${item.id}">Instrucciones para este platillo</label>
          <input class="item-note" id="note-${item.id}" type="text" maxlength="140" data-note="${item.id}"
            value="${escapeHtml(item.note || '')}" placeholder="Sin cebolla, salsa aparte…">
        </div>
        <div class="order-item-side">
          <div class="stepper" role="group" aria-label="Cantidad de ${safeName}">
            <button type="button" data-decrease="${item.id}" aria-label="Quitar uno de ${safeName}">−</button>
            <output aria-live="off">${item.quantity}</output>
            <button type="button" data-increase="${item.id}" aria-label="Agregar uno de ${safeName}">+</button>
          </div>
          <p class="order-subtotal">${money(item.price * item.quantity)}</p>
          <button class="remove-item" type="button" data-remove="${item.id}">Eliminar</button>
        </div>
      </li>`;
    }).join('');

    updateCheckoutState();
    if (document.querySelector('[data-add]')) {
      renderMenu();
      renderCarouselQuantities();
    }
  }

  function renderCarouselQuantities() {
    els.carouselTrack.querySelectorAll('[data-add]').forEach((button) => {
      const quantity = findCartItem(button.dataset.add)?.quantity || 0;
      button.textContent = quantity ? `Agregado (${quantity})` : 'Agregar';
    });
  }

  function setFieldError(field, message) {
    const box = els.errors[field];
    if (!box) return;
    box.textContent = message || '';
    box.hidden = !message;
    const input = els.inputs[field];
    if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function updateCheckoutState() {
    const mode = getMode();
    const isDelivery = mode === 'delivery';
    document.querySelectorAll('.delivery-only').forEach((node) => { node.hidden = !isDelivery; });
    els.totalNote.textContent = isDelivery
      ? 'Total solo de productos. El envío lo confirma el encargado y no está incluido.'
      : 'Total de productos para recoger en sucursal.';

    const branch = BRANCHES.find((item) => item.id === els.branch.value);
    const errors = validateOrder({
      mode,
      branch: branch ? branch.name : '',
      customer: els.customer.value,
      phone: els.phone.value,
      address: els.address.value,
      items: cart,
    });

    ['branch', 'customer', 'phone', 'address'].forEach((field) => {
      setFieldError(field, showErrors ? errors[field] : '');
    });

    const isValid = Object.keys(errors).length === 0;
    const hasPhone = Boolean(branch && branch.phone);
    els.sendOrder.disabled = !isValid || !hasPhone;

    if (errors.items) els.checkoutStatus.textContent = 'Agrega al menos un platillo para continuar.';
    else if (errors.branch) els.checkoutStatus.textContent = 'Elige la sucursal que te toca.';
    else if (!hasPhone) els.checkoutStatus.textContent = 'WhatsApp pendiente de configurar para esta sucursal.';
    else if (errors.customer || errors.phone || errors.address) els.checkoutStatus.textContent = 'Completa tus datos para continuar.';
    else els.checkoutStatus.textContent = 'Listo. Al continuar se abre WhatsApp con tu pedido escrito.';

    updateSteps(isValid && hasPhone);

    if (!errors.items && branch) {
      els.preview.textContent = buildOrderMessage({
        folio: getFolio(),
        date: new Date(),
        mode,
        branch: branch.name,
        customer: els.customer.value || '(pendiente)',
        phone: els.phone.value || '(pendiente)',
        address: els.address.value || '(pendiente)',
        references: els.references.value,
        notes: els.orderNotes.value,
        items: cart,
      });
    } else {
      els.preview.textContent = 'Completa el pedido para ver el mensaje.';
    }
  }

  function updateSteps(readyToSend) {
    const hasItems = cart.length > 0;
    const branch = BRANCHES.find((item) => item.id === els.branch.value);
    const detailsDone = Boolean(branch) && Boolean(els.customer.value.trim()) && normalizePhone(els.phone.value).length >= 10;
    const state = {
      1: hasItems ? 'done' : 'current',
      2: !hasItems ? 'pending' : (detailsDone ? 'done' : 'current'),
      3: !hasItems ? 'pending' : (detailsDone ? 'done' : 'current'),
      4: readyToSend ? 'current' : 'pending',
    };
    els.steps.forEach((step) => {
      step.dataset.state = state[step.dataset.step] || 'pending';
    });
  }

  function changeQuantity(id, delta) {
    const menuItem = itemById.get(id);
    if (!menuItem) return;
    const existing = findCartItem(id);
    if (!existing && delta > 0) cart.push({ ...menuItem, quantity: 1, note: '' });
    else if (existing) existing.quantity += delta;
    cart = cart.filter((item) => item.quantity > 0);
    saveCart();
    renderCart();
  }

  function removeItem(id) {
    const item = findCartItem(id);
    cart = cart.filter((entry) => entry.id !== id);
    saveCart();
    renderCart();
    if (item) announce(`${item.name} eliminado del pedido.`);
  }

  function setDrawer(open, trigger) {
    document.body.classList.toggle('order-open', open);
    els.drawer.setAttribute('aria-hidden', String(!open));
    els.drawerContent.inert = !open;
    els.drawerToggle.setAttribute('aria-expanded', String(open));
    els.backdrop.hidden = !open;
    if (open) {
      drawerTrigger = trigger || document.activeElement;
      window.setTimeout(() => els.closeDrawer.focus(), 50);
    } else if (drawerTrigger) {
      drawerTrigger.focus();
    }
  }

  function trapDrawerFocus(event) {
    if (event.key === 'Escape') {
      setDrawer(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...els.drawer.querySelectorAll('button:not(:disabled), select, input, textarea, summary, [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function cacheElements() {
    Object.assign(els, {
      greeting: document.querySelector('#greeting'), clock: document.querySelector('#clock'),
      segmentButtons: [...document.querySelectorAll('[data-segment]')],
      menuTitle: document.querySelector('#menu-title'), menuNote: document.querySelector('#menu-note'),
      menuLine: document.querySelector('#menu-line'), menuGrid: document.querySelector('#menu-grid'),
      featureImage: document.querySelector('#feature-image'), featureFallback: document.querySelector('#feature-fallback'),
      heroVideo: document.querySelector('#hero-video'), motionToggle: document.querySelector('#motion-toggle'),
      heroOrder: document.querySelector('#hero-order'), headerOrder: document.querySelector('#header-order'),
      carouselTrack: document.querySelector('#carousel-track'), carouselDots: document.querySelector('#carousel-dots'),
      carouselPrev: document.querySelector('#carousel-prev'), carouselNext: document.querySelector('#carousel-next'),
      orderCount: document.querySelector('#order-count'), orderTotal: document.querySelector('#order-total'),
      orderFolio: document.querySelector('#order-folio'), orderItems: document.querySelector('#order-items'),
      emptyOrder: document.querySelector('#empty-order'), drawer: document.querySelector('#order-drawer'),
      drawerContent: document.querySelector('#drawer-content'),
      drawerToggle: document.querySelector('#drawer-toggle'), closeDrawer: document.querySelector('#close-drawer'),
      backdrop: document.querySelector('#drawer-backdrop'), branch: document.querySelector('#branch'),
      customer: document.querySelector('#customer'), phone: document.querySelector('#phone'),
      address: document.querySelector('#address'), references: document.querySelector('#references'),
      orderNotes: document.querySelector('#order-notes'), sendOrder: document.querySelector('#send-order'),
      checkoutStatus: document.querySelector('#checkout-status'), preview: document.querySelector('#message-preview'),
      whatsappNotice: document.querySelector('#whatsapp-notice'), totalNote: document.querySelector('#total-note'),
      steps: [...document.querySelectorAll('.order-steps li')],
      live: document.querySelector('#live-region'), storageNotice: document.querySelector('#storage-notice'),
    });
    els.errors = {
      branch: document.querySelector('#branch-error'),
      customer: document.querySelector('#customer-error'),
      phone: document.querySelector('#phone-error'),
      address: document.querySelector('#address-error'),
    };
    els.inputs = {
      branch: els.branch, customer: els.customer, phone: els.phone, address: els.address,
    };
  }

  function bindEvents() {
    els.segmentButtons.forEach((button) => button.addEventListener('click', () => {
      activeSegment = button.dataset.segment;
      manualSegment = true;
      renderMenu();
    }));

    const handleAdd = (event) => {
      const button = event.target.closest('[data-add]');
      if (!button) return;
      const item = itemById.get(button.dataset.add);
      changeQuantity(button.dataset.add, 1);
      if (item) announce(`${item.name} agregado al pedido.`);
    };
    els.menuGrid.addEventListener('click', handleAdd);
    els.carouselTrack.addEventListener('click', handleAdd);

    els.carouselPrev.addEventListener('click', () => scrollCarousel(carouselIndex - 1));
    els.carouselNext.addEventListener('click', () => scrollCarousel(carouselIndex + 1));
    els.carouselDots.addEventListener('click', (event) => {
      const dot = event.target.closest('[data-slide]');
      if (dot) scrollCarousel(Number(dot.dataset.slide));
    });
    els.carouselTrack.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); scrollCarousel(carouselIndex + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); scrollCarousel(carouselIndex - 1); }
    });

    els.orderItems.addEventListener('click', (event) => {
      const increase = event.target.closest('[data-increase]');
      const decrease = event.target.closest('[data-decrease]');
      const remove = event.target.closest('[data-remove]');
      if (increase) changeQuantity(increase.dataset.increase, 1);
      if (decrease) changeQuantity(decrease.dataset.decrease, -1);
      if (remove) removeItem(remove.dataset.remove);
    });
    els.orderItems.addEventListener('input', (event) => {
      const note = event.target.closest('[data-note]');
      if (!note) return;
      const item = findCartItem(note.dataset.note);
      if (!item) return;
      item.note = note.value;
      saveCart();
      updateCheckoutState();
    });

    const openDrawer = (event) => setDrawer(true, event.currentTarget);
    els.headerOrder.addEventListener('click', openDrawer);
    els.heroOrder.addEventListener('click', openDrawer);
    els.drawerToggle.addEventListener('click', (event) => setDrawer(!document.body.classList.contains('order-open'), event.currentTarget));
    els.closeDrawer.addEventListener('click', () => setDrawer(false));
    els.backdrop.addEventListener('click', () => setDrawer(false));
    els.drawer.addEventListener('keydown', trapDrawerFocus);

    document.querySelectorAll('input[name="mode"]').forEach((radio) => radio.addEventListener('change', () => {
      showErrors = false;
      updateCheckoutState();
      saveDetails();
      announce(getMode() === 'delivery' ? 'Modalidad a domicilio.' : 'Modalidad recoger en sucursal.');
    }));

    [els.branch, els.customer, els.phone, els.address, els.references, els.orderNotes].forEach((field) => {
      field.addEventListener('input', () => { updateCheckoutState(); saveDetails(); });
      field.addEventListener('change', () => { updateCheckoutState(); saveDetails(); });
      field.addEventListener('blur', () => { showErrors = true; updateCheckoutState(); });
    });

    els.featureImage.addEventListener('error', () => { els.featureImage.hidden = true; els.featureFallback.hidden = false; });

    els.sendOrder.addEventListener('click', () => {
      showErrors = true;
      updateCheckoutState();
      const mode = getMode();
      const branch = BRANCHES.find((item) => item.id === els.branch.value);
      const errors = validateOrder({
        mode, branch: branch ? branch.name : '', customer: els.customer.value,
        phone: els.phone.value, address: els.address.value, items: cart,
      });
      if (Object.keys(errors).length > 0 || !branch || !branch.phone) return;

      const message = buildOrderMessage({
        folio: getFolio(), date: new Date(), mode, branch: branch.name,
        customer: els.customer.value, phone: els.phone.value,
        address: els.address.value, references: els.references.value,
        notes: els.orderNotes.value, items: cart,
      });
      const url = buildWhatsAppUrl(branch.phone, message);
      if (!url) return;
      window.open(url, '_blank', 'noopener,noreferrer');
      // Abrir WhatsApp no confirma el pedido: el carrito se conserva y no se
      // muestra ningún mensaje de éxito.
      els.whatsappNotice.hidden = false;
      announce('Se abrió WhatsApp con tu pedido. Todavía debes enviar el mensaje.');
    });
  }

  function init() {
    cacheElements();
    loadCart();
    loadDetails();
    if (!storageAvailable) els.storageNotice.hidden = false;
    setupHero();
    renderCarousel();
    renderMenu();
    renderCart();
    syncCarouselControls();
    updateClock();
    bindEvents();
    window.setInterval(updateClock, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());

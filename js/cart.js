(() => {
  'use strict';

  const cart = new Map();
  const $ = id => document.getElementById(id);
  const itemsEl = $('cart-items');
  const totalEl = $('cart-total');

  if (!itemsEl || !totalEl) return;

  const fmt = n => n.toLocaleString('ru-RU') + ' ₽';

 
  const change = (id, delta) => {
    const it = cart.get(id);
    if (!it) return;
    if (delta === null) cart.delete(id);
    else if ((it.qty += delta) <= 0) cart.delete(id);
    render();
  };

  const render = () => {
    if (!cart.size) {
      itemsEl.innerHTML = '<p class="hint" style="padding:10px 0;">Корзина пуста. Добавьте товары из каталога.</p>';
      totalEl.textContent = fmt(0);
      return;
    }

    let total = 0, html = '';
    cart.forEach((it, id) => {
      const sum = it.price * it.qty;
      total += sum;
      html += `
        <div class="cart-item" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div style="flex:1 1 45%;min-width:140px;">
            <div style="font-weight:600;">${it.name}</div>
            <div style="font-size:13px;color:#888;">${fmt(it.price)} / ${it.unit}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <button data-action="dec" data-id="${id}" style="width:28px;height:28px;border:1px solid #ccc;background:#fff;border-radius:6px;cursor:pointer;">−</button>
            <span style="min-width:24px;text-align:center;">${it.qty}</span>
            <button data-action="inc" data-id="${id}" style="width:28px;height:28px;border:1px solid #ccc;background:#fff;border-radius:6px;cursor:pointer;">+</button>
            <button data-action="del" data-id="${id}" title="Удалить" style="width:28px;height:28px;border:1px solid #f1c0c0;background:#fff;color:#c33;border-radius:6px;cursor:pointer;margin-left:4px;">×</button>
          </div>
          <span style="min-width:80px;text-align:right;font-weight:600;">${fmt(sum)}</span>
        </div>`;
    });
    itemsEl.innerHTML = html;
    totalEl.textContent = fmt(total);
  };

  // Один обработчик на все клики
  document.addEventListener('click', e => {
    const add = e.target.closest('.add-to-cart');
    if (add) {
      const c = add.closest('.product');
      const it = cart.get(c.dataset.id);
      it ? it.qty++ : cart.set(c.dataset.id, {
        name: c.dataset.name,
        price: +c.dataset.price,
        unit: c.dataset.unit,
        qty: 1
      });
      render();
      $('order-form')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const map = { inc: 1, dec: -1, del: null };
    change(btn.dataset.id, map[btn.dataset.action]);
  });

  $('clear-cart')?.addEventListener('click', () => {
    if (cart.size && confirm('Очистить корзину?')) { cart.clear(); render(); }
  });

  $('checkout-form')?.addEventListener('submit', e => {
    if (!cart.size) return e.preventDefault(), alert('Корзина пуста — добавьте товары из каталога.');
    const total = [...cart.values()].reduce((s, i) => s + i.price * i.qty, 0);
    alert('Заказ оформлен! Итого: ' + fmt(total));
  });

  render();
})();

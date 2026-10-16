/* @ds-bundle: {"format":4,"namespace":"Lobinho","components":[{"name":"Button"},{"name":"Badge"},{"name":"TourCard"}]} */
(function () {
  var React = window.React, h = React.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(p, keys) { var o = {}; for (var k in p) { if (keys.indexOf(k) < 0) o[k] = p[k]; } return o; }

  function Button(p) {
    var variant = p.variant || 'primary', size = p.size || 'md';
    var rest = omit(p, ['variant', 'size', 'className', 'children', 'block']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('lb-btn', 'lb-btn-' + variant, 'lb-btn-' + size, p.block && 'lb-btn-block', p.className)
    }), p.children);
  }

  function Badge(p) {
    return h('span', { className: cx('lb-badge', 'lb-badge-' + (p.tone || 'ceu'), p.className) }, p.children);
  }

  function Wave() {
    return h('svg', { className: 'lb-tour-wave', viewBox: '0 0 320 160', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true' },
      h('rect', { className: 'lb-w-sky', x: 0, y: 0, width: 320, height: 160 }),
      h('circle', { className: 'lb-w-ring', cx: 260, cy: 150, r: 96 }),
      h('circle', { className: 'lb-w-ring', cx: 260, cy: 150, r: 64 }),
      h('path', { className: 'lb-w-sea', d: 'M0 104 Q40 88 80 104 T160 104 T240 104 T320 104 V160 H0 Z' }),
      h('path', { className: 'lb-w-foam', d: 'M0 120 Q40 108 80 120 T160 120 T240 120 T320 120', fill: 'none' })
    );
  }

  function TourCard(p) {
    var meta = [p.duration, p.departure].filter(Boolean);
    return h('article', { className: cx('lb-tour', p.className) },
      h('div', { className: 'lb-tour-media' },
        p.imageSrc ? h('img', { src: p.imageSrc, alt: p.imageAlt || '' }) : h(Wave),
        p.badge ? h('div', { className: 'lb-tour-badge' }, h(Badge, { tone: p.badgeTone || 'lancha' }, p.badge)) : null
      ),
      h('div', { className: 'lb-tour-body' },
        h('h3', { className: 'lb-tour-title' }, p.title),
        meta.length ? h('p', { className: 'lb-tour-meta' }, meta.join(' · ')) : null,
        p.description ? h('p', { className: 'lb-tour-desc' }, p.description) : null,
        h('div', { className: 'lb-tour-foot' },
          p.price ? h('p', { className: 'lb-tour-price' },
            h('span', { className: 'lb-tour-from' }, p.priceLabel || 'a partir de'),
            h('strong', null, p.price),
            h('span', { className: 'lb-tour-unit' }, p.unit || 'por pessoa')) : null,
          h(Button, { onClick: p.onBook, disabled: p.soldOut }, p.soldOut ? 'Esgotado' : (p.ctaLabel || 'Reservar'))
        )
      )
    );
  }

  window.Lobinho = Object.assign(window.Lobinho || {}, { Button: Button, Badge: Badge, TourCard: TourCard });
})();

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const sass = require('sass');
const root = path.resolve(__dirname, '../..');
const componentRoot = 'src/app/views/dashboard/manufactures/';
const paths = [
  'components/manufacture-section-header/manufacture-section-header.component.scss',
  'components/manufacture-index-filters/manufacture-index-filters.component.scss',
  'productions/manufacture-production-index-page/manufacture-production-index-page.component.scss',
  'productions/manufacture-production-index/manufacture-production-index.component.scss',
  'productions/manufacture-production-index-row/manufacture-production-index-row.component.scss',
];
const css = paths.map(file => sass.compile(path.join(root, componentRoot, file)).css.replaceAll(':host', '.preview-row')).join('\n');
const local = file => pathToFileURL(path.join(root, file)).href;
const money = value => `S/ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const records = [
  [24, 'Blusa Renata · Segunda producción', 119, 4, 4069.40, 12, '20 nov 2026'],
  [22, 'Pantalón Maracuyá · Cuarta producción', 148, 166, 5480, 12, '19 nov 2026'],
  [21, 'Polo Balanza · Cuarta producción', 214, 0, 3832.30, 16, '18 nov 2026'],
];
const rows = records.map(([id, name, planned, received, total, variants, updated]) => `<tr class="preview-row">
<td class="production-name-cell"><div class="production-identity"><span class="production-mark"><i class="fa-solid fa-gears"></i></span><div class="production-name-content"><a class="production-name" href="#">${name}</a><div class="production-row-meta"><span class="production-code">PRD-${String(id).padStart(4, '0')}</span><span>${variants} variantes</span></div></div></div></td>
<td class="text-end production-number" data-label="Planificadas">${planned}</td><td class="text-end" data-label="Recibidas"><span class="production-received ${received ? 'has-receipts' : ''} ${received > planned ? 'over-planned' : ''}">${received}</span></td>
<td class="text-end production-money" data-label="Costo por unidad">${money(total / planned)}</td><td class="text-end production-money production-total" data-label="Gasto total">${money(total)}</td><td class="production-date" data-label="Actualización">${updated}</td>
<td class="production-actions-cell"><div class="manufacture-row-actions"><a class="manufacture-row-open" href="#">Abrir panel<i class="fa-solid fa-arrow-right"></i></a><button class="btn btn-outline-secondary" aria-label="Más opciones"><i class="fa-solid fa-ellipsis"></i></button></div></td></tr>`).join('');
fs.writeFileSync(path.join(__dirname, 'preview.html'), `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${local('node_modules/@coreui/coreui/dist/css/coreui.min.css')}"><link rel="stylesheet" href="${local('node_modules/@fortawesome/fontawesome-free/css/all.min.css')}"><style>${css}body{margin:0;padding:28px;background:#f3f4f8;color:#243247;font-family:system-ui,sans-serif}.production-page{max-width:1400px;margin:auto}.preview-note{font-size:12px;color:#64748b;margin-top:20px}@media(max-width:575px){body{padding:12px}}</style>
<main class="production-page manufacture-theme-production"><header class="manufacture-section-header"><div class="manufacture-heading-row"><div class="manufacture-heading-identity"><span class="manufacture-heading-icon"><i class="fa-solid fa-gears"></i></span><div><div class="manufacture-context">Fabricación</div><h1>Producciones</h1><p>Gestiona tus lotes, costos y recepciones.</p></div></div><a class="manufacture-primary-action manufacture-primary-action-dark" href="#"><i class="fa-solid fa-plus"></i>Nueva producción</a></div><nav class="manufacture-section-switch"><a class="manufacture-section-current">Producciones</a><a>Órdenes de compra</a></nav></header>
<section class="production-panel production-list-panel"><header class="production-section-heading manufacture-list-heading"><h2><span class="production-list-icon"><i class="fa-solid fa-list-ul"></i></span>Listado de producciones</h2><span class="production-list-count">3 producciones</span></header>
<form class="manufacture-filters"><div class="manufacture-filter-grid"><label class="manufacture-search-field"><span>Buscar producción</span><span class="manufacture-search-input"><i class="fa-solid fa-magnifying-glass"></i><input placeholder="Nombre o código de producción"></span></label><label><span>Desde</span><input type="date" class="form-control"></label><label><span>Hasta</span><input type="date" class="form-control"></label><div class="manufacture-filter-actions"><button type="button" class="manufacture-primary-action"><i class="fa-solid fa-magnifying-glass"></i>Buscar</button><button type="button" class="manufacture-secondary-action">Limpiar</button></div></div></form>
<div class="table-responsive production-table-region"><table class="table align-middle mb-0 production-table"><thead><tr><th>Producción</th><th class="text-end">Planificadas</th><th class="text-end">Recibidas</th><th class="text-end">Costo por unidad</th><th class="text-end">Gasto total</th><th>Actualización</th><th class="text-end">Acciones</th></tr></thead><tbody>${rows}</tbody></table></div></section><p class="preview-note">Vista ilustrativa · Datos de ejemplo.</p></main></html>`);

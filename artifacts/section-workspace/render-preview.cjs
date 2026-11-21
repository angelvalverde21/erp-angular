const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const sass = require('sass');
const root = path.resolve(__dirname, '../..');
const styles = sass.compile(path.join(root, 'src/app/views/dashboard/manufactures/productions/production-stages/production-stages.component.scss')).css.replaceAll(':host', '.preview-host')
  + sass.compile(path.join(root, 'src/app/views/dashboard/purchases/purchase-index/purchase-index.component.scss')).css;
const local = relative => pathToFileURL(path.join(root, relative)).href;
const names = ['Moldes y ploteo','Muestras','Telas e insumos','Corte','Costura','Acabados','Recepción de mercadería','Otros'];
const options = names.map((name,index) => `<option value="${index+1}" ${index===2?'selected':''}>${name}</option>`).join('');
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${local('node_modules/@coreui/coreui/dist/css/coreui.min.css')}"><link rel="stylesheet" href="${local('node_modules/@fortawesome/fontawesome-free/css/all.min.css')}">
<style>${styles}body{margin:0;padding:24px;background:#f3f4f8;color:#243247;font-family:system-ui,sans-serif}main{max-width:1280px;margin:auto}.preview-note{font-size:12px;color:#64748b;margin:24px 0 0}@media(max-width:575px){body{padding:12px}}</style>
<main class="preview-host"><section class="stage-workspace">
<button class="production-back"><i class="fa-solid fa-arrow-left"></i>Retroceder</button>
<div class="workspace-chrome">
<header class="workspace-header"><div class="workspace-heading"><div class="workspace-context"><span class="workspace-eyebrow">PRD-0021 · ETAPA 3 DE 8</span><button class="workspace-files"><i class="fa-solid fa-paperclip"></i>Archivos</button></div><div class="workspace-title-row"><h2>Telas e insumos</h2><span class="workspace-status in-progress">En proceso</span></div></div></header>
<div class="workspace-navigation"><nav class="section-switcher"><label>Cambiar de sección<select>${options}</select></label><div class="section-direction"><button class="btn btn-secondary section-next">Siguiente proceso<i class="fa-solid fa-chevron-right"></i></button></div></nav></div>
<div class="workspace-panels"><nav class="section-tabs"><button class="active"><i class="fa-solid fa-bag-shopping"></i>Compras</button><button><i class="fa-solid fa-truck-fast"></i>Seguimiento</button><button><i class="fa-solid fa-clock-rotate-left"></i>Historial</button></nav>
<div class="section-tabpanel">
<section class="production-expenses production-expenses-compact"><header class="production-expenses-heading"><dl class="production-expenses-summary"><div class="production-expenses-total"><dt>Total</dt><dd>S/ 1,200.00</dd></div><div><dt>Registros</dt><dd>1</dd></div></dl><button class="production-expense-primary"><i class="fa-solid fa-plus"></i>Registrar compra</button></header>
<article class="production-expense-card"><header class="production-expense-card-header"><span class="production-expense-icon"><i class="fa-solid fa-receipt"></i></span><div class="production-expense-identity"><h3>Proveedor de ejemplo</h3><div class="production-expense-meta"><span>Registro #01</span><span>20 nov 2026</span></div></div></header>
<div class="production-expense-table-scroll"><table class="table production-expense-table mb-0"><thead><tr><th>Concepto</th><th class="text-end">Cantidad</th><th class="text-end">Precio unitario</th><th class="text-end">Importe</th></tr></thead><tbody><tr><td class="production-expense-description"><strong>Tela para el lote</strong></td><td class="text-end" data-label="Cantidad">40 metros</td><td class="text-end" data-label="Precio unitario">S/ 25.00</td><td class="text-end" data-label="Importe">S/ 1,000.00</td></tr><tr><td class="production-expense-description"><strong>Hilos y avíos</strong></td><td class="text-end" data-label="Cantidad">1 lote</td><td class="text-end" data-label="Precio unitario">S/ 200.00</td><td class="text-end" data-label="Importe">S/ 200.00</td></tr></tbody></table></div><footer class="production-expense-delivery"><div class="production-expense-footer-meta"><div class="production-expense-attachment-counts"><span class="has-attachments"><i class="fa-solid fa-file-invoice"></i><strong>2</strong> comprobantes</span><span class="has-attachments"><i class="fa-solid fa-paperclip"></i><strong>3</strong> archivos</span></div></div><div class="production-expense-amount"><span>Importe total</span><strong>S/ 1,200.00</strong></div></footer></article></section>
</div></div></div>
<button class="btn btn-dark stage-finish-action"><i class="fa-solid fa-check"></i>Culminar etapa</button></section><p class="preview-note">Vista ilustrativa del diseño · Datos de ejemplo.</p></main></html>`;
fs.writeFileSync(path.join(__dirname,'preview.html'),html);

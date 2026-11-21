const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const sass = require('sass');
const root = path.resolve(__dirname,'../..');
const css = sass.compile(path.join(root,'src/app/views/dashboard/manufactures/productions/manufacture-production-edit-page/manufacture-production-edit-page.component.scss')).css
  + sass.compile(path.join(root,'src/app/views/dashboard/manufactures/productions/production-stages/production-stage-stepper.component.scss')).css.replaceAll(':host','.preview-stepper');
const local = relative => pathToFileURL(path.join(root,relative)).href;
const stages = [
  ['Moldes y ploteo','ruler-combined','in_progress',2], ['Muestras','shirt','pending',0],
  ['Telas e insumos','layer-group','in_progress',2], ['Corte','scissors','in_progress',1],
  ['Costura','gears','in_progress',1], ['Acabados','wand-magic-sparkles','pending',0],
  ['Recepción','box-open','pending',0], ['Otros','boxes-stacked','in_progress',2],
];
const labels = { pending:'Pendiente', in_progress:'En proceso' };
const cards = stages.map(([name,icon,status,count],i) => `<button class="stage-step ${status}"><span class="step-heading"><span class="step-number"><i class="fa-solid fa-${icon}"></i></span><span class="step-title"><span class="step-order">0${i+1}</span><strong>${name}</strong></span><i class="step-open fa-solid fa-chevron-right"></i></span><span class="step-summary"><span class="step-status"><i class="fa-solid fa-circle"></i><span class="step-status-full">${labels[status]}</span><span class="step-status-short">${status==='in_progress'?'En curso':'Pendiente'}</span></span><span class="step-purchase-count">${i===6?'Mercadería':count+(count===1?' compra':' compras')}</span></span></button>`).join('');
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${local('node_modules/@coreui/coreui/dist/css/coreui.min.css')}"><link rel="stylesheet" href="${local('node_modules/@fortawesome/fontawesome-free/css/all.min.css')}"><style>${css}body{margin:0;padding:28px;background:#f3f4f8;color:#243247;font-family:system-ui,sans-serif}.production-page{max-width:1280px;margin:auto}.preview-note{font-size:12px;color:#64748b;margin:24px 0 0}@media(max-width:575px){body{padding:12px}}</style>
<main class="production-page"><header class="production-header"><nav><a>Fabricación / Producciones</a><span>/ PRD-0021</span></nav><div class="production-header-main"><div><div class="production-title-row"><h1>POLO BALANZA 4TA PRODUCCIÓN</h1><span class="production-status in-progress">En proceso</span></div><p>PRD-0021 · Gestión y seguimiento de fabricación</p></div><div class="production-header-actions"><a>Editar datos</a><a class="production-new-action">Nueva producción</a></div></div></header>
<div class="production-summary-strip"><span>Gasto total<strong>S/ 3,832.30</strong></span><span>Costo por unidad<strong>S/ 17.91</strong></span><span>Planificadas<a><strong>214</strong></a></span><span>Recibidas<a><strong>214</strong></a></span><a>Seguimiento de entregas<strong>0</strong><i class="fa-solid fa-arrow-right"></i></a></div>
<div class="preview-stepper"><section class="stage-flow"><header><div><h2>Etapas de producción</h2><p>Selecciona una etapa para ver y completar sus datos.</p></div></header><nav class="stage-stepper">${cards}</nav></section></div><p class="preview-note">Vista ilustrativa del diseño · Datos de ejemplo.</p></main></html>`;
fs.writeFileSync(path.join(__dirname,'preview.html'),html);

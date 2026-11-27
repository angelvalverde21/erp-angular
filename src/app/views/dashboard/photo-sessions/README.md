# Sesiones fotográficas

Se mantienen las convenciones index-page/index, create-page/create y edit-page/edit.
Las páginas coordinan navegación y API; los formularios emiten datos tipados. La
edición reutiliza el formulario de creación, ocultando los selectores de participantes
porque se administran directamente en las tarjetas de la sesión.

El menú lateral contiene exclusivamente Sesiones, Fotógrafos, Modelos y Locaciones.
Los directorios usan contacts/ y locations/; los contactos no crean usuarios del ERP.
Los empleados sin acceso administrativo ven solo sesiones con tareas a su cargo y
abren sus tareas dentro de photo-sessions/:photo_session_id/tasks. No existe una
sección ni un menú global de tareas. El servidor valida tienda y empleado activo.

La creación pide nombre, campaña, fecha, horario y selectores múltiples de fotógrafos,
modelos y locaciones. El estado inicial En preparación corresponde a planned y se
impone también en la API. Las altas en el mismo lugar se coordinan una sola vez en
shared/photo-related-create, que reutiliza los formularios de directorio y el dialog
animado. La opción guardada se selecciona sin perder el borrador de la sesión.

photo-session-workspace mantiene visibles las tarjetas de tareas, fotógrafos,
modelos y locaciones. Su menú desplaza hasta cada sección, sin pestañas que oculten
contenido. No hay tarjetas de responsable sin asignar, resúmenes duplicados ni un
bloque que mezcle participantes. photo-session-assignment-index reutiliza presentación
y selección; emite attach/detach y solicitudes de creación. La API modifica solo
la relación solicitada bajo bloqueo del registro de sesión. Quitar una asignación
no elimina su ficha. La biblioteca permanece montada durante estos cambios.

Los cambios generales de planificación no envían relaciones de participantes. Las
altas en las tarjetas actualizan las relaciones del objeto actual sin reiniciar un
formulario de planificación con cambios pendientes. Esto evita sobrescribir datos
cuando el usuario combina edición y asignaciones en la misma página.

Las relaciones múltiples viven en photo_session_photographers, photo_session_models
y photo_session_locations. La migración conserva los enlaces singulares anteriores;
los campos antiguos siguen reflejando el primer registro por compatibilidad.

Las tareas usan el modelo genérico Task, HasTasks y las tablas tasks/task_events.
El propietario se identifica por taskable_type/taskable_id; photo_session es un
alias explícito. El adaptador de API de sesiones exige contexto de sesión y aplica
sus permisos. CEO/master asigna y reasigna; cada empleado activo puede actualizar
solo sus tareas. Bloquear exige nota. El historial conserva autor, fecha, cambios y
notas; version protege de escrituras simultáneas. Los contadores se calculan antes
de filtrar y paginar. Las tareas se agregan después de crear la sesión.

Los responsables internos se obtienen de options.employees y la pertenencia se
valida también en el servidor. Las direcciones de locaciones usan addresses anidado
y el selector de distrito existente; no se mezclan con ubicaciones de inventario.

Los modelos tienen pestañas Datos/Galería en contacts/photo-model-profile, con foto
de referencia a la derecha y arriba en móvil. La galería reutiliza ImageIndex con
layout grid, thumbnail y lightbox large. Las tarjetas de la sesión reutilizan
ImagePreview para mostrar miniaturas de modelos. Se conservan las tres versiones.

La biblioteca y la cola de carga son componentes separados. El transporte original
va directamente a B2 mediante XHR sin token del ERP; las vistas previas son copias
independientes y el File original se conserva. Los buckets elegidos son temporalmente
públicos: erp-photo-originals y erp-photo-previews. La firma de URLs permite privatizar luego
los originales. La configuración de credenciales/CORS se documenta en el backend,
docs/photo-sessions.md. No se simulan archivos, sesiones ni estados completados.

La carga se abre desde el botón de Biblioteca de la sesión mediante
photo-session-upload-dialog. El contenedor mantiene la cola montada aunque se
oculte la ventana: no aborta archivos al cerrar el modal. El botón cambia a Ver carga
mientras trabaja. Cada archivo guardado actualiza la biblioteca; al completar toda
la cola sin errores el modal se cierra y se muestran los nuevos archivos sin filtros
previos. Si falla una vista previa, el original ya guardado también se incorpora a
la biblioteca y el error permanece disponible para reintentar.

shared/photo-dialog concentra el dialog nativo y sus animaciones; lo reutilizan
las altas de directorio y la carga. El progreso y la biblioteca no dependen de que
la ventana esté abierta. El guard de salida y beforeunload siguen protegiendo las
cargas activas cuando el usuario navega fuera de la sesión o cierra el navegador.

Los dialogs animan entrada (220 ms) y salida (160 ms), también tras guardar. Respetan
prefers-reduced-motion y evitan envíos o cierres repetidos durante la salida.

Verificación: npx ng test --configuration initial-import-module y ng build con
configuration development. Las migraciones y permisos se verifican en PhotoSessionTest.

Las tarjetas de fotógrafo, modelo y locación ofrecen Agregar compra junto a Ver ficha.
El botón abre directamente PurchaseCreate con los mismos conceptos, cantidades,
unidades y precios del resto del ERP. Las tareas también permiten crear compras.
El proveedor se muestra con el nombre de la ficha sin duplicar personas; para tareas
y locaciones sin contacto se selecciona un proveedor de la tienda. El servidor valida
el vínculo con la sesión y conserva el origen al editar la compra.

El importe Compras de cada ítem abre su historial con PurchaseIndex: desde allí se
consultan conceptos, adjuntos y pagos de cada compra. Los pagos directos anteriores
se conservan en un apartado del historial. Las compras y sus pagos se consolidan una
sola vez en la colección. Se requiere la migración
2026_11_25_110000_add_photo_source_to_purchases.php junto al backend y frontend.

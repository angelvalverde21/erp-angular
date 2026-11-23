# Contexto técnico para continuar la sesión — ERP Sorelle

Última actualización: **23 de noviembre de 2026**, zona horaria `America/Lima`.

Este archivo resume el trabajo de la conversación y contrasta los puntos principales con los archivos locales. El `README.md` original se conserva. No contiene credenciales. La creación de este documento no ejecutó cambios en Shopify ni en bases de datos.

## 0. Resumen listo para pegar en una nueva sesión

```text
Continuamos el ERP Sorelle. Frontend: C:\Users\User\Documents\angular\erp
(Angular 20/CoreUI). Backend: C:\xampp\htdocs\erp (Laravel 12/PHP 8.2/MySQL).
Revisa git status en ambos repositorios y conserva los cambios existentes.

La sección actual es COLECCIONES, en /sorelle/dashboard/collections.
Se eliminó la entidad Proyecto. Las mediciones se realizan por colección:
procesos, compras, pagos, productos de manufactura, ventas atribuidas,
cobros, recuperación de inversión y avance operativo. No hay presupuesto obligatorio.

BD local: ambas migraciones se ejecutaron (batches 45 y 46):
2026_11_22_100000_create_projects_workspace.php
2026_11_22_230000_make_collections_independent.php
La segunda eliminó projects y projects_collections y conservó los IDs y datos.
Tablas actuales: collections, collections_processes, collections_sales,
collections_receipts y collections_products (esta última heredada y sin uso).
Se verificó la conservación de una colección con dos procesos y su dashboard.
La copia previa está en Laravel:
storage/app/private/collections-before-project-removal-20261122-231819.json.
No recrear proyectos ni repetir migraciones ya aplicadas. El down de la segunda
migración no restaura la agrupación: se requiere la copia para recuperarla.

Productos: aparecen SOLO desde las producciones u órdenes de compra vinculadas.
Compras: siempre pertenecen a un proceso. Una manufactura/sesión puede existir
independientemente y luego vincularse; no duplicar sus compras ni su historial.
Ventas y cobros conserva el detalle manual por origen, con límites por pedido y
recepciones de kardex. Cobros/devoluciones manuales con referencia. Moneda PEN.
Aclaración del 23/11/2026: se restauró la distribución original del Dashboard:
cuatro indicadores, card Resultados a la izquierda y avance de procesos a la derecha,
próximas actividades y gráfica de pagos/cobros. Los indicadores conservan summary.
El card Resultados reemplaza la recuperación anterior y muestra SOLO ventas totales
(x pedidos), gasto en compras y saldo por recuperar, calculados con overview.
No hay pestaña Resultados ni botón Ver resultados. ?view=results abre el dashboard.
No sustituir el dashboard original por estas tres cifras.
Las ventas del resumen
se calculan automáticamente por productos de la colección, no por atribuciones
manuales. Se cuenta cada pedido una vez y solo se suman sus líneas de productos
de la colección. Se excluyen anulados, cantidades devueltas y monedas no PEN.
Recuperación = ventas / compras; pendiente = máximo(compras − ventas, 0).
Rojo <50 %, amarillo 50–100 % inclusive, verde >100 %. Sin gasto: neutro.
Se verificó que orders local solo tiene id/fechas y cero registros; order_items
no existe. ordersReady() comprueba el esquema antes de consultar: cero ventas
si está vacía; no disponibles si hay datos antiguos sin estructura suficiente.
El dashboard real #1 ya carga sin error SQL. No se migró orders para este arreglo.
Falta completar instalación/importación de pedidos para ver ventas reales.
Laravel devuelve overview para este resumen; summary y los cobros manuales
son históricos y se conservan para otras funciones. Este cambio no migró la BD.

UI: tablas, fuentes principales de 16 px y botones con iconos, títulos y nombres
accesibles. No volver a tarjetas o vínculos subrayados para las acciones.
Modales con transición de apertura/cierre de 200 ms y movimiento reducido.
Añadir existente utiliza ng-select: búsqueda integrada, sin input aparte,
nombre y fecha de creación de Lima. Su panel se adjunta al propio diálogo.
Pestañas: Colecciones tiene entrada suave de 300 ms sin recargar datos de la API;
Sesiones fotográficas tiene fundido cruzado de 280 ms y conserva los paneles,
los borradores y la biblioteca. Respetar movimiento reducido.
Última corrección: Procesos tiene acciones fijas FUERA del área desplazable de
datos. No usar sticky superpuesto que tape Compras/Pagado. Filas alineadas;
en móvil los botones se distribuyen en dos filas. Tipo debajo del nombre;
no repetir la colección como columna.

Código: Angular src/app/views/dashboard/collections/ y tsconfig.collections-tests.json.
Laravel: CollectionDashboardController, Services/Collections/CollectionWorkspace,
Models/Collection y API /api/v1/{store}/dashboard/collections.
ProjectProcess, ProjectSale y ProjectReceipt conservan sus nombres internos,
pero usan collections_*. No cambiar sin migración el tipo polimórfico existente
App\Models\ProjectProcess ni el identificador API project_process.

Verificado: 21 pruebas Laravel (192 aserciones), 13 pruebas de Colecciones y 47 de Sesiones fotográficas (Angular) y build de
producción correcto en dist/proyecto-para-nube; incluye el ajuste móvil final.
No se ejecutó una única suite global. No hay commits ni despliegue confirmado.

Se conservan cambios anteriores: listado de productos 50 por página, exportación
Shopify máximo 35, borradores con todos los canales disponibles y 4 unidades
iniciales por variante con seguimiento; no reiniciar stock al reintentar.
La reparación histórica de Shopify ya se realizó: NO repetirla para probar.

Pendiente: revisar diffs y desplegar ambos proyectos al hosting; aplicar allí
las migraciones que falten, limpiar rutas y comprobar Colecciones y Shopify.
Las mejoras de atribución automática, conciliación y exportación de reportes
son posibilidades futuras, no funcionalidades implementadas.
Documentación detallada vigente: README_COLECCIONES.md.
```

## 1. Entorno y alcance

| Parte | Ubicación / tecnología |
| --- | --- |
| Frontend | `C:\Users\User\Documents\angular\erp` — Angular 20, CoreUI, formularios reactivos |
| Backend | `C:\xampp\htdocs\erp` — Laravel 12, PHP 8.2+, MySQL |
| Pantallas principales trabajadas | `/sorelle/dashboard/collections` y `/sorelle/dashboard/products` en `http://localhost:4200` |
| Backend configurado para producción en Angular | `https://3b.pe/laravel` |
| Tienda ERP | Slug `sorelle` |
| Tienda Shopify | `sorelleperu.myshopify.com` |
| API Shopify de catálogo | Admin GraphQL, versión predeterminada `2026-10` |

Son dos repositorios/directorios de trabajo. Revisar `git status` en ambos antes de editar o desplegar. La aplicación está en funcionamiento; este documento no es una auditoría completa de todos sus módulos.

## 2. Decisiones vigentes: productos y Shopify

- **Listado y búsquedas: 50 productos por página.** El listado principal carga páginas adicionales conforme se necesita.
- **Selección/exportación: máximo 35 productos por lote.** Es independiente de los 50 resultados por página.
- Al crear un producto, **Mujer** se selecciona por defecto si existe entre las categorías recibidas. El usuario puede cambiarla. Se contempla la llegada posterior de las categorías y su estructura con hijos.
- **Material es opcional** en edición. La publicación de catálogo no exige ese dato.
- La etiqueta del listado es **Exportado a Shopify** y solo corresponde a exportaciones manuales confirmadas en `shopify_product_exports`, estado `synced`, para la tienda y el dominio configurados.
- No usar `products.origin` ni los identificadores Shopify de variantes para marcar importaciones antiguas como exportaciones manuales. Esa primera implementación se corrigió por solicitud del usuario.
- La etiqueta se actualiza al publicar o restablecer desde la selección. Es evidencia del registro de exportación del ERP; no consulta en tiempo real si el producto sigue existiendo en Shopify.

### Comportamiento de las próximas exportaciones

1. Revisar selección, título y variantes mediante una vista previa con token vinculado al usuario, tienda, producto y datos aprobados.
2. Comprobar permisos de Shopify y consultar las publicaciones de canales de venta de tipo `APP`, con paginación.
3. Crear el producto con título, opciones y SKU de variantes, en estado **DRAFT**.
4. Al crear cada variante, enviar:

   ```php
   'inventoryItem' => ['tracked' => true],
   'inventoryQuantities' => [[
       'locationId' => $locationId,
       'name' => 'available',
       'quantity' => 4,
   ]],
   ```

5. La ubicación es la **sucursal principal de Shopify** obtenida mediante `location`; debe estar activa y habilitada para preparar pedidos online.
6. Seleccionar todos los canales de venta disponibles antes de marcar el envío como completado.
7. Guardar el registro de exportación y los vínculos de variantes en el ERP.

**No se envían fotos ni precios. Las 4 unidades son inventario inicial de Shopify; no se copian ni descuentan del stock del ERP.**

Los productos permanecen en **Borrador** hasta que el usuario los active en Shopify. La disponibilidad en canales y el estado del producto son ajustes distintos. Shopify también puede imponer condiciones propias de cada canal.

### Reintentos y errores

- Cada exportación tiene un `handle` generado y un metafield Shopify `erp.catalog_export` para reconciliar creaciones que pudieron completarse aunque la respuesta fallara.
- Si el producto remoto ya existe, el reintento lo consulta antes de intentar crear otro.
- **El inventario inicial de 4 solo se asigna durante la creación.** Un reintento no debe restablecer cantidades modificadas por ventas o por el usuario.
- Si falla la selección de canales, el envío queda pendiente de corrección/reintento, sin presentarse como una exportación completada.
- El token de revisión vence y se comprueba la huella de los datos para impedir publicar información modificada después de revisarla.

### Restablecer

- La selección masiva ofrece **Restablecer en Shopify** con revisión antes de eliminar.
- Solo permite operar sobre productos cuya exportación pertenece al ERP y corresponde al identificador de exportación remoto.
- Elimina el producto remoto y limpia los vínculos correspondientes para permitir una nueva exportación; conserva producto y stock del ERP.
- Ante errores o respuestas ambiguas, conserva datos para reconciliar el resultado al reintentar. No quitar esas comprobaciones de propiedad y concurrencia.

## 3. Corrección realizada directamente en Shopify

Estas operaciones **sí se ejecutaron en la tienda real**, a diferencia de los cambios de código que necesitan despliegue:

- El usuario inicialmente indicó 30 productos. La inspección encontró **31 productos del lote**, más **Producto de prueba 1** de una exportación anterior.
- Tras aclararlo, autorizó corregir los **31 productos** y excluir únicamente **Producto de prueba 1**.
- El lote tenía **78 variantes** y se asignaron sus **4 canales de venta**.
- Se habilitó el seguimiento de inventario en la sucursal **Mz g lot 3 patria nueva**.
- Primero se establecieron 10 unidades por variante; después el usuario corrigió la petición a **4 unidades por variante**. La última operación quedó verificada con 31 productos y 78 variantes a 4 unidades disponibles cada una.
- Se utilizaron consultas previas, claves de idempotencia y comparación de cantidades para la corrección de inventario.
- La reparación de canales/inventario no cambió el estado de los productos. En aquella verificación los 31 estaban en `DRAFT`.

Estos son resultados de la intervención del **21 de noviembre de 2026**; no se ha vuelto a consultar el inventario en vivo para preparar este resumen. Ventas o cambios posteriores pueden haber alterado el estado.

Artefactos privados en Laravel, bajo `storage/app/private/`:

- `shopify-export-repair-inspection.json`
- `shopify-export-repair-plan.json`
- `shopify-export-repair-audit.json`
- `shopify-export-quantity-4-audit.json`
- `shopify-export-repair.php`

El script es una utilidad puntual para el lote identificado, no el flujo habitual de exportación. **No volver a ejecutarlo para probar el proyecto:** sus modos `apply` y `quantity-4` modifican Shopify y están vinculados a ese lote.

## 4. Configuración del hosting: problema y diagnóstico

El hosting mostraba: **Esta tienda no está vinculada a la conexión de catálogo Shopify.** La comparación está en `CatalogPublisher::connection()`:

```php
$store->slug !== config('shopify.catalog_store_slug')
```

El diagnóstico del servidor devolvió `catalog_setting_present: true` y `catalog_store_slug: ""`: existía la clave de configuración pero su valor estaba vacío.

Se corrigieron los archivos locales `.env` y `.env_hosting.txt` para incluir una sola entrada:

```dotenv
SHOPIFY_CATALOG_STORE_SLUG=sorelle
```

Además, `.env_hosting.txt` tenía una cabecera del administrador de archivos (`text/x-generic ...`) que no era sintaxis válida de dotenv. Se eliminó y se validó el formato de ambos archivos.

**Laravel no carga `.env_hosting.txt` automáticamente.** El contenido de ese archivo debe copiarse al `.env` correcto del hosting, conservando las credenciales de producción. No sustituirlo por el `.env` de desarrollo.

En `routes/web.php`, `/config` ahora limpia/regenera la caché, invalida el archivo cacheado en OPcache si está disponible y devuelve un JSON de diagnóstico limitado a esta configuración:

- `catalog_setting_present`, `catalog_store_slug`
- `environment_file`, `environment_file_status`
- `file_catalog_setting_present`, `file_catalog_store_slug`
- `server_catalog_store_slug`

URL utilizada: `https://3b.pe/laravel/config`. Si devuelve únicamente el texto `config`, se está ejecutando la versión anterior de la ruta.

No se confirmó en esta conversación un JSON final del hosting con el slug correcto. Sí se pudo acceder a la API Shopify con las credenciales existentes para la reparación autorizada.

La conexión usada para esa reparación tenía permisos de productos, publicaciones e inventario. El exportador exige `write_products`, `write_publications` y `write_inventory`; las consultas requieren los accesos de lectura correspondientes. No imprimir tokens ni copiar archivos de entorno completos al chat o a documentación pública.

## 5. Compras y producción: comportamiento final solicitado

- Los modales **Registrar compra** y **Editar compra** muestran el nombre de la producción cuando se abren desde su espacio de producción.
- **Datos de la compra** se abre por defecto para mostrar el proveedor.
- El formulario de **entrega comienza cerrado**, incluso en Muestras y Costura. El usuario lo abre con **Añadir entrega**.
- La fecha prevista de entrega es **opcional para registrar una compra** tanto en Angular como en Laravel.
- Si no se proporciona fecha prevista, se registra la compra sin crear seguimiento de entrega. Si se activa la entrega y se proporciona la fecha, se crea ese seguimiento.
- Se retiró el bloque extenso de avisos de validación añadido inicialmente: el usuario pidió descartarlo.
- En la edición de compras de producción se puede cambiar el proceso/sección.
- Cada compra ofrece además **Cambiar sección** desde su menú de tres puntos, usando el endpoint existente de asignación de `ProductionStageService`.
- La compra pasa al proceso elegido y el total de la producción se conserva. El formulario de reasignación mantiene la elección cuando hay un error y permite reintentar.

## 6. Archivos principales para continuar

### Angular, rutas relativas al frontend

- `src/app/views/dashboard/collections/`: sección principal, dashboard, tablas, modales y selector de procesos con ng-select.
- `src/app/views/dashboard/dashboard.routes.ts`: ruta Colecciones y redirección de las direcciones antiguas de Proyectos.
- `src/app/layout/default-layout/_nav.ts`: menú Colecciones.
- `tsconfig.collections-tests.json`: pruebas focalizadas de la sección.

- `src/app/interfaces/product.interface.ts`: propiedad `shopify_linked`.
- `src/app/views/dashboard/products/product-index/`: listado, etiqueta y selección hasta 35.
- `src/app/views/dashboard/products/product-shopify-bulk/`: revisión, exportación, restablecimiento y explicación de las 4 unidades iniciales.
- `src/app/views/dashboard/products/shopify-catalog.service.ts`: llamadas a la API de catálogo.
- `src/app/views/dashboard/products/product-create/`: categoría Mujer por defecto.
- `src/app/views/dashboard/products/product-edit/`: material opcional.
- `src/app/views/dashboard/purchases/purchase-create/`: proveedor visible y entrega inicialmente desactivada.
- `src/app/views/dashboard/purchases/purchase-edit/`: selector de proceso.
- `src/app/views/dashboard/purchases/purchase-index/`: nombre de producción y menú de reasignación por compra.
- `src/app/views/dashboard/purchases/purchase-form/`: proveedor, fechas y botón de entrega.
- `src/app/views/shared/components/delivery-tracking/delivery-setup.component.*`: configuración de entrega inicial sin fecha obligatoria.
- `src/app/views/dashboard/manufactures/productions/production-stages/`: contexto de producción y actualización de compras por sección.

### Laravel, rutas relativas al backend

- `app/Http/Controllers/Api/Dashboard/CollectionDashboardController.php`: API y autorización de colecciones.
- `app/Services/Collections/CollectionWorkspace.php`: mediciones independientes y atribución de ventas por origen.
- `app/Models/Collection.php`: entidad principal; los modelos internos ProjectProcess/ProjectSale/ProjectReceipt usan las tablas `collections_*`.
- `tests/Feature/CollectionsWorkspaceTest.php`: migración de datos, aislamiento por tienda y mediciones por colección.
- `database/migrations/2026_11_22_100000_create_projects_workspace.php` y `2026_11_22_230000_make_collections_independent.php`: secuencia de esquema ya aplicada en local.

- `app/Services/Shopify/Catalog/CatalogClient.php`: GraphQL, permisos, canales e inventario inicial de 4.
- `app/Services/Shopify/Catalog/CatalogPublisher.php`: revisión, reconciliación, publicación, persistencia y restablecimiento.
- `app/Services/Shopify/Catalog/CatalogPayload.php`: título, opciones, SKU y huella del catálogo.
- `app/Http/Controllers/Api/Dashboard/ProductShopifyPublishController.php`: autorización y máximo 35 productos.
- `app/Services/Dashboard/Product/ProductService.php`: paginación de 50 y etiqueta basada solo en exportaciones manuales confirmadas.
- `app/Services/Dashboard/Purchase/PurchaseService.php`: compra sin fecha de entrega obligatoria.
- `app/Models/ShopifyProductExport.php`: registro de exportaciones existente.
- `config/shopify.php`: configuración de tienda, token y versiones de API.
- `routes/api-v1/api-dashboard.php`: endpoints del dashboard.
- `routes/web.php`: diagnóstico de configuración del hosting.

Endpoints del catálogo, bajo `/api/v1/{store}/dashboard/products`:

```text
POST /shopify/preview
POST /{product_id}/shopify-publish
POST /{product_id}/shopify-reset
```

## 7. Base de datos

- **Colecciones sí modificó el esquema de la base local:** se ejecutó la creación inicial y después la migración a colecciones independientes. Estado comprobado: ambas `Ran`, batches 45 y 46.
- Se eliminaron las tablas `projects` y `projects_collections`; los registros se trasladaron a `collections`, conservando IDs y relaciones. Las tablas dependientes se renombraron a `collections_processes`, `collections_sales`, `collections_receipts` y `collections_products`.
- La tabla `collections_products` es heredada y no participa en el listado ni permite asociación manual de productos.
- Se conservó una copia privada antes de eliminar proyectos. Consultar [README_COLECCIONES.md](README_COLECCIONES.md) para ubicación y recuperación. No usar rollback esperando reconstruir automáticamente la antigua jerarquía.
- Para los ajustes anteriores de productos y Shopify no se necesitó una nueva modificación de esquema.
- Se reutiliza la tabla existente `shopify_product_exports`; la migración de creación ya existía al iniciar estos trabajos.
- Los flujos de publicar/restablecer/reasignar sí escriben datos cuando el usuario los usa; eso es distinto de modificar el esquema.
- La reparación puntual realizó cambios en inventario y publicaciones de **Shopify**, no en el stock del ERP.
- Las pruebas PHP indicadas se ejecutaron con bases SQLite temporales en memoria, no contra la base real.

## 8. Validaciones ejecutadas durante la conversación

| Alcance | Último resultado reportado |
| --- | --- |
| Colecciones Laravel: migración, preservación, aislamiento y mediciones | 21 pruebas, 192 aserciones |
| Colecciones Angular: formularios, ng-select y acciones independientes del desplazamiento | 13 pruebas satisfactorias |
| Sesiones fotográficas Angular: pestañas, teclado y conservación de contenido | 47 pruebas satisfactorias |
| Compilación de producción de Angular | Correcta; salida `dist/proyecto-para-nube`, incluido el último ajuste móvil |
| Exportación Shopify, permisos, 4 unidades iniciales, canales y reintentos | 16 pruebas PHP, 143 aserciones |
| Catálogo Angular: selección, publicación y restablecimiento | 30 pruebas satisfactorias |
| Paginación y ordenación del catálogo Laravel, incluyendo 50 por página | 7 pruebas PHP, 67 aserciones |
| Compras y procesos Angular, incluyendo cambio de sección y entrega cerrada | 75 pruebas satisfactorias |
| Formularios de creación/edición de productos | 12 pruebas satisfactorias en su ejecución específica |

Son ejecuciones por módulos realizadas en distintos momentos, no el resultado de una única ejecución completa de toda la aplicación. No se repitieron pruebas para escribir este README.

Comandos de referencia:

```powershell
# En C:\xampp\htdocs\erp
php vendor/phpunit/phpunit/phpunit tests/Feature/ProductShopifyPublishTest.php
php vendor/phpunit/phpunit/phpunit tests/Feature/ProductCatalogSortTest.php
php vendor/phpunit/phpunit/phpunit tests/Feature/CollectionsWorkspaceTest.php

# En C:\Users\User\Documents\angular\erp
npx ng test --configuration=catalog-module --reporters=dots
npx ng test --configuration=production-module --include=src/app/views/dashboard/purchases/purchase-index/production-expenses.spec.ts --include=src/app/views/dashboard/manufactures/productions/production-stages/production-stages.spec.ts --reporters=dots
npx ng test --watch=false --browsers=ChromeHeadless --ts-config=tsconfig.collections-tests.json --include=src/app/views/dashboard/collections/collections.component.spec.ts --reporters=dots
npx ng build --configuration=production
```

En el entorno de trabajo, Angular necesitó ejecución fuera del aislamiento para iniciar el compilador y ChromeHeadless (`spawn EPERM` dentro del aislamiento).

## 9. Estado de Git al preparar este resumen

**Actualización al cierre:** además de los cambios históricos listados abajo, Angular tiene cambios de navegación y los archivos nuevos de `collections/`, `tsconfig.collections-tests.json` y los README. Laravel tiene el controlador, servicio, modelos dependientes, pruebas y dos migraciones de Colecciones, además de cambios en `Collection.php`, `PhotoSession.php`, `PurchaseService.php` y las rutas del dashboard. No se hicieron commits ni se confirmó despliegue. Revisar `git status` y los archivos no rastreados de ambos repositorios antes de preparar uno.

Frontend, cambios históricos de productos que siguen presentes:

```text
src/app/views/dashboard/products/product-index/product-index.component.html
src/app/views/dashboard/products/product-index/product-index.component.ts
src/app/views/dashboard/products/product-shopify-bulk/product-shopify-bulk.component.html
src/app/views/dashboard/products/product-shopify-bulk/product-shopify-bulk.spec.ts
```

Backend, cambios históricos de Shopify que siguen presentes:

```text
.env_hosting.txt
app/Services/Dashboard/Product/ProductService.php
app/Services/Shopify/Catalog/CatalogClient.php
app/Services/Shopify/Catalog/CatalogPublisher.php
routes/web.php
tests/Feature/ProductCatalogSortTest.php
tests/Feature/ProductShopifyPublishTest.php
```

Otros cambios de la conversación ya estaban presentes en archivos que no aparecían modificados en ese momento. No asumir que el listado anterior cubre todo el historial ni que todos los cambios ya se desplegaron. No incluir credenciales de `.env_hosting.txt` en un commit o resumen compartido.

## 10. Próximos pasos

### Colecciones y último ajuste visual

1. Revisar y desplegar Angular y Laravel juntos. El cambio ya está instalado en la base **local**; el hosting no se verificó ni se migró desde esta sesión.
2. En hosting comprobar las migraciones aplicadas. Si falta la inicial, ejecutar primero `2026_11_22_100000_create_projects_workspace.php`; después `2026_11_22_230000_make_collections_independent.php`. Usar `php artisan migrate --path=database/migrations/NOMBRE.php` y `php artisan route:clear`. No repetir las ya registradas ni borrar datos de producción para hacerlas pasar.
3. Abrir `/sorelle/dashboard/collections` y comprobar que las colecciones y procesos anteriores siguen presentes. Las antiguas rutas `/projects` redirigen al listado.
4. Validar con el usuario: vincular un proceso mediante ng-select, ver su fecha, abrir/cerrar modales y comprobar que las acciones de Procesos permanecen fuera del desplazamiento sin tapar importes; revisar también móvil.
5. Comprobar una compra/pago y una venta/cobro real de la colección, con su origen y referencia, contrastando las mediciones. No inventar cobros ni atribuir ventas por pertenencia del producto a una colección.
6. Solo si se solicitan nuevas mejoras: registrar origen de salida exacto para atribución automática, conciliar cobros con pagos existentes y exportar reportes. Estos puntos todavía no están implementados.

### Productos, compras y Shopify

1. Revisar los diffs actuales en ambos repositorios y conservar los cambios existentes del usuario.
2. **Desplegar la versión de Laravel y el build de Angular actualizados al hosting.** No se confirmó el despliegue de la exportación con 4 unidades ni de la paginación de 50. La reparación directa del lote en Shopify no despliega código.
3. Comprobar en el hosting que `SHOPIFY_CATALOG_STORE_SLUG=sorelle` es efectivo y que la app mantiene permisos para productos, publicaciones e inventario.
4. Verificar que la sucursal principal Shopify sea la que se desea usar para las nuevas existencias. En la reparación había una única sucursal activa para pedidos online.
5. Cuando se autorice una nueva exportación real, comprobar: producto en borrador, canales seleccionados, cada variante con seguimiento y 4 unidades, y etiqueta Exportado a Shopify en el ERP.
6. Activar los productos en Shopify cuando estén listos para venderse; fotos y precios se completan fuera de esta exportación.
7. Confirmar en producción la paginación de 50 y la selección máxima de 35. No confundir ambos límites.
8. Confirmar visualmente que Registrar compra muestra producción/proveedor, entrega cerrada y opción Cambiar sección por compra.

No repetir las reparaciones de inventario del lote anterior como parte de estas verificaciones. Una exportación futura debe usar el flujo normal.

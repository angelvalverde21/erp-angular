# Colecciones — estado al 23/11/2026

La sección gestiona directamente **colecciones**, sin una entidad Proyecto. Acceso: `/sorelle/dashboard/collections`. Las direcciones antiguas `/sorelle/dashboard/projects` y `/projects/{id}` redirigen al listado de colecciones.

## Modelo y funcionamiento

- Cada colección tiene nombre, descripción, estado, inicio, cierre y lanzamiento opcionales. No requiere presupuesto fijo.
- El dashboard conserva cuatro indicadores (compras, inversión desembolsada, ventas atribuidas y cobros netos), el card Resultados a la izquierda y avance de procesos a la derecha, próximas actividades y gráfica de pagos/cobros. Ese card reemplaza el antiguo panel de recuperación y muestra únicamente Ventas totales (número de pedidos), Monto gastado y Falta por recuperar. No hay pestaña Resultados ni botón «Ver resultados». Los enlaces antiguos `?view=results` muestran el dashboard.
- Se pueden crear o vincular producciones, órdenes de manufactura, sesiones fotográficas y otros procesos. Un proceso puede existir independientemente y pertenecer como máximo a una colección.
- Las compras pertenecen al proceso que las origina. La pestaña Compras solo consolida esos registros.
- Los productos aparecen únicamente desde las variantes de producciones y órdenes vinculadas. No se pueden asociar manualmente desde el catálogo.
- Los procesos pueden trasladarse a otra colección de la misma tienda desde Organizar; su historial conserva el mismo registro de origen.
- Por decisión del 23/11/2026, las ventas de Resultados se calculan automáticamente desde los pedidos que contienen productos de la colección. Se cuenta cada pedido una vez y se suman solo sus líneas correspondientes a esos productos. La pestaña Ventas y cobros conserva las atribuciones manuales por origen y su historial, pero no define los tres indicadores de Resultados.
- El servidor limita la atribución a unidades vendidas y recibidas del origen. Los importes proceden del pedido. El reporte trabaja en PEN.
- Los cobros y devoluciones se registran con fecha y referencia real; se conservan como historial. El importe vendido no se supone automáticamente cobrado.
- Monto gastado = suma de las compras de los procesos, aunque todavía no tengan pagos. Recuperación = ventas totales / monto gastado × 100; saldo pendiente = máximo(gasto − ventas, 0). No representa caja cobrada ni utilidad contable. Si el gasto es cero, el porcentaje queda sin calcular y el indicador es neutro.
- Roles: `master`, `ceo`, `admin`; aislamiento por tienda en la API y las operaciones.

## Base de datos y migración aplicada

La migración `2026_11_22_230000_make_collections_independent.php` **ya se ejecutó en local**. Eliminó `projects` y `projects_collections`, trasladando sus datos a la tabla existente `collections` y conservando los IDs de colecciones y procesos. La colección local y sus dos procesos se verificaron después de migrar.

| Tabla actual | Uso |
| --- | --- |
| `collections` | Colección, tienda, autor, estado y fechas. |
| `collections_processes` | Procesos vinculados y actividades propias. |
| `collections_sales` | Atribuciones de líneas de pedido a manufacturas. |
| `collections_receipts` | Cobros y devoluciones de las atribuciones. |
| `collections_products` | Tabla heredada sin uso funcional; sus asociaciones manuales se ignoran. |

Compras, pagos, manufacturas, pedidos, stock y sesiones mantienen sus tablas originales. Los modelos internos `ProjectProcess`, `ProjectSale` y `ProjectReceipt` conservan sus nombres por compatibilidad; apuntan a `collections_*`. En particular, no cambiar sin migración los tipos polimórficos de compras ya guardados como `App\Models\ProjectProcess` o el identificador API `project_process`.

Copia local previa: backend `storage/app/private/collections-before-project-removal-20261122-231819.json`. Contiene las filas anteriores a la migración. La migración no reconstruye automáticamente la antigua agrupación en su `down()`; recuperar esa estructura requiere restaurar la copia.

En hosting, subir Angular y Laravel y ejecutar en el backend:

```sh
php artisan migrate --path=database/migrations/2026_11_22_230000_make_collections_independent.php
php artisan route:clear
```

Si la versión inicial de Proyectos nunca se instaló allí, aplicar primero `2026_11_22_100000_create_projects_workspace.php` y después la migración anterior. No modificar la migración inicial ya ejecutada.

## Compatibilidad con pedidos aún no instalados

El 23/11/2026 se verificó que la tabla local `orders` solo tiene `id`, `created_at` y `updated_at`, y está vacía; `order_items` no existe. El resumen ahora comprueba el esquema mediante `CollectionWorkspace::ordersReady()` antes de consultar ventas. Si no hay registros, devuelve ventas y pedidos en cero sin bloquear Colecciones. Si existen filas antiguas sin estructura suficiente para identificar tienda/moneda/productos, devuelve ventas y saldo como no disponibles (`null`, `sales_available: false`), conservando el gasto conocido y sin mezclar tiendas. El selector de pedidos también evita consultar columnas inexistentes.

Se comprobó el dashboard real de la colección #1 después del arreglo. Esta corrección no añadió columnas ni ejecutó migraciones. Para obtener ventas reales, queda pendiente completar la instalación y carga de pedidos del ERP; no confundir las ventas locales con los pedidos existentes directamente en Shopify.

## Implementación y estilo

- Angular: `src/app/views/dashboard/collections/`, ruta lazy en `dashboard.routes.ts` y menú Colecciones como grupo desplegable con la opción interna «colecciones», siguiendo el formato de Productos.
- API: `/api/v1/{store}/dashboard/collections`; controlador `CollectionDashboardController` y servicio `App\Services\Collections\CollectionWorkspace`.
- Modelo principal: `App\Models\Collection`.
- Listados en tablas; texto principal y controles de 16 px, información secundaria de 14 px y títulos de sección/modal de 20 px, con tamaños compartidos en CSS. Las acciones usan botones con iconos, título y nombre accesible, alineados al extremo derecho y sin separador vertical. En Procesos están en una columna independiente del área desplazable: no superponerlas sobre los importes con sticky. El tipo se muestra debajo del nombre; no repetir la colección en cada fila. No convertir listados en tarjetas o acciones en vínculos subrayados.
- Modales con transición de entrada/salida de 200 ms y respeto de movimiento reducido. Añadir existente usa ng-select con búsqueda integrada, sin buscador separado; muestra nombre y fecha de creación en Lima, incluyendo registros antiguos. El desplegable se adjunta al diálogo para mantenerse dentro de su capa modal.
- El dashboard, productos, compras y ventas siempre corresponden a la colección abierta. El listado de otras colecciones recibido por la API sirve exclusivamente para trasladar procesos.
- En Procesos, cada fila muestra un icono según su tipo junto al nombre: fábrica para producción, lista de órdenes para manufactura, cámara para sesión fotográfica y engranajes para otros procesos. El texto del tipo se conserva y las acciones permanecen en su columna independiente.
- Desde el 23/11/2026, el nombre de la producción, orden o sesión abre directamente su registro original. Se retiró el botón «Abrir proceso» de la columna de acciones; quedan Compras, Organizar y Desvincular. Los procesos propios de tipo `other` conservan el nombre sin enlace externo.

## Últimos cambios resueltos

1. Se eliminó el nivel Proyecto y se trasladaron sus datos a colecciones independientes, sin perder la colección local ni sus dos procesos vinculados.
2. Se retiró la asociación manual de productos tanto en Angular como en la API: el origen es siempre una producción u orden vinculada.
3. Los listados utilizan tablas y las acciones son botones con iconos; se aumentaron las fuentes y se unificaron encabezados, pestañas y modales.
4. Los modales animan su entrada y salida. Se verificó en Chrome la transición de opacidad, incluido el cierre antes de desaparecer.
5. El selector de procesos existentes es ng-select, con nombre, fecha de creación y búsqueda integrada. El panel permanece dentro del modal. La API devuelve también los registros antiguos, sin el límite anterior de 50 opciones.
6. La tabla de Procesos separa los datos desplazables y la columna de acciones. Los botones permanecen estáticos, no tapan Compras/Pagado y sus filas están alineadas. En móvil se distribuyen en dos filas. Se retiró la columna repetida de colección y el tipo se muestra bajo el nombre.

7. El cambio de pestañas tiene efecto de entrada de 300 ms en Colecciones, sin volver a consultar la API ni mostrar el cargador. En Sesiones fotográficas se añadió un fundido cruzado de 280 ms: los paneles permanecen montados para conservar borradores, biblioteca y cargas. Ambos respetan movimiento reducido.

8. Se conservó la distribución del dashboard y se sustituyó su card de recuperación por las tres cifras de Resultados; se eliminó la pestaña Resultados. Laravel agrega el objeto `overview`, calculado sin escribir atribuciones ni modificar tablas. Las líneas normalizadas de pedidos tienen prioridad sobre sus snapshots para no duplicar importes. Se excluyen pedidos anulados, cantidades devueltas y monedas distintas de PEN; no se suman envío ni productos ajenos. Se consultan los pedidos en lotes de 250.
9. El importe pendiente se resalta en rojo por debajo del 50 %, amarillo del 50 al 100 % inclusive y verde solo por encima del 100 %. Sin gasto registrado se usa un estado neutro. Si un producto está en varias colecciones, un mismo pedido puede aparecer en más de una: este resumen actual se basa en productos, no en lotes de origen.

Los cálculos de Resultados están en Laravel y su presentación en Angular, sin migraciones ni escrituras nuevas. El traslado al card solo modificó Angular. Los cuatro indicadores generales y la gráfica conservan `summary` y el seguimiento de pagos y cobros. Las tres cifras del card Resultados usan `overview`; su recuperación compara ventas de productos con compras. Son mediciones distintas y no se deben intercambiar.

## Validación

```sh
# Backend: SQLite temporal; no cambia la base real.
php vendor/phpunit/phpunit/phpunit tests/Feature/CollectionsWorkspaceTest.php

# Angular
npx ng test --watch=false --browsers=ChromeHeadless --ts-config=tsconfig.collections-tests.json --include=src/app/views/dashboard/collections/collections.component.spec.ts --reporters=dots
npx ng build --configuration=production
```

Las pruebas cubren el traslado de datos y la eliminación de `projects`, la conservación de las mediciones, aislamiento por tienda, procesos existentes, productos de manufactura, límites de ventas, cobros/devoluciones y formularios de Angular.

Últimos resultados comprobados:

- Laravel: **21 pruebas y 192 aserciones aprobadas**.
- Angular Colecciones: **13 pruebas aprobadas**, incluida la posición de los botones al desplazar horizontalmente los datos y la alineación con sus filas.
- Sesiones fotográficas: **47 pruebas Angular aprobadas**, incluida navegación por teclado y conservación del contenido al cambiar de sección.
- Build de producción aprobado en `dist/proyecto-para-nube`. Se comprobó que el paquete generado incluye el ajuste móvil final.
- No son una única suite global de todo el ERP. Las pruebas usan SQLite en memoria; las dos migraciones de instalación sí se ejecutaron en la base local.

## Próximos pasos

1. Revisar los diffs y archivos nuevos de ambos repositorios antes de preparar un commit; conservar los cambios previos de Shopify y productos. No incluir credenciales.
2. Desplegar Angular y Laravel al hosting y aplicar únicamente las migraciones que allí falten. La instalación y el dashboard se comprobaron en local; el hosting no se verificó en esta parte de la sesión.
3. Validar con el usuario el resumen comparando pedidos con productos de la colección, sus importes y las compras de los procesos. Comprobar los umbrales 0 %, 50 %, 100 % y más de 100 %. La atribución y los cobros manuales siguen siendo opcionales para detallar el origen, sin intervenir en las tres cifras de Resultados.
4. Revisar la tabla en el ancho habitual del ERP y en móvil: botones estáticos, importes visibles, alineación y desplazamiento limitado a los datos. Mantener ng-select dentro de la capa del diálogo.
5. Como mejoras futuras, solo si se solicitan: atribución automática a partir del lote exacto de salida, conciliación con pagos del pedido y exportación de reportes. Todavía no están implementadas.

Para un resumen de todo el ERP listo para pegar en una nueva sesión, usar la sección **0. Resumen listo para pegar en una nueva sesión** de [README_CONTEXTO_2026-11-22.md](README_CONTEXTO_2026-11-22.md). Allí también se conservan las decisiones y verificaciones anteriores de productos, compras y Shopify.

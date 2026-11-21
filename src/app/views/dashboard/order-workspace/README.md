# Pedidos · Nueva versión

Ruta: `/:store/dashboard/orders-next`, con detalle en `/:id`.
El menú aparece dentro de Primera importación, inmediatamente debajo de Pedidos,
mientras se prepara la nueva versión antes de su integración definitiva.

Esta sección permite desarrollar el nuevo diseño con pedidos reales de la primera
importación. Es de consulta; no cambia pedidos, estados, pagos ni las tablas finales.
Conserva el acceso de administración de la fuente actual (`master`, `ceo`, `admin`).

## Organización

- `order-workspace.service.ts`: único adaptador para cargar el listado y el detalle.
- `order-workspace.mapper.ts`: transforma las respuestas de importación a modelos
  de pantalla sin modificar los payloads originales.
- `order-workspace.model.ts`: tipos y estados de la nueva interfaz.
- `order-workspace-list` y `order-workspace-detail`: páginas independientes.
- `order-product-list` y `order-preparation-badge`: componentes de presentación.

Se reutilizan el stepper, su cálculo de fechas reales y el visor de imágenes
existentes. Las miniaturas se cargan en la lista y la imagen grande al abrir el visor.
El historial mantiene los eventos y adjuntos autenticados del navegador de importación.

La búsqueda, estado, página y ejecución de origen se conservan en la URL al abrir
un pedido y regresar. Los filtros se aplican en el servidor, no sobre una sola página.
Las cantidades usan `currentQuantity`, con `quantity` como respaldo; los envíos
parciales se advierten explícitamente, sin presentar esas cantidades como pendientes.

## Integración posterior con orders

Al preparar la integración final, cambiar el adaptador y su mapper para resolver los
IDs y datos definitivos. Las páginas consumen modelos propios, no payloads de Shopify.
El historial y las imágenes también deberán recibir su fuente definitiva antes de
retirar la dependencia actual de la importación. La creación, edición y transición
de estados se implementarán cuando se defina ese flujo; la vista previa no los simula.

Pruebas: `npx ng test --configuration initial-import-module`.

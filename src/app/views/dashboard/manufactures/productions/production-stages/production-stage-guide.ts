export const STAGE_GUIDE: Record<string, { task: string; description: string }> = {
  molds: { task: 'Registrar molde', description: 'Registra el desarrollo del molde o indica que reutilizarás uno existente.' },
  samples: { task: 'Registrar muestras', description: 'Indica cuántas muestras se hicieron, sus detalles y el resultado de la revisión.' },
  materials: { task: 'Registrar materiales', description: 'Añade las compras de telas e insumos que se utilizarán en este lote.' },
  cutting: { task: 'Definir productos', description: 'Define los productos y las cantidades del lote. Después registra los servicios de corte.' },
  sewing: { task: 'Registrar taller', description: 'Indica el taller o responsable y la fecha de entrega acordada. Añade sus compras o servicios.' },
  finishing: { task: 'Registrar acabados', description: 'Detalla los trabajos de acabado y registra los servicios realizados en las prendas.' },
  reception: { task: 'Registrar recepción', description: 'Registra las prendas recibidas por producto y variante. Puedes registrar entregas parciales.' },
  others: { task: 'Registrar gasto', description: 'Añade transporte, carga y otros gastos que no correspondan a una etapa específica.' },
};

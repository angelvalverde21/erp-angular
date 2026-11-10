export interface MatrixOption {
  id?: number;
  name?: string;
  label?: string;
}

export interface MatrixOptionValue {
  id?: number;
  value?: string;
  option?: MatrixOption;
}

export interface MatrixProductImage {
  url_thumbnail?: string;
  url_medium?: string;
}

export interface ManufactureMatrixVariant {
  id: number;
  manufacture_id?: number;
  production_id?: number;
  quantity: number | string | null;
  price?: number | string | null;
  variant?: {
    id?: number;
    sku?: string | null;
    product?: { id?: number; name?: string; image?: MatrixProductImage | null };
    option_values?: MatrixOptionValue[];
    variant_option_values?: { option?: MatrixOption; option_value?: MatrixOptionValue }[];
  };
}

export interface VariantMatrixRow {
  key: string;
  label: string;
  details: string;
  cells: Map<string, ManufactureMatrixVariant[]>;
  quantity: number;
  amount: number;
}

export interface VariantMatrixGroup {
  key: string;
  name: string;
  image: MatrixProductImage | null | undefined;
  rows: VariantMatrixRow[];
  sizes: string[];
  totals: Map<string, { quantity: number; amount: number }>;
  quantity: number;
  amount: number;
  count: number;
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });
const sizeRanks = new Map(['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL'].map((size, index) => [size, index]));

export function compareMatrixSizes(a: string, b: string): number {
  return (sizeRanks.get(a) ?? 100) - (sizeRanks.get(b) ?? 100) || collator.compare(a, b);
}

function sizeLabel(value: string): string {
  return normalize(value).toUpperCase().replace(/^(?:TALLAS?|SIZE)\s*[:\-]?\s+/, '').replace(/^2XL$/, 'XXL').replace(/^3XL$/, 'XXXL') || 'ÚNICA';
}

export function buildVariantMatrices(records: readonly ManufactureMatrixVariant[]): VariantMatrixGroup[] {
  const groups = new Map<string, VariantMatrixGroup>();
  for (const record of records) {
    const product = record.variant?.product;
    const key = product?.id != null ? `product:${product.id}` : product?.name ? `name:${product.name}` : `variant:${record.variant?.id ?? record.id}`;
    let group = groups.get(key);
    if (!group) {
      group = { key, name: product?.name || 'Producto sin nombre', image: product?.image, rows: [], sizes: [], totals: new Map(), quantity: 0, amount: 0, count: 0 };
      groups.set(key, group);
    }
    const values = record.variant?.variant_option_values?.length
      ? record.variant.variant_option_values.map(item => ({ ...item.option_value, option: item.option ?? item.option_value?.option }))
      : record.variant?.option_values ?? [];
    const options = values.map((value, index) => ({
      key: value.option?.id != null ? String(value.option.id) : normalize(value.option?.name || value.option?.label || `option-${index}`),
      kind: normalize(value.option?.name || value.option?.label || ''),
      label: value.option?.label || value.option?.name || 'Opción',
      value: String(value.value ?? 'Sin especificar').trim(),
    }));
    const isSize = (kind: string) => ['size', 'sizes', 'talla', 'tallas', 'tamano', 'tamanos'].includes(kind);
    const size = options.find(option => isSize(option.kind));
    const otherOptions = options.filter(option => !isSize(option.kind)).sort((a, b) => collator.compare(a.key, b.key));
    const color = otherOptions.find(option => ['color', 'colors', 'colores'].includes(option.kind));
    const extra = otherOptions.filter(option => option !== color);
    const rowKey = JSON.stringify(otherOptions.map(option => [option.key, normalize(option.value)]));
    let row = group.rows.find(row => row.key === rowKey);
    if (!row) {
      row = {
        key: rowKey,
        label: color?.value || (extra.length ? extra.map(option => option.value).join(' / ') : 'Presentación única'),
        details: color ? extra.map(option => `${option.label}: ${option.value}`).join(' · ') : '',
        cells: new Map(), quantity: 0, amount: 0,
      };
      group.rows.push(row);
    }
    const column = size ? sizeLabel(size.value) : 'ÚNICA';
    if (!group.sizes.includes(column)) group.sizes.push(column);
    const items = row.cells.get(column) ?? [];
    items.push(record);
    row.cells.set(column, items);
    const quantity = Number(record.quantity ?? 0) || 0;
    const amount = quantity * (Number(record.price ?? 0) || 0);
    row.quantity += quantity;
    row.amount += amount;
    group.quantity += quantity;
    group.amount += amount;
    group.count++;
    const total = group.totals.get(column) ?? { quantity: 0, amount: 0 };
    total.quantity += quantity;
    total.amount += amount;
    group.totals.set(column, total);
  }
  for (const group of groups.values()) {
    group.sizes.sort(compareMatrixSizes);
    group.rows.sort((a, b) => collator.compare(a.label, b.label) || collator.compare(a.details, b.details));
  }
  return [...groups.values()];
}

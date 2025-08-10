// export const ROUTE_PATHS: Record<string, string[]> = {
//   inventories: ['inventories'],
//   products: ['inventories', 'products'],
//   categories: ['inventories', 'categories'],
//   warehouses: ['inventories', 'warehouses'],
//   purchases: ['purchases'],
//   suppliers: ['purchases', 'suppliers'],
//   purchaseOrders: ['purchases', 'purchase-order'],
//   purchaseList: ['purchases', 'all'],
// };

export enum RouteKey {
  Inventories = 'inventories',
  Products = 'products',
  Categories = 'categories', 
  Warehouses = 'warehouses',
  Purchases = 'purchases',
  Suppliers = 'suppliers',
  PurchaseOrder = 'purchaseorder',
  PurchaseAll = 'all', // ✅ Esta línea debe existir
}

export const ROUTE_PATHS: Record<RouteKey, string[]> = {
  [RouteKey.Inventories]: ['inventories'],
  [RouteKey.Products]: ['inventories', 'products'],
  [RouteKey.Categories]: ['inventories', 'categories'],
  [RouteKey.Warehouses]: ['inventories', 'warehouses'],
  [RouteKey.Purchases]: ['purchases'],
  [RouteKey.Suppliers]: ['purchases', 'suppliers'],
  [RouteKey.PurchaseOrder]: ['purchases', 'purchase-order'],
  [RouteKey.PurchaseAll]: ['purchases', 'all'], // ✅ Ya no marcará error
};
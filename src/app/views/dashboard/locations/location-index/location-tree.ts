import { Location } from 'src/app/interfaces/location.interface';

export interface LocationNode extends Location { children: LocationNode[]; }

export function locationTrail(locations: readonly Location[], id: number | null): Location[] {
  const records = new Map(locations.map(location => [location.id, location]));
  const trail: Location[] = [];
  const visited = new Set<number>();
  let current = id === null ? undefined : records.get(id);
  while (current && !visited.has(current.id)) {
    trail.unshift(current);
    visited.add(current.id);
    current = current.parent_id === null ? undefined : records.get(current.parent_id);
  }
  return trail;
}

export function buildLocationTree(locations: readonly Location[]): LocationNode[] {
  const nodes = new Map(locations.map(location => [location.id, { ...location, children: [] } as LocationNode]));
  const children = new Map<number, LocationNode[]>();
  const roots: LocationNode[] = [];
  const visited = new Set<number>();

  for (const node of nodes.values()) {
    if (node.parent_id !== null && nodes.has(node.parent_id)) {
      const siblings = children.get(node.parent_id) ?? [];
      siblings.push(node);
      children.set(node.parent_id, siblings);
    } else {
      roots.push(node);
    }
  }

  const visit = (node: LocationNode): LocationNode => {
    visited.add(node.id);
    node.children = [];
    for (const child of children.get(node.id) ?? []) {
      if (!visited.has(child.id)) node.children.push(visit(child));
    }
    return node;
  };

  roots.forEach(visit);
  // Keep legacy records with missing or circular parents visible without recursive loops.
  for (const node of nodes.values()) {
    if (!visited.has(node.id)) roots.push(visit(node));
  }
  return roots;
}

import { Location } from 'src/app/interfaces/location.interface';
import { buildLocationTree, locationTrail } from './location-tree';
import { LocationIndexComponent } from './location-index.component';

describe('Location hierarchy', () => {
  const location = (id: number, parent_id: number | null): Location => ({ id, parent_id, warehouse_id: 1, name: 'Ubicación ' + id, code: null, is_active: true });

  it('finds the selected location path from its root without changing operational status', () => {
    const records = [location(3, 2), location(1, null), location(2, 1)];
    expect(locationTrail(records, 3).map(item => item.id)).toEqual([1, 2, 3]);
    expect(records.every(item => item.is_active)).toBeTrue();
    expect(locationTrail(records, 99)).toEqual([]);
  });

  it('reveals collapsed ancestors when a nested location becomes selected', () => {
    const component = new LocationIndexComponent();
    component.locations = [location(1, null), location(2, 1), location(3, 2)];
    component.collapsed.add(1);
    component.collapsed.add(2);
    component.selectedLocationId = 3;
    component.ngOnChanges();
    expect([...component.ancestorIds]).toEqual([1, 2]);
    expect(component.collapsed.size).toBe(0);
    expect(component.trail.map(item => item.id)).toEqual([1, 2, 3]);
  });

  it('places children below their real parent even when the API returns them first', () => {
    const source = [location(3, 2), location(2, 1), location(4, null), location(1, null)];
    const roots = buildLocationTree(source);
    expect(roots.map(node => node.id)).toEqual([4, 1]);
    expect(roots[1].children[0].id).toBe(2);
    expect(roots[1].children[0].children[0].id).toBe(3);
    expect(source[0].children).toBeUndefined();
  });

  it('keeps a record with a missing parent visible', () => {
    expect(buildLocationTree([location(1, 99)])[0].id).toBe(1);
  });

  it('shows cyclic legacy records once without recursive loops', () => {
    const roots = buildLocationTree([location(1, 2), location(2, 1), location(3, 3)]);
    expect(roots.map(node => node.id)).toEqual([1, 3]);
    expect(roots[0].children[0].id).toBe(2);
    expect(roots[0].children[0].children).toEqual([]);
    expect(roots[1].children).toEqual([]);
  });
});

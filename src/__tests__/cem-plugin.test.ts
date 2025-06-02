import { describe, expect, test } from "vitest";
import cem from '../../demo/custom-elements.json' with { type: 'json' };
import cemPartial from '../../demo/custom-elements.partial.json' with { type: 'json' };
import cemFull from '../../demo/custom-elements.full.json' with { type: 'json' };
import { getComponentByClassName, getComponentPublicProperties } from "@wc-toolkit/cem-utilities";
import { Property } from "@wc-toolkit/cem-utilities";


describe('type-parser', () => {
  type Prop = Property<Record<string, unknown> & { parsedType?: { text: string } }>;
  const component = getComponentByClassName(cem, 'MyComponent');
  const properties = getComponentPublicProperties<Prop>(component!);

  test('should not create parsed types for JS primitive types', () => {
    // Arrange
    const name = properties.find(p => p.name === 'name');
    const age = properties.find(p => p.name === 'age');
    const active = properties.find(p => p.name === 'active');
    
    // Act
    
    // Assert
    expect(name?.parsedType?.text).toBeUndefined();
    expect(age?.parsedType?.text).toBeUndefined();
    expect(active?.parsedType?.text).toBeUndefined();
  });

  test('should resolve types in same file', () => {
    // Arrange
    const internal = properties.find(p => p.name === 'internal');
    
    // Act
    
    // Assert
    expect(internal?.parsedType?.text).toEqual("'sports' | 'music' | 'art'");
  });

  test('should resolve types from external .ts file', () => {
    // Arrange
    const tsExternal = properties.find(p => p.name === 'tsExternal');
    
    // Act
    
    // Assert
    expect(tsExternal?.parsedType?.text).toEqual("'value4' | 'value5' | 'value6'");
  });

  test('should resolve types from external .d.ts file', () => {
    // Arrange
    const dtsExternal = properties.find(p => p.name === 'dtsExternal');
    
    // Act
    
    // Assert
    expect(dtsExternal?.parsedType?.text).toEqual("'value1' | 'value2' | 'value3'");
  });

  test('should resolve types for generic type', () => {
    // Arrange
    const generic = properties.find(p => p.name === 'generic');
    
    // Act
    
    // Assert
    expect(generic?.parsedType?.text).toEqual("'value1' | 'value2' | 'value3' | 'sports' | 'music' | 'art'");
  });

  test('should resolve types for Exclude utility type', () => {
    // Arrange
    const exclude = properties.find(p => p.name === 'exclude');
    
    // Act
    
    // Assert
    expect(exclude?.parsedType?.text).toEqual("'value4' | 'value5' | 'value6' | 'value2' | 'value3'");
  });

  test('should resolve types for named union type', () => {
    // Arrange
    const namedUnion = properties.find(p => p.name === 'namedUnion');
    
    // Act
    
    // Assert
    expect(namedUnion?.parsedType?.text).toEqual("'value4' | 'value5' | 'value6' | 'value1' | 'value2' | 'value3'");
  });

  test('should resolve types for enum keys', () => {
    // Arrange
    const direction = properties.find(p => p.name === 'direction');
    
    // Act
    
    // Assert
    expect(direction?.parsedType?.text).toEqual("'Up' | 'Down' | 'Left' | 'Right'");
  });

  test('should resolve types for enum', () => {
    // Arrange
    const enumExample = properties.find(p => p.name === 'enumExample');
    
    // Act
    
    // Assert
    expect(enumExample?.parsedType?.text).toEqual("0 | 1 | 2 | 3");
  });
});

function getPartialProperties() {
  // Use the CEM v1 structure for partial/full files
  const module = cemPartial.modules.find((m: any) => m.path.endsWith('my-component.ts'));
  if (!module) return [];
  const decl = module.declarations.find((d: any) => d.name === 'MyComponent');
  return decl ? decl.members : [];
}

function getFullProperties() {
  const module = cemFull.modules.find((m: any) => m.path.endsWith('my-component.ts'));
  if (!module) return [];
  const decl = module.declarations.find((d: any) => d.name === 'MyComponent');
  return decl ? decl.members : [];
}

describe('type-parser (parseObjectTypes: "partial")', () => {
  const properties = getPartialProperties();
  test('should reference custom types by name and expand objects', () => {
    const internal = properties.find((p: any) => p.name === 'internal');
    expect(internal?.parsedType?.text).toEqual("'sports' | 'music' | 'art'");
    const tsExternal = properties.find((p: any) => p.name === 'tsExternal');
    expect(tsExternal?.parsedType?.text).toEqual("'value4' | 'value5' | 'value6'");
    const dtsExternal = properties.find((p: any) => p.name === 'dtsExternal');
    expect(dtsExternal?.parsedType?.text).toEqual("'value1' | 'value2' | 'value3'");
    const objectProp = properties.find((p: any) => p.name === 'complexObject');
    expect(objectProp?.parsedType?.text).toContain('arrowElement'); // Should expand PositionPopoverOptions
  });
});

describe('type-parser (parseObjectTypes: "full")', () => {
  const properties = getFullProperties();
  test('should fully expand all types', () => {
    const internal = properties.find((p: any) => p.name === 'internal');
    expect(internal?.parsedType?.text).toEqual("'sports' | 'music' | 'art'");
    const tsExternal = properties.find((p: any) => p.name === 'tsExternal');
    expect(tsExternal?.parsedType?.text).toEqual("'value4' | 'value5' | 'value6'");
    const dtsExternal = properties.find((p: any) => p.name === 'dtsExternal');
    expect(dtsExternal?.parsedType?.text).toEqual("'value1' | 'value2' | 'value3'");
    const objectProp = properties.find((p: any) => p.name === 'complexObject');
    expect(objectProp?.parsedType?.text).toContain('arrowElement'); // Should expand PositionPopoverOptions
  });
});
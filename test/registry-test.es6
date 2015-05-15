import {expect} from './spec-helper';
import minim from '../lib/minim';
import {TypeRegistry} from '../lib/registry';

describe('Minim registry', () => {
  const registry = new TypeRegistry();

  describe('#register', () => {
    it('should add to the element map', () => {
      registry.register('test', minim.ObjectType);
      expect(registry.elementMap.test).to.equal(minim.ObjectType);
    });
  });

  describe('#unregister', () => {
    it('should remove from the element map', () => {
      registry.unregister('test');
      expect(registry.elementMap).to.not.have.key('test');
    });
  });

  describe('#detect', () => {
    const test = () => true;
    registry.typeDetection = [[test, minim.NullType]];

    it('should prepend by default', () => {
      registry.detect(test, minim.StringType);
      expect(registry.typeDetection[0][1]).to.equal(minim.StringType);
    });

    it('should be able to append', () => {
      registry.detect(test, minim.ObjectType, false);
      expect(registry.typeDetection[2][1]).to.equal(minim.ObjectType);
    });
  });

  describe('#toType', () => {
    it('should handle values that are ElementClass subclass instances', () => {
      const myType = new minim.StringType();
      const converted = registry.toType(myType);

      expect(converted).to.equal(myType);
    });
  });

  describe('#getElementClass', () => {
    it('should return ElementClass for unknown elements', () => {
      expect(registry.getElementClass('unknown')).to.equal(minim.ElementType);
    });
  });
});

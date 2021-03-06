var _ = require('lodash');
var expect = require('../../spec-helper').expect;
var minim = require('../../../lib/minim').namespace();

describe('Embedded Null', function() {
  context('when converting from embedded refract', function() {
    context('when it is a normal null', function() {
      var value = null;
      var element;

      before(function() {
        element = minim.fromEmbeddedRefract(value);
      });

      it('should parse the value correctly', function() {
        expect(element.toValue()).to.equal(null);
        expect(element.element).to.equal('null');
      });
    });

    context('when it is an embedded null', function() {
      var value = {
        _refract: {
          element: 'null',
          content: null
        }
      };
      var element;

      before(function() {
        element = minim.fromEmbeddedRefract(value);
      });

      it('should parse the value correctly', function() {
        expect(element.toValue()).to.equal(null);
        expect(element.element).to.equal('null');
      });
    });
  });

  context('when converting to embedded refract', function() {
    context('when there are no meta or attribute properites', function() {
      var element;
      var embeddedRefract;

      before(function() {
        element = minim.toElement(null);
        embeddedRefract = element.toEmbeddedRefract();
      });

      it('should return the string value', function() {
        expect(embeddedRefract).to.equal(null);
      });
    });

    context('when there are attributes', function() {
      var element;
      var embeddedRefract;

      before(function() {
        element = minim.toElement(null);
        element.attributes.set('foo', 'bar');
        embeddedRefract = element.toEmbeddedRefract();
      });

      it('should return the correct value', function() {
        expect(embeddedRefract).to.deep.equal({
          _refract: {
            element: 'null',
            attributes: {
              foo: 'bar'
            },
            content: null
          }
        });
      });
    });

    context('when there are meta values', function() {
      var element;
      var embeddedRefract;

      before(function() {
        element = minim.toElement(null);
        element.meta.set('title', 'Test Element')
        embeddedRefract = element.toEmbeddedRefract();
      });

      it('should return the correct value', function() {
        expect(embeddedRefract).to.deep.equal({
          _refract: {
            element: 'null',
            meta: {
              title: 'Test Element'
            },
            content: null
          }
        });
      });
    });
  });
});

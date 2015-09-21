# Minim

[![Build Status](https://travis-ci.org/refractproject/minim.svg?branch=master)](https://travis-ci.org/refractproject/minim)

A library for interacting with [Refract elements](https://github.com/refractproject/refract-spec)

## Install

```shell
npm install minim
```

## About

In working with the XML-based DOM, there is a limitation on what types are available in the document. Element attributes may only be strings, and element values can only be strings, mixed types, and nested elements.

JSON provides additional types, which include objects, arrays, booleans, and nulls. A plain JSON document, though, provides no structure and no attributes for each property and value in the document.

Refract is a JSON structure for JSON documents to make a more flexible document object model. In Refract, each element has three components:

1. Name of the element
1. Metadata
1. Attributes
1. Content (which can be of different elements depending on the element)

An element ends up looking like this:

```javascript
var el = {
  element: 'string',
  meta: {},
  attributes: {},
  content: 'bar'
};
```

## Usage

### Converting Javascript Values into Elements

```javascript
var minim = require('minim').namespace();
var arrayElement = minim.toElement([1, 2, 3]);
var refract = arrayElement.toRefract();
```

The `refract` variable above has the following JSON value.

```json
{
  "element": "array",
  "meta": {},
  "attributes": {},
  "content": [
    {
      "element": "number",
      "meta": {},
      "attributes": {},
      "content": 1
    },
    {
      "element": "number",
      "meta": {},
      "attributes": {},
      "content": 2
    },
    {
      "element": "number",
      "meta": {},
      "attributes": {},
      "content": 3
    }
  ]
}
```

### Converting Serialized Refract into Elements

Serialized Refract can be converted back to Minim elements to make a roundtrip.

```javascript
var arrayElement1 = minim.toElement([1, 2, 3]);
var refracted = arrayElement1.toRefract();
var arrayElement2 = minim.fromRefract(refracted);
```

Serialized values in compact and embedded forms can also be loaded into Minim.

```javascript
// Both return a string element where the content is `foobar`
var stringElement1 = minim.fromCompactRefract(['string', {}, {}, 'foobar']);
var stringElement2 = minim.fromEmbeddedRefract({
  _refract: {
    element: 'string',
    content: 'foobar'
  }
});
```

### Extending elements

You can extend elements using the `extend` static method.

```javascript
var StringElement = minim.getElementClass('string');
var NewElement = StringElement.extend({
  constructor: function() {
    this.__super();
  },

  customMethod: function() {
    // custom code here
  }
})
```

See the [Uptown](https://github.com/smizell/uptown) library for usage with `.extend`.

### Element Attributes

Each Minim element provides the following attributes:

- element (string) - The name of the element
- meta (object) - The element's metadata
- attributes (object) - The element's attributes
- content - The element's content, e.g. a list of other elements.

Additionally, convenience attributes are exposed on the element:

- id (string) - Shortcut for `.meta.get('id').toValue()`.
- name (string) - Shortcut for `.meta.get('name').toValue()`.
- classes (ArrayElement) - Shortcut for `.meta.get('classes')`.
- title (string) - Shortcut for `.meta.get('title').toValue()`.
- description (string) - Shortcut for `.meta.get('description').toValue()`.

Note that simple types like `string` are exposed through their `.toValue()` result, while more complex types like the array for the `classes` attribute are exposed as `ArrayElement` or `ObjectElement` instances.

### Element Methods

Each Minim element provides the following the methods.

#### toValue

The `toValue` method returns the JSON value of the Minim element.

```javascript
var arrayElement = minim.toElement([1, 2, 3]);
var arrayValue = arrayElement.toValue(); // [1, 2, 3]
```

#### toRefract

The `toRefract` method returns the Refract value of the Minim element.

```javascript
var arrayElement = minim.toElement([1, 2, 3]);
var refract = arrayElement.toRefract(); // See converting to elements above
```

#### toCompactRefract

The `toCompactRefract` method returns the Compact Refract value of the Minim element.

```javascript
var stringElement = minim.toElement("foobar");
var compact = stringElement.toCompactRefract(); // ['string', {}, {}, 'foobar']
```

#### toEmbeddedRefract

The `toEmbeddedRefract` method returns the Embedded Refract value of the Minim element.

```javascript
var stringElement = minim.toElement("foobar");
stringElement.attributes.set('a', 'b');
var embedded = stringElement.toEmbeddedRefract();
// Serializes to:
//
// {
//   _refract: {
//     element: 'string',
//     attributes: { a: 'b' },
//     content: 'foobar'
//   }
// }
```

#### equals

Allows for testing equality with the content of the element.

```javascript
var stringElement = minim.toElement("foobar");
stringElement.equals('abcd'); // returns false
```

#### clone

Creates a clone of the given instance.

```javascript
var stringElement = minim.toElement("foobar");
var stringElementClone = stringElement.clone();
```

### Minim Elements

Minim supports the following primitive elements

#### NullElement

This is an element for representing the `null` value.

#### StringElement

This is an element for representing string values.

##### set

The `set` method sets the value of the `StringElement` instance.

```javascript
var stringElement = minim.toElement('');
stringElement.set('foobar');
var value = stringElement.get() // get() returns 'foobar'
```

#### NumberElement

This is an element for representing number values.

##### set

The `set` method sets the value of the `NumberElement` instance.

```javascript
var numberElement = minim.toElement(0);
numberElement.set(4);
var value = numberElement.get() // get() returns 4
```

#### BooleanElement

This is an element for representing boolean values.

##### set

The `set` method sets the value of the `BooleanElement` instance.

```javascript
var booleanElement = minim.toElement(false);
booleanElement.set(true);
var value = booleanElement.get() // get() returns true
```

#### ArrayElement

This is an element for representing arrays.

##### Iteration

The array element is iterable if the environment supports the [iteration protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable). You can then use the element in `for ... of` loops, use the spread operator, `yield*`, and destructuring assignment.

```js
const arrayElement = minim.toElement(['a', 'b', 'c']);

for (let item of arrayElement) {
  console.log(item);
}
```

##### get

The `get` method returns the item of the `ArrayElement` instance at the given index.

```javascript
var arrayElement = minim.toElement(['a', 'b', 'c']);
var value = arrayElement.get(0) // get(0) returns item for 'a'
```

##### getValue

The `getValue` method returns the value of the item of the `ArrayElement` instance at the given index.

```javascript
var arrayElement = minim.toElement(['a', 'b', 'c']);
var value = arrayElement.getValue(0) // get(0) returns 'a'
```

##### getIndex

The `getIndex` method returns the item of the array at a given index.

```javascript
var arrayElement = minim.toElement(['a', 'b', 'c']);
var value = arrayElement.getIndex(0) // returns the item for 'a'
```

##### set

The `set` method sets the value of the `ArrayElement` instance.

```javascript
var arrayElement = minim.toElement([]);
arrayElement.set(0, 'z');
var value = arrayElement.get(0) // get(0) returns 'z'
```

##### map

The `map` method may be used to map over an array. Each item given is a Minim instance.

```javascript
var arrayElement =minim.toElement(['a', 'b', 'c']);
var newArray = arrayElement.map(function(item) {
  return item.element;
}); // newArray is now ['string', 'string', 'string']
```

##### filter

The `filter` method may be used to filter a Minim array. This method returns a Minim array itself rather than a JavaScript array instance.

```javascript
var arrayElement = minim.toElement(['a', 'b', 'c']);
var newArray = arrayElement.filter(function(item) {
  return item.get() === 'a'
}); // newArray.toValue() is now ['a']
```

##### reduce

The `reduce` method may be used to reduce over a Minim array or object. The method takes a function and an optional beginning value.

```javascript
var numbers = minim.toElement([1, 2, 3, 4]);
var total = numbers.reduce(function(result, item) {
  return result.toValue() + item.toValue();
}); // total.toValue() === 10
```

The `reduce` method also takes an initial value, which can either be a value or Minim element.

```javascript
var numbers = minim.toElement([1, 2, 3, 4]);
var total = numbers.reduce(function(result, item) {
  return result.toValue() + item.toValue();
}, 10); // total.toValue() === 20
```

The `reduce` method also works with objects:

```javascript
var objNumbers = minim.toElement({a: 1, b:2, c:3, d:4});
var total = objNumbers.reduce(function(result, item) {
  return result.toValue() + item.toValue();
}, 10); // total.toValue() === 20
```

The function passed to `reduce` can accept up to five optional parameters and depends on whether you are using an array element or object element:

**Array**
1. `result`: the reduced value thus far
2. `item`: the current item in the array
3. `index`: the zero-based index of the current item in the array
4. `arrayElement`: the array element which contains `item` (e.g. `numbers` above)

**Object**
1. `result`: the reduced value thus far
2. `item`: the value element of the current item in the object
3. `key`: the key element of the current item in the object
4. `memberElement`: the member element which contains `key` and `value`
5. `objectElement`: the object element which contains `memberElement` (e.g. `objNumbers` above)

##### forEach

The `forEach` method may be used to iterate over a Minim array.

```javascript
var arrayElement = minim.toElement(['a', 'b', 'c']);
arrayElement.forEach(function(item) {
  console.log(item.toValue())
}); // logs each value to console
```

##### push

The `push` method may be used to add items to a Minim array.

```javascript
var arrayElement = minim.toElement(['a', 'b', 'c']);
arrayElement.push('d');
console.log(arrayElement.toValue()); // ['a', 'b', 'c', 'd']
```

##### find

The `find` method traverses the entire descendent element tree and returns an `ArrayElement` of all elements that match the conditional function given.

```javascript
var arrayElement = minim.toElement(['a', [1, 2], 'b', 3]);
var numbers = arrayElement.find(function(el) {
  return el.element === 'number'
}).toValue(); // [1, 2, 3]
```

##### findByClass

The `findByClass` method traverses the entire descendent element tree and returns an `ArrayElement` of all elements that match the given element name.

##### findByElement

The `findByElement` method traverses the entire descendent element tree and returns an `ArrayElement` of all elements that match the given class.

##### children

The `children` method traverses direct descendants and returns an `ArrayElement` of all elements that match the condition function given.

```javascript
var arrayElement = minim.toElement(['a', [1, 2], 'b', 3]);
var numbers = arrayElement.children(function(el) {
  return el.element === 'number';
}).toValue(); // [3]
```

Because only children are tested with the condition function, the values `[1, 2]` are seen as an `array` type whose content is never tested. Thus, the only direct child which is a number element is `3`.

##### getById

Search the entire tree to find a matching ID.

```javascript
elTree.getById('some-id');
```

##### contains

Test to see if a collection contains the value given. Does a deep equality check.

```javascript
var arrayElement = minim.toElement(['a', [1, 2], 'b', 3]);
arrayElement.contains('a'); // returns true
```

##### first

Returns the first element in the collection.

```javascript
var arrayElement = minim.toElement(['a', [1, 2], 'b', 3]);
arrayElement.first(); // returns the element for "a"
```

##### second

Returns the second element in the collection.

```javascript
var arrayElement = minim.toElement(['a', [1, 2], 'b', 3]);
arrayElement.second(); // returns the element for "[1, 2]"
```

##### last

Returns the last element in the collection.

```javascript
var arrayElement = minim.toElement(['a', [1, 2], 'b', 3]);
arrayElement.last(); // returns the element for "3"
```

#### ObjectElement

This is an element for representing objects. Objects store their items as an ordered array, so they inherit most of the methods above from the `ArrayElement`.

##### get

The `get` method returns the `ObjectElement` instance at the given name.
See `getKey` and `getMember` for ways to get more instances around a key-value pair.

```javascript
var objectElement = minim.toElement({ foo: 'bar' });
var value = objectElement.get('foo') // returns string instance for 'bar'
```

##### getValue

The `getValue` method returns the value of the `ObjectElement` instance at the given name.

```javascript
var objectElement = minim.toElement({ foo: 'bar' });
var value = objectElement.getValue('foo') // returns 'bar'
```

##### getKey

The `getKey` method returns the key element of a key-value pair.

```javascript
var objectElement = minim.toElement({ foo: 'bar' });
var key = objectElement.getKey('foo') // returns the key element instance
```

##### getMember

The `getMember` method returns the entire member for a key-value pair.

```javascript
var objectElement = minim.toElement({ foo: 'bar' });
var member = objectElement.getMember('foo') // returns the member element
var key = member.key; // returns what getKey('foo') returns
var value = member.value; // returns what get('foo') returns
```

##### set

The `set` method sets the value of the `ObjectElement` instance.

```javascript
var objectElement = minim.toElement({});
objectElement.set('foo', 'hello world');
var value = objectElement.get('foo') // get('foo') returns 'hello world'
```

##### keys

The `keys` method returns an array of keys.

```javascript
var objectElement = minim.toElement({ foo: 'bar' });
var keys = objectElement.keys() // ['foo']
```

##### values

The `values` method returns an array of keys.

```javascript
var objectElement = minim.toElement({ foo: 'bar' });
var values = objectElement.values() // ['bar']
```

##### items

The `items` method returns an array of key value pairs which can make iteration simpler.

```js
const objectElement = minim.toElement({ foo: 'bar' });

for (let [key, value] of objectElement.items()) {
  console.log(key, value); // foo, bar
}
```

##### map, filter, reduce, and forEach

The `map`, `filter`, and `forEach` methods work similar to the `ArrayElement` map function, but the callback receives the value, key, and member element instances. The `reduce` method receives the reduced value, value, key, member, and object element instances.

See `getMember` to see more on how to interact with member elements.

```js
const objectElement = minim.toElement({ foo: 'bar' });
const values = objectElement.map((value, key, member) => {
  // key is an instance for foo
  // value is an instance for bar
  // member is an instance for the member element
  return [key.toValue(), value.toValue()]; // ['foo', 'bar']
});
```

### Customizing Namespaces

Minim allows you to register custom elements. For example, if the element name you wish to handle is called `category` and it should be handled like an array:

```javascript
var minim = require('minim').namespace();
var ArrayElement = minim.getElementClass('array');

// Register your custom element
minim.register('category', ArrayElement);

// Load serialized refract elements that includes the new element
var elements = minim.fromCompactRefract(['category', {}, {}, [
  ['string', {}, {}, 'hello, world']
]]);

console.log(elements.get(0).content); // hello, world

// Unregister your custom element
minim.unregister('category');
```

#### Creating Namespace Plugins

It is also possible to create plugin modules that define elements for custom namespaces. Plugin modules should export a single `namespace` function that takes an `options` object which contains an existing namespace to which you can add your elements:

```javascript
var minim = require('minim').namespace();

// Define your plugin module (normally done in a separate file)
var plugin = {
  namespace: function(options) {
    var base = options.base;
    var ArrayElement = base.getElementClass('array');

    base.register('category', ArrayElement);

    return base;
  }
}

// Load the plugin
minim.use(plugin);
```

### Chaining

Methods may also be chained when using getters and setters.

```javascript
var objectElement = minim.toElement({})
  .set('name', 'John Doe')
  .set('email', 'john@example.com')
  .set('id', 4)
```

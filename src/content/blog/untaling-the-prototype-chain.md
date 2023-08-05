---
title: "Untangling the JavaScript prototype chain"
subtitle: "Prototypes are an essential part of the JavaScript language, but a lot of developers
don't understand how they really work"
publishedAt: 2023-06-19T00:00:00-03:00
categories: [javascript]
---

Take a look at the following code snippet:

```javascript
const o = {};
o.toString(); // "[object Object]"
```

If you have some experience with JavaScript, then you're probably going to say, pretty confidently,
that there's nothing wrong this code. You'd be right to say that, of course - there's nothing wrong
with it.

Still, I think you'd agree with me when I say that it can seem _weird_ that we can
call methods on `o` when it's clearly empty.

What makes this possible is one of JavaScript's most important characteristics, its
_prototypal inheritance_ model. You may have heard about it in terms of so called
"prototypes". Anyhow, this model is a foundational part of the language, and understanding
how it works is essential for any JavaScript developer.

## What are prototypes?

<mark>A prototype is just another JavaScript object from which other objects inherit properties.</mark>
To inherit a property from another object means that property can be referenced and used even
if it isn't locally defined. A locally defined property is also referred to as an _own property_.

This explains our previous example with the empty `o` object. We can use the `toString` method
because it is defined in `o`'s prototype!

You can get a reference to an object's prototype by using the built-in method
`Object.getPrototypeOf`:

```javascript
const o = {};
const oPrototype = Object.getPrototypeOf(o);
oPrototype.hasOwnProperty("toString"); // true
```

Since prototypes are just regular JavaScript objects, they can also have prototypes themselves!
By linking multiple objects together, we create what's called a _prototype chain_.

When dealing with prototypes, it's important to understand how inheriting properties
actually work. Let's look at another example:

```javascript
const A = { foo: "bar" };
// `Object.create` is a built-in method that takes an object as a parameter and
// returns a new, empty object with the parameter as its prototype.
// Here, A is B's prototype.
const B = Object.create(A);
const C = Object.create(B);
C.foo; // "bar"
"foo" in C; // true
C.foo = "notBar";
B.foo; // Is still "bar".
A.foo = "baz";
B.foo; // Is now "baz"
C.foo; // "notBar"
```

First, it shows that whenever we attempt to access a property in an object,
the JavaScript interpreter doesn't just look in the object itself,
it actually searches that object's _entire prototype chain_ until it finds a match.
If it doesn't, then the expression evaluates to `undefined`. In our previous example,
`C` doesn't have an own property named `foo`, but its ancestor `A` does, so we can use it.

Lastly, it show that it is possible to override prototype properties
in objects further down the chain without that affecting the objects above it,
but possibly affecting does beneath it.
When we set the value of `C.foo` to `"notBar"`, that doesn't change `A.foo` or `B.foo`.
What actually happens is that we _create a new property named `foo` in `C`_, which
is completely independent from `A.foo`. At the same time, setting `B.foo` to `"baz"`
doesn't affect `C.foo`, because it already has an own property named `foo`.

In short, setting an object's property affects only those beneath it in
the prototype chain that don't have an own property with the same name.

---

Prototypes aren't really useful or fun if we're dealing with singular, specific
objects. Their power and purpose really becomes evident when we use them to define collections
of similar objects.

We can use prototypal inheritance to implement the well-know,
object-oriented notion of _classes of objects_, i.e., a `class`. By defining an
ancestor object as the prototype of many other objects
and placing common behavior in it, we're pretty much defining a "new type"
of object.

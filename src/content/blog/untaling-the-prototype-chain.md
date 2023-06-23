---
title: "Untangling the JavaScript prototype chain"
subtitle: "Prototypes are an essential part of the JavaScript language, but a lot of developers
don't understand how they really work"
publishedAt: 2023-06-19T00:00:00-03:00
categories: [javascript]
---

One does need to work with JavaScript for long
to realize that it's a pretty quirky language. The language
designers made a series of choices that are both the reason for funny memes and for a lot of the
hate it gets online. For example, did you know that `{} + []` yields a string?

Overall, it's safe to say that learning JavaScript is not a very smooth ride. Couple this with the
fact that it's one of the most used/in demand/famous programming languages today, you just got yourself
the perfect recipe for developers that just want to "get working" and skim through the inner workings
of the language. No judgment, I did (and still do) that.

Today, we're going to (hopefully) fix a small of that problem.
I'm going to briefly explain and discuss JavaScript prototypes so that you can maybe
feel a bit better the next time you think you don't understand anything about JavaScript
(you'll at least understand prototypes!).

## What are prototypes?

Take a look at the following code snippet:

```javascript
const emptyObj = {};
console.log(emptyObj.toString()); // [object Object]
```

There's nothing wrong with this code. Still, it makes quite a bit of sense to
ask how is it that `emptyObj` can call the `toString` method when it (apparently) doesn't have any
properties? Where does `toString` live and why can `emptyObj` magically reference it?

The answer to that question is JavaScript prototypes.

What is a prototype, you may ask? Putting it simply, pretty much every JavaScript object
is associated with another object, called its _prototype_. The original object
holds a reference to the prototype and also inherits its properties. So,
any property defined in the prototype is now usable in the original object,
free of charge.

Since JavaScript prototypes are also just regular objects, they can also have
prototypes. This can go on and on, creating a _prototype chain_. Actually,
when you attempt to access a property in an object, the JavaScript interpreter actually
looks for it in the entire prototype chain, until it finds a match. If it doesn't,
it returns `undefined`.

Let's take a look at an example:

```javascript
const A = { foo: "bar" };
const B = Object.create(A); // Creating an object B with the prototype set to A
const C = Object.create(B);
C.foo = "notBar";
console.log(C.foo); // "notBar"
console.log(B.foo); // "bar"
A.foo = "wow";
console.log(B.foo); // "wow"
console.log(C.foo); // "notBar"
```

First, we define an object `A` using an object
literal. Later, we define an object `B` by using the built-in method `Object.create`.
It returns a new object and sets the parameter as its prototype. So `A` is `B`'s prototype,
`B` is `C`'s prototype, but `A` is also in `C`'s prototype chain.

When we access `foo` in `B`, the JavaScript interpreter notices that it doesn't have an
"own property" (a property defined in the object itself) named `foo`, so it looks along `B`'s chain and
finds it in `A` and returns that. It's important to make the distinction here that **`B` does not have a
`foo` property**, only `A` has.

On the other hand, when we assign a new value for `C.foo`, we are effectively _creating_ a new
property named `foo` in `C`. This _does not_ affect the objects above `C` on the chain (`A` and `B`),
but it would affect any object that has `C` as a prototype and doesn't have `foo` as an own property,
just like it happens when we change the value of `A.foo` to `"wow"` and attempt to read the value of `B.foo`.

This is JavaScript's way of implementing a very famous object-oriented mechanism
called [inheritance](<https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)>).
You may also see it get referenced as _prototypal inheritance_.

### VIPs (Very Important Prototypes)

So we now know why we can access a property such as `toString` even in an empty object:
because `toString` lives in that empty object's prototype. This in turn leads us to realize that
when we initialize an object using an object literal, the JavaScript interpreter automatically
sets its prototype, without us knowing. But who is that prototype?

To answer that question, it's important to know that any JavaScript runtime
comes pre-populated with some global prototypes. They are the prototypes
for the language's built-in objects, and are accessible via the `.prototype` property in
each type's correspondent global object, such as `Object.prototype`, `Map.prototype`,
`Array.prototype`, etc.

Each object of a particular type inherits from its correspondent global
prototype, i.e., every array inherits from `Array.prototype`, every map inherits
from `Map.prototype`, etc.

In the case of objects initialized via literals,
their prototype is the famous `Object.prototype`. As you may
have guessed, `Object.prototype` is a rather special prototype, since all
the complex types in JavaScript such as sets, arrays and maps are also objects.
As a matter of fact, `Object.prototype` is present in almost every prototype chain
of every object in JavaScript:

```javascript
const emptyObj = {};
console.log(Object.getPrototypeOf(emptyObj) === Object.prototype); // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null.
```

Here we use the built-in static method `Object.getPrototypeOf` to retrieve the reference
to the parameter's prototype. We can see that `Array.prototype` inherits from `Object.prototype`,
and thus so does every array instance. We also see that `Object.prototype` doesn't have a
prototype. It is the "original" prototype, and it defines some basic methods (and thus behavior)
present in all objects, such as `toString`, `toLocaleString` and `valueOf`.

## Using prototypes

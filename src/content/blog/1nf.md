---
title: "So, what exactly is the definition for the First Normal Form (1NF)?"
subtitle:
  Although rather simple, the First Normal Form (1NF) is probably the most
  misunderstood.
publishedAt: 2022-02-10T00:00:00-03:00
lastEditedAt: 2022-02-10T00:00:00-03:00
categories: [databases, computer-science]
draft: true
---

The First Normal Form (1NF) of database normalization is probably the simplest
one among its peers. It even stands out a bit due to how simple and
straightforward it is, right?

Well, not really. There seems to be a lot of confusion on what it really means
for a relation/table to be in 1NF, but not because it is hard and complex.
Rather, it seems that there isn't really an agreement on the definition itself.

If you do a bit of studying, you'll encounter definitions like "a relation is in
1NF iff it has only atomic values", "it must not have multivalued attributes",
"no repeating groups", "must not have other relations as values" or even "a
table is in 1NF iff it is isomorphic to a relation".

It can be a bit frustrating. While some of these definitions are a bit alike,
they're not really equivalent, and others just seem to be talking about
completely different subjects.

It seems that there has been a big game of telephone and that the original
definition of 1NF has been lost or at least changed severely. While I do think I
managed to go back to the original message, I think there's still things to
learn from the versions that appeared along the way.

## The common definition

If you do a quick Google search for "first normal form", the thing that'll come
up the most is "a relation is in 1NF iff it has only atomic values". An _atomic
value_ is simply a value that cannot be further decomposed into smaller parts.
For example, a boolean value is atomic, while an array is not.

This is the most famous definition currently, I'd say. It's what most people
learn in college (I did, at least), it's present in famous textbooks like
"Database System Concepts" and it appears in pretty much every search result.

There are some famous examples that come together with this definition. For
example, a `name` field is not atomic, as it can be divided into `firstName` and
`lastName`. An `address` field is also not atomic, as it can further subdivided
into `city`, `street`, `zipCode`, `number`, etc.

Pretty straightforward, right? Just keep things as granular as possible and
you're good to go. It's efficient, it keeps things organized and it gives us
more control over our data.

Well, yes and no. The thing is, while this is surely good practice in pretty
much every scenario, <mark>the very concept of atomicity is ambiguous, and thus
isn't sufficient to serve as a definition.</mark>

Why, you may ask? Well, there are many contexts in which a value can be
considered to be "made up of smaller parts" and many others where it may not.
Take a string, for example. A string is really just a sequence of characters.
There are multiple operations defined on it that rely on its composite
(non-atomic) nature, such as character access with `[]` or slicing. At the same
time, operations like concatenation treat them as a single unit. Even simpler
types like floats can be thought of as having multiple parts (integer and
fractional) or not. It's a flimsy definition, to say the least.

This doesn't mean that using strings and floats is a bad idea and that every
table that has them isn't in 1NF and should thus be changed (what would even be
the solution here?). Reaching this absurd conclusion is merely a symptom of a
bad definition. We must then search for another.

Don't get me wrong, I do think that for most applications it's a good idea to
split things like name and address into smaller parts, <mark>this isn't a matter
of database normalization, but rather of application needs.</mark> If your
business logic requires more granular control, then it's a good idea to split it
up. If it doesn't, why introduce the unnecessary complexity?

<details>
<summary>What about multivalued attributes?</summary>
Another definition that pops up a lot for 1NF is that no attributes should be multivalued. A <i>mutilvalued attribute</i> is an attribute that is a collection of values.
For example, an user can have multiple phone numbers. Therefore, to be in 1NF, a
relation would not be allowed to have an attribute that is a collection of phone numbers.
Normally, this definition is paired up with an example where a list of strings (such as phone number list) is represented as a single string,
with each element being separated by a comma, like <a href="https://www.javatpoint.com/dbms-first-normal-form" target="_blank">here</a>.
This is clearly a very bad design choice, but is it a violation of 1NF? Well, if you consider the faulty atomic definition, yes. Multivalued attributes are clearly not atomic, so any table with them are not in that definition of 1NF. But we've already seen that the definition of atomicity itself is too ambiguous to be useful, so we don't consider it.
</details>

## The original definition

The First Normal Form was originally defined by
[E.F. Codd](https://en.wikipedia.org/wiki/Edgar_F._Codd), the computer scientist
who also invented the relational model, the mathematical basis for relational
database systems. In his seminal paper
["A Relational Model of Data for Large Shared Data Banks"](https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf),
he introduces both the relational model and the First Normal Form, originally
just called Normal Form.

So, what's the original motivation behind it? Well, in the paper, Codd says:

> So far, we have discussed examples of relations which are defined on simple
> domains - domains whose elements are atomic values. Non-atomic values can be
> discussed within the relational framework. Thus, some domains may have
> relations as elements. These relations may, in turn, be defined on non-simple
> domains, and so on.

Codd was investigating the possibility of having relations as values for
attributes of other relations, and the impact it might have. He even uses the
terms _atomic_ and _non-atomic_, but clearly referring to relations and
non-relations.

The concern here is that of _data representation_. Before the relational model,
[hierarchical databases](https://en.wikipedia.org/wiki/Hierarchical_database_model)
were widely used, especially in early mainframes. Entries were stored in
tree-like structures, with each being connected through links (pointers), kinda
like a filesystem. While this is a completely valid database approach, it isn't
ideal to model data that is deeply related. Also, it's a structure that can
easily become overly complex.

Later on the paper, Codd says:

change this!

> A relation whose domains are all simple can be represented in storage by a
> two-dimensional column-homogenous array of the kind discussed above. Some more
> complicated data structure is necessary for a relation with one or more
> non-simple domains. For this reason (and others cited below) the possibility
> of eliminating non-simple domains appears worth investigating. There is, in
> fact, a very simple elimination procedure, which we shall call normalization.

> [...] The simplicity of the array representation which becomes feasible when
> all relations are cast in normal form is not only an advantage for storage
> purposes but also for communication of bulk data between systems which use
> widely different representations of the data.

A _"two-dimensional column-homogenous array"_ is just a very fancy word for a
_table_, which can also be thought of as a 2d array. T

The bigger array (table) is made up of smaller arrays (entries from the table).
Adding an attribute that has a non-atomic domain would add another dimension to
it.

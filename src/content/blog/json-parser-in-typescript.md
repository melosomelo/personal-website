---
title: Writing a JSON parser in TypeScript
subtitle: "Parsing is a very important topic in computer science. Let's learn more about it by writing 
a JSON parser with TypeScript"
publishedAt: 2023-05-25T00:00:00-03:00
categories: [math, computer-science, typescript]
---

## A sprinkle of theory

The mathematical basis for parsing is the theory of **formal lingustics**. Its objects of study
are formal **languages** and **grammars**.

As complex and subjective as natural languages can be, formal languages are treated merely as **sets of strings
of characters**. The individual characters are defined in an auxiliary
set called an **alphabet**. Each element of the language set is called a **word** or a **sentence**.

Common string operations, such as concatenation, are also defined for formal languages. It is no
surprise then that the **empty string** (the string with no length, you
probably know it as `""`) is also a present construct, and is
usually denoted (and will so for the remainder of this article) by the greek letter $\epsilon$.

As an example, consider the alphabet $\Sigma = \{a,b,c\}$. We can construct many (infinite, actually)
languages from it:

- A finite language of all the permutations of the characters: $\{abc, acb, bca, bac, cab, cba\}$.
- A finite language of single-character words: $\{a,b,c\}$.
- A finite language with only the empty string: $\{\epsilon\}$.
- An infinite language $ABCN$, where each word has $n$ $a$s followed by $n$ $b$s and $n$ $c$s:
  $\{abc, aabbcc, aaabbbccc, \dots\}$.

The use of formal languages is not limited to only model these seemingly unimportant scenarios.
Actually, we can use this simple definition to represent things that are very much present
in our daily lives as software engineers.

For example, we can define the language of all valid arithmetic expressions involving the
addition and multiplication operators, $ARITH$. A string such as $32 \cdot (4 + 2)$ would belong in that set,
while a malformed expression such as $1 + \cdot 2$ would not. Another relevant example would be
the language $JS$ of all valid JavaScript programs (they are, after all, just sequences of characters).
Something like $\texttt{const x = 2;}$ belongs in that set, while $\texttt{cnst =x2 if()}$
most certainly doesn't.

This hints at the fact that parsing an input string $s$ actually is just checking if $s$
belongs to a specific language set. If it does, then the parse will be successful. If it does not,
then $s$ is malformed and a syntax error must be thrown.

---

That's great and all, but this doesn't gives us a general, formal way of telling if $s$
belongs to $L$, especially for cases when $L$ is infinite. As of now, we "just know" by
looking at both. We can even provide a _why_ to justify $s$ being malformed (e.g., "`if x === 2` doesn't
belong in $JS$ because an `if` keyword must be followed by a pair of parenthesis!), but it'd still
lack formalism.

So, what do we do? Well, looking at some of our previous examples,
there's clearly an _implicit set of rules_ that a string needs to follow in order to be considered
an element of that language set. One such rule for the $JS$ language could be: "the definition for a function
must begin with the keyword `function`".

For natural languages such as English or French, this "set of rules" is called their **grammar**.
It describes what makes up a valid sentence in that language. Formal languages also posses grammars,
but they're a bit different. Instead of statically describing _what_ a valid sentence looks like,
it describes _how_ to generate all of the valid sentences for that language. A formal language
can have multiple grammars.

Let's define a grammar. A **formal grammar** $G$ is a 4-tuple
(a fancy word for "a thing made up of 4 parts") with:

- An alphabet set $\Sigma$ called its **terminal symbols**. These are the characters that
  will actually make up the strings of the language described by $G$.
- A set of symbols $N$ called the **non-terminal symbols**. These
  symbols are _syntactic variables_ that are meant to be replaced according to the grammar's
  productions to build the language's elements.
- A special non-terminal $S$ called the **starting symbol**. Every construction of a language
  word starts with $S$.
- And finally, a set $P$ of **production rules**. These are rules that tell how to transform
  a set of symbols into another set of symbols. We construct a word by applying one rule after
  the other until only terminals are left.

This definition becomes clearer with an example. Let's create a simple grammar for the
language $ARITH$, which was introduced earlier. Defining a grammar is very much like
describing the thing you're trying to model. In this case, it's arithmetic expressions.
How you would describe the structure of one? Well, I'd say that an expression can be:

- A single value, like a number.
- An operation (in this case, addition or multiplication) performed on two sub-expressions.
  So this covers things like $3 + 2$ or $3 \cdot 2 + 10 \cdot 45$.
- An expression enclosed in parenthesis, like $(3 + 2)$.

Let's write a grammar for it:

$$
S \rightarrow E \\
E \rightarrow E + E \mid E \cdot E \mid (E) \mid N \\
N \rightarrow DR \\
D \rightarrow 0 \mid 1 \mid 2 \mid \dots \mid 9 \\
R \rightarrow DR \mid \epsilon
$$

Each line represents one (or more) production rules. Each rule states that you can take what's on
its left side and transform it into what's on the right. The lines that have the $\mid$ character
merely aggregate productions that have the same left side.

Notice how the non-terminal $E$
is a direct representation of our previous definition for what an expression is. Also notice
how some rules, like $E$ and $R$ can be recursive, and how we can kill that recursion with
an $\epsilon$-rule (a rule whose right side is the empty string).

As an example, we're going to recreate the string $s = 32 \cdot (4 + 2)$ using our newly defined grammar.
We of course start with $S$. It has only one production, so we apply it and get $E$. Taking
a look at the overall structure of $s$, we can see that the main operation is a multiplication, so
we apply the rule $E \rightarrow E \cdot E$. The left operand is a simple number, so we apply
$E \rightarrow N$, and for the right we apply $E \rightarrow (E)$. The remaining steps are:

$$
N \cdot (E) \\
\rightarrow DR \cdot (E + E) \\
\rightarrow 3R \cdot (N + N) \\
\rightarrow 3DR \cdot (DR + DR) \\
\rightarrow 32\epsilon \cdot (4R + 2R) \\
\rightarrow 32 \cdot (4\epsilon + 2\epsilon) \\
\rightarrow 32 \cdot (4 + 2)
$$

I applied some rules at the same time, but you get the gist of it. We started with $S$
and applied a series of rules that derived $s$. This process can also be represented visually:

![Visual representation of the derivation of 32 * (4 + 2)](/images/json-parser-in-typescript/parse-tree-32times4plus2.png)

This is what's called a **parse tree** or a **production tree**. The root is $S$ and the leaves
are all the terminal symbols of the final string. Each non-leaf node is a terminal and
its children are created based on a specific rule from the grammar.
Depending on the grammar, a single string can
have multiple parse trees (can be derived using different combinations of productions).
If that's the case, the grammar is said to be **ambiguous**. Our grammar for $ARITH$ is ambiguous
(can you find another parse tree for $32 \cdot (4 + 2)$?). When building parsers, this is usually
a problem, but we'll get back to this later.

Anyhow, we now have a formal way of answering if a particular string $s$ belongs to a language $L$.
To do so, we need to construct a grammar $G$ that describes $L$ and check if we can derive $s$
(construct its parse tree) using $G$'s rules. <mark>Thus, parsing a string is actually attempting to
construct its parse tree.</mark>

That's what we're going to do next. We're going to build a formal grammar that describes the JSON
language, and based on it, we're going to write a parser.

:::details[Different types of grammars]
Formal grammars are very expressive and can describe lots of different languages. At the same time,
if let unrestricted, their study can become very difficult and the associated parsers inefficient.
Because of this, a categorization has been put in place. It is known as the
[Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy) and it divides
grammars into types 0, 1, 2 and 3. I say this because there isn't an efficient parsing
algorithm that can handle all types of grammars. Thus, it is necessary, when
writing a formal grammar, to purposefully write in a way that puts it at a specific level in the
hierarchy. Most efficient parsing algorithms target type 2 grammars, also called
[**context-free grammars**](https://en.wikipedia.org/wiki/Context-free_grammar),
as they have a good balance of simplicity and expressiveness.
:::

## It's ~morbin'~ parsing time

We've seen that parsing a string $s$ boils down to reconstructing its parse tree
using a grammar that describes the language. There are two main ways to do this:
**top-down** (starting at the root and ending with the leaves) and **bottom-up**
(starting at the leaves and finishing with the root).

We're going to build a top-down parser, as they're easier to write by hand
and the requirements for the grammar aren't too taxing for simple languages like
JSON (we'll talk about these in a minute).

We've already performed top-down parsing in this article. Our previous example of
deriving the string $32 \cdot (4 + 2)$ using the grammar for the language $ARITH$ was just that.
We started with $S$ and then applied a series of production rules until we got the input string.

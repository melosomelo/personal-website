---
title: Writing a JSON parser in TypeScript
subtitle: "Parsing is a very important topic in computer science. Let's learn more about it by writing 
a JSON parser with TypeScript"
publishedAt: 2023-05-25T00:00:00-03:00
categories: [math, computer-science, typescript]
---

## A gentle introduction to formal linguistics

The mathematical basis for parsing is the theory of **formal linguistics**. Its objects of study
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

That's great and all, but this doesn't gives us a general, formal way of telling if $s$
belongs to $L$, especially for cases when $L$ is infinite. As of now, we "just know" by
looking at both. We can even provide a _why_ to justify $s$ being malformed (e.g., "`if x === 2 {}` doesn't
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

Each line above represents one (or more) production rules.
A rule states that you can take what's on its left side (left of the arrow $\rightarrow$) and
transform it into what's on the right. The lines that have the $\mid$ character merely aggregate
productions that have the same left side. Here, the non-terminals are represented by the uppercase
letters; and the terminals are the digits, the operators $+$ and $\cdot$, and the parenthesis.

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
are all the terminal symbols of the final string. Each non-leaf node is a non-terminal and
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

I know this is quite a bit of theory, but it truly is essential to really understanding the process
of building a parser. If you're not 100% comfortable with it yet, I recommend that you read it
again, as we will build upon it on the next section, where I go into a bit more detail on what
kind of parser we're going to build.

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

## Defining and understanding our strategy

We have established that parsing a string $s$ boils down to reconstructing its parse tree
using a grammar that describes the language. There are two main ways to do this:
**top-down** (starting at the root and ending with the leaves) and **bottom-up**
(starting at the leaves and finishing with the root).

We're going to build a top-down parser, as they're usually easier to write by hand
and the requirements for the associated grammar aren't too taxing for simple languages like
JSON (we'll talk about these in a minute).

You may not have realized it, but we've already performed top-down parsing in this article.
Our previous example of
deriving the string $32 \cdot (4 + 2)$ using the grammar for the language $ARITH$ was just that.
We started with $S$ (the root) and then applied a series of production rules
until we got the input string (the leaves).

In that example, you can see that we deliberately picked the rules that got us closer to the input
string. We, as readers, can make that distinction based on intuition. The computer, of course, cannot.

A naive approach then would be for the parser to test every possible production at every step, and
when it got stuck, it would backtrack and try a different route.
Needless to say, this would be incredibly slow. Some parsers do work based on backtracking,
but they do it on smaller sets of possible productions and are still considered inefficient
for practical purposes.

The ideal scenario is for the parser to know _exactly_ which production to apply, at all times,
and if it reaches a dead-end then it's because the input string is malformed. But based on what
will it be able to perform such deductions? Is such a parser even possible? Yes, it is. They're called **deterministic parsers**, and we're going to build one of them.

This is how a deterministic top-down parser works:

- It receives an input string to parse. It concatenates this string with a special terminal symbol
  $\#$. This symbol is called the **end of input** symbol. We need it to deal with cases
  when a syntax error occurs because the input string ended unexpectedly. This new
  string wil be referred to as $s_i$.
- After this, it initializes a temporary string $s_t$ to $S\#$ (the grammar's starting symbol
  concatenated with the end of input character).
  This string will be manipulated via the grammar rules to look like $s_i$.
- The parser initializes pointers to the start of both $s_i$ and $s_t$ and begins its iterative process.
- At every iteration, it will look at the current symbol that it's pointing to in $s_t$ and will
  check:
  - If the symbol is a non-terminal $A$, then it reads the current terminal $x$ from $s_i$ and
    based on the pair $(A,x)$, it chooses a production to apply and replace $A$ (we'll detail
    how it makes that choice in a moment). This choice is **guaranteed** to get $s_t$ closer to $s_i$.
    If such a choice is not possible, a syntax error is thrown.
  - If the character is a terminal $a$, then it compares $x$ and $a$. If they're equal, then the parser
    advances to the next symbol of both $s_i$ and $s_t$. If they aren't, then a syntax error is thrown.

This process ends when both $s_i$ and $s_t$ have reached the end of input character at the same time.

You may be wondering yourself, how is the parser able to choose the right production based on a
non-terminal $A$ and a terminal $x$? That's because of what's called a **parsing table**. Each
entry $(A,x)$ from that table is the production the parser must apply when it encounters a terminal $x$
in $s_i$ and a non-terminal $A$ in $s_t$ in order to make $s_t$ more like $s_i$.
If the table entry is empty, then this means that there's a
syntax error in $s_i$.

This of course leads to the question: how (and when) is the parsing table constructed?
There's a short and a long answer.

The short answer is that there algorithms that automatically generate parsing tables,
and they do it by analyzing the grammar. This is done before you even write your parser.
To guarantee that each entry in the parsing table has no more than one production (and thus
that your parser is deterministic), your grammar needs to be in what's called $LL(1)$ form,
i.e., it must be written in such a way that it has a set of properties that guarantee
the parser is deterministic.

I know this isn't very satisfactory as of now, but bear with me. I'll give you the long
answer in the next section. For now, let's go through an example to solidify our understanding
of how a deterministic top-down parser works.

Consider the following grammar:

$$
S \rightarrow a A b \mid b A a \\
A \rightarrow c S \mid \epsilon
$$

It produces strings like $ab$, $ba$, $acbab$, $bcaba$, etc.
Let's parse the string $acbab$ in a top-down fashion. Each line of the table below represents
an iteration of the parsing algorithm. The character $\mid$ is the position of the parser
in the input string $s_i$ and the temporary string $s_t$.

|       $s_t$        |       $s_i$        |                    Action taken                     |
| :----------------: | :----------------: | :-------------------------------------------------: |
|     $\mid S\#$     |   $\mid acbab\#$   |        Apply production $S \rightarrow aAb$         |
|    $\mid aAb\#$    |   $\mid acbab\#$   | Terminal from $$ and $s_i$ are equal, thus advance. |
|    $a\mid Ab\#$    |  $a \mid cbab\#$   |         Apply production $A \rightarrow cS$         |
|   $a\mid cSb\#$    |  $a \mid cbab\#$   |            Terminals are equal. Advance.            |
|   $ac\mid Sb\#$    |   $ac\mid bab\#$   |        Apply production $S \rightarrow bAa$         |
|  $ac\mid bAab\#$   |   $ac\mid bab\#$   |            Terminals are equal. Advance.            |
| $ac b \mid Aab\#$  |  $ac b\mid ab\#$   |      Apply production $A \rightarrow \epsilon$      |
|  $ac b \mid ab\#$  |  $ac b\mid ab\#$   |            Terminals are equal. Advance.            |
| $ac b  a \mid b\#$ | $ac b a \mid b\#$  |            Terminals are equal. Advance.            |
| $ac b  a b\mid\#$  | $ac b a b \mid \#$ |     Parsing is finished. Input string is valid.     |

And the parsing table for this parser is:

<div class="table-container">
  <table>
    <tr>
      <th></th>
      <th>a</th>
      <th>b</th>
      <th>c</th>
      <th>#</th>
    </tr>
    <tr>
      <th>S</th>
      <td>S -> a A b</td>
      <td>S -> b A a</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>A</th>
      <td>ε</td>
      <td>ε</td>
      <td>c S</td>
      <td></td>
    </tr>
  </table>
</div>

Let's try to make sense of this table. For example, if we're currently expanding the non-terminal
$S$ and we encounter a terminal $a$ in $s_i$, then our only choice is to apply $S \rightarrow aAb$,
as it is the only production from $S$ that produces a leading $a$ character. Notice how the way
in which the grammar is written makes this decision possible. At the same time,
the parser also knows when to kill the current terminal with an $\epsilon$-rule. On the
seventh iteration from this last example, it encounters an $a$ terminal on $s_i$ and
a non-terminal $A$ on $s_t$. $A$ has no productions that create $a$, so the parser deduces
that $A$ has nothing more to contribute and removes it via the $\epsilon$-rule.

To get an even better understanding of this type of parser, I recommend that you run an example
by yourself for an invalid string, such as $abba$.

## Constructing the parsing table

In this section, I'll explain the algorithm for generating parsing tables for $LL(1)$ grammars.
After that, I'll provide you with an $LL(1)$ grammar for the JSON language, and then we're going
to generate our parsing table.

This part will again contain quite a bit of theory, so if you're not really in the mood for that
right now, you can go to the next section - where we actually start writing some code - and
come back here later, if you want. It's not mandatory, as to write the parser you only need
the grammar and the parsing table, and I'll provide them to you at the beginning of the next section.

## It's ~morbin'~ parsing time

[eai](/misc/posts/json-parser-in-typescript/grammar.txt)

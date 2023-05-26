---
title: Writing a JSON parser in TypeScript
subtitle: "Parsing is a very important topic in computer science. Let's learn more about it by writing 
a JSON parser with TypeScript"
publishedAt: 2023-05-25T00:00:00-03:00
categories: [math, computer-science, typescript]
---

Parsing is a pretty fundamental topic in computer science. Being able to systematically and efficiently
validate the structure of a sequence of characters has numerous applications in lots of fields,
but the most important one certainly is validating the syntax of files written in specific programming languages.

## A sprinkle of theory

The mathematical basis for parsing is the theory of
[formal linguistics](https://en.wikipedia.org/wiki/Formal_language).
Its objects of study are formal **languages** and **grammars**.

In formal linguistics, languages are merely **sets of strings of characters**, whose individual characters
are listed in an auxiliary set called its **alphabet**. The strings
in the language are called **words** or **sentences**. Some languages can also contain the
**empty word**, usually denoted by $\epsilon$.

For example, consider the alphabet $\Sigma = \{a,b,c\}$. We can use it to construct many languages:

- A language with a single word $\{abc\}$.
- A language with just the empty word $\{\epsilon\}$.
- A language with three words made up of single characters $\{a,b,c\}$.
- An infinite language $ABCN$, made up of words that have $n \geq 1$ $a$ characters, followed by $n$ $b$s
  and $n$ $c$s $\{abc,aabbcc, aaabbbccc, \dots \}$.

We could also use something like the [Unicode alphabet](https://en.wikipedia.org/wiki/List_of_Unicode_characters)
to construct the language of all valid JavaScript programs $\{\texttt{let x = 2;}, \dots\}$.

The last two items are of particular interest to us. First, they're both infinite.
We provide a finite (albeit informal) description that _generates_ an infinite set.
Also, they posses a more visible _structure_ than the other ones that enables us to
tell when a string does not belong in the language. For example, we know that the string
$abbcc$ does not belong in $ABCN$ and that $\texttt{cnst x = 2;}$ is not a valid JavaScript
program. We can too provide a reasonable explanation as to why is that, but (especially)
in the JavaScript program case, it'd be lacking formalism. So far, we just "know".

In natural languages such as French and English,
the part which describes what makes up a valid sentence in that language is called its **grammar**.
Formal languages also possess grammars, but they're a bit different. Instead of statically describing
_what_ a valid sentence looks like, it describes _how_ to generate all of the valid sentences for that
language. A single formal language can have many different grammars.

Formally, a **formal grammar** is a 4-tuple (a fancy word for "something that is made up of 4 parts") with:

- $V_T$, a set of symbols called **terminal symbols**. These are the symbols that actually make up
  the strings in the language.
- $V_N$, a set of symbols called **non-terminal symbols**. These are symbols that are meant to be
  replaced in the _productions_ from the grammar so that the final strings can be produced.
- $S$, a special non-terminal called the **starting symbol**. All constructions of strings
  from a language start with it.
- $P$, a set of **productions**. These are _rules_ that tell us how to transform a set of symbols
  from the grammar (both terminal and non-terminal) into another set of symbols (terminal and non-terminal).

Usually, to construct a valid string for a language with its grammar we (1) begin with the starting symbol
and (2) apply production rules until the string is made up of only terminal symbols.

This definition becomes clearer with an example. Let's consider the language of all valid arithmetic
expressions involving the operators $+$ and $\cdot$. A string such as $3 \cdot (4 + 2)$ would be in
that language, while $3 + \cdot 2$ would not. Here's one possible grammar for it:

- $S \rightarrow E$
- $E \rightarrow E + E \mid E \cdot E \mid (E) \mid N$
- $N \rightarrow DR$
- $D \rightarrow 0 \mid 1 \mid 2 \mid \cdots \mid 9$
- $R \rightarrow \epsilon \mid DR$

Each line here represents one (or more) productions from the grammar. A production turns
the symbols on its left-hand side into the symbols on its right. The lines with the $\mid$ symbol
mere aggregate productions that have the same set of symbols on their left. The uppercase letters
here are the non-terminals and the digits, the operators and the parenthesis are the terminals. Also
notice how some rules transform a non-terminal into the empty string $\epsilon$. That's completely
valid (and very useful).

As an example, let's construct the string $32 \cdot (4 + 2)$ using the grammar above. We start with
$S$ and then apply the rule $S \rightarrow E \cdot E$. We can apply the $(E)$ rule on the second $E$
to get $E \cdot (E)$. We then continue on the second $E$ and expand it to $E + E$, resulting in
$E \cdot (E + E)$. Things are starting to get really similar. The remaining steps are:

$$
E \cdot (E+E) \rightarrow N \cdot (E+E) \\
\rightarrow DR \cdot (E+E) \\
\rightarrow 3R \cdot (E+E) \\
\rightarrow 3DR \cdot (E+E) \\
\rightarrow 32R \cdot (E+E) \\
\rightarrow 32\epsilon \cdot (E+E) \\
\rightarrow 32 \cdot (N + N) \\
\rightarrow 32 \cdot (DR + DR)\\
\rightarrow 32 \cdot (4 + 2)
$$

I skipped some steps, but you get the gist of it. We applied a number of productions rules
and generated the desired string in the language. This production process can also be
represented visually:

![A parse tree for the string 32 * (4 + 2)](/images/posts/json-parser-in-typescript/parse-tree01.png)

This is what's called a **parse tree** or a **production tree**. The root is the starting symbol
of the grammar and, since the string does belong in the language, all of the leaves are terminal symbols.
By constructing a valid parse tree, we have checked that the string does indeed belong to the language.

Thus, we can describe what it means to successfully (or not) parse a string in terms of
languages, grammars and parse trees. <mark>Given a string $s$, to check if $s$ belongs in
a language $L$, we have to first find a grammar $G$ that generates $L$ and attempt
to produce a valid parse tree for $s$ with $G$.</mark>

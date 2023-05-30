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
of characters**. The individual characters in turn are defined in an auxiliary
set called an **alphabet**. Each element of the language set is called a **word** or a **sentence**.

Common string operations, such as concatenation, are also defined for formal languages. It is no
surprise then that the **empty string** (the string with no length, you
probably know it as `""`) is also a present construct, and is
usually denoted (and will so for the remainder of this article) by the greek letter $\epsilon$.

As an example, consider the alphabet $\Sigma = \{a,b,c\}$. We can construct many (infinite, actually)
languages from it:

- A finite language of all the permutations of these characters: $\{abc, acb, bca, bac, cab, cba\}$.
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
Something like $\texttt{const x = 2;}$ belongs in that set, while $\{\texttt{cnst =x2 if()}\}$
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
it describes _how_ to generate all of the valid sentences for that language. A single formal language
can have many different grammars.

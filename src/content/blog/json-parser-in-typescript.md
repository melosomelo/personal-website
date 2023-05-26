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
are listed in an auxiliary set called its **alphabet**, usually denoted by the letter $\Sigma$. The strings
in the language are called **words** or **sentences**. Some languages can also contain the
**empty word**, usually denoted by $\epsilon$.

For example, consider the alphabet $\Sigma = \{a,b,c\}$. We can use it to construct many languages:

- A language with a single word $\{abc\}$.
- A language with just the empty word $\{\epsilon\}$.
- A language with three words made up of single characters $\{a,b,c\}$.
- An infinite language $ABCN$, made up of words that have $n \geq 1$ $a$ characters, followed by $n$ $b$s
  and $n$ $c$s $\{abc,aabbcc, aaabbbccc, \dots \}$.
- An infinite language $JS$, made up of all the valid JavaScript programs $\{\texttt{let x = 2;}, \dots\}$

The two last items are of particular interest to us. First, they're both infinite. We provide a
finite description that _generates_ an infinite set. We can't do much with it as of now, but we've
seen that it's possible. Also, they both possess a more visible _structure_
that enables us to tell when a string
does not belong in the language. For example, we _know_ that the string $abbcc$ does not belong in $ABCN$ and
that $\texttt{cnst x = 2;}$ is not a valid JavaScript program. We can provide a reasonable explanation
as to why they don't, but (especially in the JavaScript program case), it'd be lacking formalism.

In natural languages such as French and English,
the subject which describes what makes up a valid sentence in that language is called its **grammar**.
Formal languages also possess grammars, but they're a bit different.
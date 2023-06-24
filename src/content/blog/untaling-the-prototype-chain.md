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

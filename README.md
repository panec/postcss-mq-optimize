# PostCSS Mq Optimize [![Build Status][ci-img]][ci]

[![Build Status](https://travis-ci.org/panec/postcss-mq-optimize.svg?branch=master)](https://travis-ci.org/panec/postcss-mq-optimize)

[PostCSS] plugin Removes invalid media queries or its expressions.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/panec/postcss-mq-optimize.svg
[ci]:      https://travis-ci.org/panec/postcss-mq-optimize

```css
/* Input example */
@media (min-width: 200px) and (max-width: 300px) {
  .foo {}
}
@media (min-width: 200px) and (max-width: 300px) and (min-width: 100px) {
  .bar {}
}
@media (min-width: 200px) and (max-width: 300px) and (min-width: 200px) {
  .baz {}
}
@media (min-width: 200px) and (max-width: 300px) and (max-width: 100px) {
  .qux {}
}
@media screen and (max-width: 300px), (max-width: 200px) {
  .quux {}
}
```

```css
/* Output example */
@media (min-width: 200px) and (max-width: 300px) {
  .foo {}
}
@media (min-width: 200px) and (max-width: 300px) {
  .bar {}
}
@media (min-width: 200px) and (max-width: 300px) {
  .baz {}
}
@media screen and (max-width: 300px), (max-width: 200px) {
  .quux {}
}
```

## Usage

```js
postcss([ require('postcss-mq-optimize') ])
```

See [PostCSS] docs for examples for your environment.

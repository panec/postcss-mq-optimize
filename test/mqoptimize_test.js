"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
var postcss = require("postcss");
var mqoptimize = require("../index");

const testCases = [
    {
        name: "Skip mq - and",
        input: "@media (min-width: 200px) and (max-width: 300px) { .foo {} }",
        expected: "@media (min-width: 200px) and (max-width: 300px) { .foo {} }",
    },
    {
        name: "Skip mq - and with range syntax",
        input: "@media (width >= 200px) and (width <= 300px) { .foo {} }",
        expected: "@media (width >= 200px) and (width <= 300px) { .foo {} }",
    },
    {
        name: "Skip mq - only",
        input: "@media only screen and (min-width: 200px) and (max-width: 300px) { .foo {} }",
        expected: "@media only screen and (min-width: 200px) and (max-width: 300px) { .foo {} }",
    },
    {
        name: "Skip mq - only with range syntax",
        input: "@media only screen and (width >= 200px) and (width <= 300px) { .foo {} }",
        expected: "@media only screen and (width >= 200px) and (width <= 300px) { .foo {} }",
    },
    {
        name: "Skip mq - not",
        input: "@media not screen and (min-width: 200px) and (max-width: 300px) { .foo {} }",
        expected: "@media not screen and (min-width: 200px) and (max-width: 300px) { .foo {} }",
    },
    {
        name: "Skip mq - not with range syntax",
        input: "@media not screen and (width >= 200px) and (width <= 300px) { .foo {} }",
        expected: "@media not screen and (width >= 200px) and (width <= 300px) { .foo {} }",
    },
    {
        name: "Skip mq - comma-seperated list & and",
        input: "@media (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }",
        expected: "@media (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }",
    },
    {
        name: "Skip mq - comma-seperated list & and with range syntax",
        input: "@media (width >= 200px) and (width <= 300px), (width <= 200px) { .foo {} }",
        expected: "@media (width >= 200px) and (width <= 300px), (width <= 200px) { .foo {} }",
    },
    {
        name: "Skip mq - comma-seperated list & only",
        input: "@media only screen and (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }",
        expected: "@media only screen and (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }",
    },
    {
        name: "Skip mq - comma-seperated list & only with range syntax",
        input: "@media only screen and (width >= 200px) and (width <= 300px), (width <= 200px) { .foo {} }",
        expected: "@media only screen and (width >= 200px) and (width <= 300px), (width <= 200px) { .foo {} }",
    },
    {
        name: "Skip mq - comma-seperated list & not",
        input: "@media not screen and (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }",
        expected: "@media not screen and (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }",
    },
    {
        name: "Skip mq - comma-seperated list & not with range syntax",
        input: "@media not screen and (width >= 200px) and (width <= 300px), (width <= 200px) { .foo {} }",
        expected: "@media not screen and (width >= 200px) and (width <= 300px), (width <= 200px) { .foo {} }",
    },
    {
        name: "Skip mq - min-width & max-width",
        input: "@media (min-width: 200px) and (max-width: 1024px) { .foo {} }",
        expected: "@media (min-width: 200px) and (max-width: 1024px) { .foo {} }",
    },
    {
        name: "Skip mq - width >= & width <=",
        input: "@media (width >= 200px) and (width <= 1024px) { .foo {} }",
        expected: "@media (width >= 200px) and (width <= 1024px) { .foo {} }",
    },
    {
        name: "Skip mq - max-width & orientation",
        input: "@media (max-width: 1024px) and (orientation: landscape) { .foo {} }",
        expected: "@media (max-width: 1024px) and (orientation: landscape) { .foo {} }",
    },
    {
        name: "Skip mq - width <= & orientation",
        input: "@media (width <= 1024px) and (orientation: landscape) { .foo {} }",
        expected: "@media (width <= 1024px) and (orientation: landscape) { .foo {} }",
    },
    {
        name: "Skip mq - min-width, max-width & orientation",
        input: "@media (min-width: 200px) and (max-width: 1024px) and (orientation: landscape) { .foo {} }",
        expected: "@media (min-width: 200px) and (max-width: 1024px) and (orientation: landscape) { .foo {} }",
    },
    {
        name: "Skip mq - width >=, width <= & orientation",
        input: "@media (width >= 200px) and (width <= 1024px) and (orientation: landscape) { .foo {} }",
        expected: "@media (width >= 200px) and (width <= 1024px) and (orientation: landscape) { .foo {} }",
    },
    {
        name: "Syntax mq - min-width, max-width & no spaces",
        input: "@media (min-width: 200px)and(max-width: 1024px){ .foo {} }",
        expected: "@media (min-width: 200px) and (max-width: 1024px){ .foo {} }",
    },
    {
        name: "Syntax mq - width >=, width <= & no spaces",
        input: "@media (width >= 200px)and(width <= 1024px){ .foo {} }",
        expected: "@media (width >= 200px) and (width <= 1024px){ .foo {} }",
    },
    {
        name: "Update mq - min-width x 2, same values",
        input: "@media (min-width: 200px) and (max-width: 300px) and (min-width: 200px) { .foo {} }",
        expected: "@media (min-width: 200px) and (max-width: 300px) { .foo {} }",
    },
    {
        name: "Update mq - width >= x 2, same values",
        input: "@media (width >= 200px) and (width <= 300px) and (width >= 200px) { .foo {} }",
        expected: "@media (width >= 200px) and (width <= 300px) { .foo {} }",
    },
    {
        name: "Update mq - min-height x 2, same values",
        input: "@media (min-height: 200px) and (max-height: 300px) and (min-height: 200px) { .foo {} }",
        expected: "@media (min-height: 200px) and (max-height: 300px) { .foo {} }",
    },
    {
        name: "Update mq - height >= x 2, same values",
        input: "@media (height >= 200px) and (height <= 300px) and (height >= 200px) { .foo {} }",
        expected: "@media (height >= 200px) and (height <= 300px) { .foo {} }",
    },
    {
        name: "Update mq - min-width x 3, same values",
        input: "@media (min-width: 200px) and (max-width: 300px) and (min-width: 200px) and (min-width: 200px) { .foo {} }",
        expected: "@media (min-width: 200px) and (max-width: 300px) { .foo {} }",
    },
    {
        name: "Update mq - width >= x 3, same values",
        input: "@media (width >= 200px) and (width <= 300px) and (width >= 200px) and (width >= 200px) { .foo {} }",
        expected: "@media (width >= 200px) and (width <= 300px) { .foo {} }",
    },
    {
        name: "Update mq - min-width x 2, different values",
        input: "@media (min-width: 200px) and (max-width: 300px) and (min-width: 300px) { .foo {} }",
        expected: "@media (min-width: 300px) and (max-width: 300px) { .foo {} }",
    },
    {
        name: "Update mq - width >= x 2, different values",
        input: "@media (width >= 200px) and (width <= 300px) and (width >= 300px) { .foo {} }",
        expected: "@media (width >= 300px) and (width <= 300px) { .foo {} }",
    },
    {
        name: "Update mq - min-width x 2, max-height x 2, different values",
        input: "@media (min-width: 200px) and (max-height: 300px) and (min-width: 300px) and (max-height: 400px) { .foo {} }",
        expected: "@media (min-width: 300px) and (max-height: 300px) { .foo {} }",
    },
    {
        name: "Update mq - width >= x 2, height <= x 2, different values",
        input: "@media (width >= 200px) and (height <= 300px) and (width >= 300px) and (height <= 400px) { .foo {} }",
        expected: "@media (width >= 300px) and (height <= 300px) { .foo {} }",
    },
    {
        name: "Update mq - leave unknown features intact",
        input: "@media (min-width: 200px) and (max-width: 300px) and (dummy: dummyvalue) { .foo {} }",
        expected: "@media (min-width: 200px) and (max-width: 300px) and (dummy: dummyvalue) { .foo {} }",
    },
    {
        name: "Update mq - leave unknown features intact with range syntax",
        input: "@media (width >= 200px) and (width <= 300px) and (dummy: dummyvalue) { .foo {} }",
        expected: "@media (width >= 200px) and (width <= 300px) and (dummy: dummyvalue) { .foo {} }",
    },
    {
        name: "Update mq - min-width x 2, different values, comma-seperated list",
        input: "@media (min-width: 200px) and (max-width: 300px) and (min-width: 300px), (min-width: 200px) { .foo {} }",
        expected: "@media (min-width: 300px) and (max-width: 300px), (min-width: 200px) { .foo {} }",
    },
    {
        name: "Update mq - width >= x 2, different values, comma-seperated list",
        input: "@media (width >= 200px) and (width <= 300px) and (width >= 300px), (width >= 200px) { .foo {} }",
        expected: "@media (width >= 300px) and (width <= 300px), (width >= 200px) { .foo {} }",
    },
    {
        name: "Update mq - min-width >= max-width, comma-seperated list",
        input: "@media (min-width: 200px) and (max-width: 100px), (min-width: 200px) { .foo {} }",
        expected: "@media (min-width: 200px) { .foo {} }",
    },
    {
        name: "Update mq - width >= greater than width <=, comma-seperated list",
        input: "@media (width >= 200px) and (width <= 100px), (width >= 200px) { .foo {} }",
        expected: "@media (width >= 200px) { .foo {} }",
    },
    {
        name: "Update mq - min-width x 2, min-width == max-width",
        input: "@media (min-width: 200px) and (max-width: 300px) and (min-width: 300px) { .foo {} }",
        expected: "@media (min-width: 300px) and (max-width: 300px) { .foo {} }",
    },
    {
        name: "Update mq - width >= x 2, width >= == width <=",
        input: "@media (width >= 200px) and (width <= 300px) and (width >= 300px) { .foo {} }",
        expected: "@media (width >= 300px) and (width <= 300px) { .foo {} }",
    },
    {
        name: "Update mq - min-width, max-width, min-width",
        input: "@media (min-width: 200px) and (max-width: 300px) and (min-width: 100px) { .foo {} }",
        expected: "@media (min-width: 200px) and (max-width: 300px) { .foo {} }",
    },
    {
        name: "Update mq - width >=, width <=, width >=",
        input: "@media (width >= 200px) and (width <= 300px) and (width >= 100px) { .foo {} }",
        expected: "@media (width >= 200px) and (width <= 300px) { .foo {} }",
    },
    {
        name: "Remove mq - min-width greater than max-width",
        input: "@media (min-width: 200px) and (max-width: 100px) { .foo {} }",
        expected: "",
    },
    {
        name: "Remove mq - width >= greater than width <=",
        input: "@media (width >= 200px) and (width <= 100px) { .foo {} }",
        expected: "",
    },
    {
        name: "Remove mq - max-width x 2, min-width >= max-width",
        input: "@media (min-width: 200px) and (max-width: 300px) and (max-width: 100px) { .foo {} }",
        expected: "",
    },
    {
        name: "Remove mq - width <= x 2, width >= greater than width <=",
        input: "@media (width >= 200px) and (width <= 300px) and (width <= 100px) { .foo {} }",
        expected: "",
    },
    {
        name: "Normalize spaces around and in media queries",
        input: "@media not screen and(min-width: 200px)and (max-width: 300px) { .foo {} }",
        expected: "@media not screen and (min-width: 200px) and (max-width: 300px) { .foo {} }",
    },
];

testCases.forEach(({ name, input, expected }) => {
    test(name, function () {
        const optimized = postcss([mqoptimize()]).process(input).css;
        assert.strictEqual(optimized, expected);
    });
});

"use strict";

var fs = require("fs");
var path = require("path");
var postcss = require("postcss");
var mqoptimize = require("../index");

// Tests for Skip media queries

exports["Skip mq - and"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) { .foo {} }";
    var expected = "@media (min-width: 200px) and (max-width: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - and with range syntax"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px) { .foo {} }";
    var expected = "@media (width > 200px) and (width < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - only"] = function(test){
    var input    = "@media only screen and (min-width: 200px) and (max-width: 300px) { .foo {} }";
    var expected = "@media only screen and (min-width: 200px) and (max-width: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.equal(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - only with range syntax"] = function(test){
    var input    = "@media only screen and (width > 200px) and (width < 300px) { .foo {} }";
    var expected = "@media only screen and (width > 200px) and (width < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - not"] = function(test){
    var input    = "@media not screen and (min-width: 200px) and (max-width: 300px) { .foo {} }";
    var expected = "@media not screen and (min-width: 200px) and (max-width: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - not with range syntax"] = function(test){
    var input    = "@media not screen and (width > 200px) and (width < 300px) { .foo {} }";
    var expected = "@media not screen and (width > 200px) and (width < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - comma-seperated list & and"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }";
    var expected = "@media (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - comma-seperated list & and with range syntax"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px), (width < 200px) { .foo {} }";
    var expected = "@media (width > 200px) and (width < 300px), (width < 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - comma-seperated list & only"] = function(test){
    var input    = "@media only screen and (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }";
    var expected = "@media only screen and (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - comma-seperated list & only with range syntax"] = function(test){
    var input    = "@media only screen and (width > 200px) and (width < 300px), (width < 200px) { .foo {} }";
    var expected = "@media only screen and (width > 200px) and (width < 300px), (width < 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - comma-seperated list & not"] = function(test){
    var input    = "@media not screen and (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }";
    var expected = "@media not screen and (min-width: 200px) and (max-width: 300px), (max-width: 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - comma-seperated list & not with range syntax"] = function(test){
    var input    = "@media not screen and (width > 200px) and (width < 300px), (width < 200px) { .foo {} }";
    var expected = "@media not screen and (width > 200px) and (width < 300px), (width < 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};


exports["Skip mq - min-width & max-width"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 1024px) { .foo {} }";
    var expected = "@media (min-width: 200px) and (max-width: 1024px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - width > & width <"] = function(test){
    var input    = "@media (width > 200px) and (width < 1024px) { .foo {} }";
    var expected = "@media (width > 200px) and (width < 1024px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - max-width & orientation"] = function(test){
    var input    = "@media (max-width: 1024px) and (orientation: landscape) { .foo {} }";
    var expected = "@media (max-width: 1024px) and (orientation: landscape) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - width < & orientation"] = function(test){
    var input    = "@media (width < 1024px) and (orientation: landscape) { .foo {} }";
    var expected = "@media (width < 1024px) and (orientation: landscape) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - min-width, max-width & orientation"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 1024px) and (orientation: landscape) { .foo {} }";
    var expected = "@media (min-width: 200px) and (max-width: 1024px) and (orientation: landscape) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - width >, width < & orientation"] = function(test){
    var input    = "@media (width > 200px) and (width < 1024px) and (orientation: landscape) { .foo {} }";
    var expected = "@media (width > 200px) and (width < 1024px) and (orientation: landscape) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

// Tests for fix media queries

exports["Skip mq - min-width, max-width & no spaces"] = function(test){
    var input    = "@media (min-width: 200px)and(max-width: 1024px){ .foo {} }";
    var expected = "@media (min-width: 200px) and (max-width: 1024px){ .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Skip mq - width >, width < & no spaces"] = function(test){
    var input    = "@media (width > 200px)and(width < 1024px){ .foo {} }";
    var expected = "@media (width > 200px) and (width < 1024px){ .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

// Tests for update media queries

exports["Update mq - min-width x 2, same values"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) and (min-width: 200px) { .foo {} }";
    var expected = "@media (min-width: 200px) and (max-width: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - width > x 2, same values"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px) and (width > 200px) { .foo {} }";
    var expected = "@media (width > 200px) and (width < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - min-height x 2, same values"] = function(test){
    var input    = "@media (min-height: 200px) and (max-height: 300px) and (min-height: 200px) { .foo {} }";
    var expected = "@media (min-height: 200px) and (max-height: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - height > x 2, same values"] = function(test){
    var input    = "@media (height > 200px) and (height < 300px) and (height > 200px) { .foo {} }";
    var expected = "@media (height > 200px) and (height < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - min-width x 3, same values"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) and (min-width: 200px) and (min-width: 200px) { .foo {} }";
    var expected = "@media (min-width: 200px) and (max-width: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - width > x 3, same values"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px) and (width > 200px) and (width > 200px) { .foo {} }";
    var expected = "@media (width > 200px) and (width < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - min-width x 2, different values"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) and (min-width: 300px) { .foo {} }";
    var expected = "@media (min-width: 300px) and (max-width: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - width > x 2, different values"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px) and (width > 300px) { .foo {} }";
    var expected = "@media (width > 300px) and (width < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};


exports["Update mq - min-width x 2, max-height x 2, different values"] = function(test){
    var input    = "@media (min-width: 200px) and (max-height: 300px) and (min-width: 300px) and (max-height: 400px) { .foo {} }";
    var expected = "@media (min-width: 300px) and (max-height: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - width > x 2, height < x 2, different values"] = function(test){
    var input    = "@media (width > 200px) and (height < 300px) and (width > 300px) and (height < 400px) { .foo {} }";
    var expected = "@media (width > 300px) and (height < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - leave unknown features intact"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) and (dummy: dummyvalue) { .foo {} }";
    var expected = "@media (min-width: 200px) and (max-width: 300px) and (dummy: dummyvalue) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - leave unknown features intact with range syntax"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px) and (dummy: dummyvalue) { .foo {} }";
    var expected = "@media (width > 200px) and (width < 300px) and (dummy: dummyvalue) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - min-width x 2, different values, comma-seperated list"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) and (min-width: 300px), (min-width: 200px) { .foo {} }";
    var expected = "@media (min-width: 300px) and (max-width: 300px), (min-width: 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - width > x 2, different values, comma-seperated list"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px) and (width > 300px), (width > 200px) { .foo {} }";
    var expected = "@media (width > 300px) and (width < 300px), (width > 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - min-width > max-width, comma-seperated list"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 100px), (min-width: 200px) { .foo {} }";
    var expected = "@media (min-width: 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - width > greater than width <, comma-seperated list"] = function(test){
    var input    = "@media (width > 200px) and (width < 100px), (width > 200px) { .foo {} }";
    var expected = "@media (width > 200px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - min-width x 2, min-width == max-width"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) and (min-width: 300px) { .foo {} }";
    var expected = "@media (min-width: 300px) and (max-width: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - width > x 2, width > == width <"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px) and (width > 300px) { .foo {} }";
    var expected = "@media (width > 300px) and (width < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - min-width, max-width, min-width"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) and (min-width: 100px) { .foo {} }";
    var expected = "@media (min-width: 200px) and (max-width: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Update mq - width >, width <, width >"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px) and (width > 100px) { .foo {} }";
    var expected = "@media (width > 200px) and (width < 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

// Tests for removing media queries

exports["Remove mq - min-width greater than max-width"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 100px) { .foo {} }";
    var expected = "";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Remove mq - width > greater than width <"] = function(test){
    var input    = "@media (width > 200px) and (width < 100px) { .foo {} }";
    var expected = "";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Remove mq - max-width x 2, min-width > max-width"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) and (max-width: 100px) { .foo {} }";
    var expected = "";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

exports["Remove mq - width < x 2, width > greater than width <"] = function(test){
    var input    = "@media (width > 200px) and (width < 300px) and (width < 100px) { .foo {} }";
    var expected = "";
    var optimized = postcss([mqoptimize()]).process(input).css;

    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

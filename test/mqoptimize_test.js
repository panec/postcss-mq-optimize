"use strict";

var fs = require("fs");
var path = require("path");
var postcss = require("postcss");
var mqoptimize = require("../index");

// TODO Add more test combination:
// Logical operators: and, comma-seperated list, not, only
// Media features: width, height, orientation, ...

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

exports["Update mq - min-width x 2, min-widht == max-width"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 300px) and (min-width: 300px) { .foo {} }";
    var expected = "@media (min-width: 300px) and (max-width: 300px) { .foo {} }";
    var optimized = postcss([mqoptimize()]).process(input).css; 
        
    test.strictEqual(
        optimized,
        expected
    );

    test.done();
};

// Tests for removing media queries

exports["Remove mq - min-width > max-width"] = function(test){
    var input    = "@media (min-width: 200px) and (max-width: 100px) { .foo {} }";
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


"use strict";

var pkg = require("./package.json");
var postcss = require("postcss");

var MIN_MAX_FEATURES = ['width', 'height'];

var isSourceMapAnnotation = function (rule) {
    if (!rule) {
        return false;
    }

    if (rule.type !== "comment") {
        return false;
    }

    if (rule.text.toLowerCase().indexOf("# sourcemappingurl=") !== 0) {
        return false;
    }

    return true;
};

var parseQueryList = function (queryList) {
    var queries = [];
    postcss.list.comma(queryList).forEach(function (query) {
        var expressions = {};
        postcss.list.space(query).forEach(function (expression) {
            var feature;
            var value;
            expression = expression.toLowerCase();

            if (expression === "and") {
                return;
            }

            if (/^\w+$/.test(expression)) {
                expressions[expression] = true;

                return;
            }

            expression = postcss.list.split(expression.replace(/^\(|\)$/g, ""), [":"]);
            feature = expression[0];
            value = expression[1];

            if (!expressions[feature]) {
                expressions[feature] = [];
            }

            expressions[feature].push(value);
        });
        queries.push(expressions);
    });

    return queries;
};

var inspectLength = function (length) {
    var num;
    var unit;
    length = /(-?\d*\.?\d+)(ch|em|ex|px|rem)/.exec(length);

    if (!length) {
        return Number.NaN;
    }

    num = length[1];
    unit = length[2];

    switch (unit) {
        case "ch":
            num = parseFloat(num) * 8.8984375;
            break;
        case "em":
        case "rem":
            num = parseFloat(num) * 16;
            break;
        case "ex":
            num = parseFloat(num) * 8.296875;
            break;
        case "px":
            num = parseFloat(num);
            break;
    }

    return num;
};

var optimizeAtRuleParams = function (params) {

    var mapAtRuleParams = parseQueryList(params);
        
    return mapAtRuleParams
        .map(function (mqExpressions) {
            MIN_MAX_FEATURES.forEach(function(prop) {
                var minProp = 'min-' + prop;
                var maxProp = 'max-' + prop;

                if ( mqExpressions.hasOwnProperty(minProp) ) {
                    mqExpressions[minProp] = mqExpressions[minProp].reduce(function (a, b) {
                        return ( inspectLength(a) > inspectLength(b) ) ? a : b;
                    });
                }

                if ( mqExpressions.hasOwnProperty(maxProp) ) {
                    mqExpressions[maxProp] = mqExpressions[maxProp].reduce(function (a, b) {
                        return ( inspectLength(a) < inspectLength(b) ) ? a : b;
                    });
                }
            });
            return mqExpressions;
        }).filter(function ( e ) {
            return ( !!e['min-width'] && !!e['max-width'] ? inspectLength(e['min-width']) <= inspectLength(e['max-width']) : true );
        }).map( function( e ) {
            var array = [];
            var special = undefined; // enum special { not, only }
            
            for (var prop in e) {
                if ( prop === 'not' || prop === 'only' ) {
                    special = prop;
                }
                else {
                    switch (typeof e[prop]) {
                        case 'string':
                            array.push('(' + prop + ': ' + e[prop] + ')');
                            break;
                        case 'object':
                            // Handle unrecognized properties.
                            array.push('(' + prop + ': ' + e[prop][0] + ')');
                            break;
                        default:
                            // Handle specials
                            array.push(prop);
                    }
                }
            }
            return ( !!special ? special + ' ' : '' ) + array.join(' and ');
        })
        .join(', ');
}

module.exports = postcss.plugin(pkg.name, function (opts) {
    opts = opts || {};

    return function (css, result) { var sourceMap = css.last;
        if (!isSourceMapAnnotation(sourceMap)) {
            sourceMap = null;
        }

        css.walkAtRules("media", function (atRule) {
            atRule.params = optimizeAtRuleParams(atRule.params);
            
            if ( atRule.params == "" ) {
                atRule.remove();
            }
        });

        if (sourceMap) {
            sourceMap.moveTo(css);
        }

        return css;
    };
});

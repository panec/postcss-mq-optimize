"use strict";

const pkg = require("./package.json");

const MIN_MAX_FEATURES = ["width", "height"];

const parseQueryList = function (queryList, list) {
    const queries = [];

    list.comma(queryList).forEach(function (query) {
        query = query.replace("and", " and ");
        const expressions = {};

        list.space(query).forEach(function (expression) {
            let feature;
            let value;

            expression = expression.toLowerCase();

            if (expression === "and") {
                return;
            }

            if (/^\w+$/.test(expression)) {
                expressions[expression] = true;

                return;
            }

            expression = list.split(
                expression.replace(/^\(|\)$/g, ""),
                [":"]
            );

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

const inspectLength = function (length) {
    let num;
    let unit;

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

const optimizeAtRuleParams = function (params, list) {
    const mapAtRuleParams = parseQueryList(params, list);

    return mapAtRuleParams
        .map(function (mqExpressions) {
            MIN_MAX_FEATURES.forEach(function (prop) {
                const minProp = "min-" + prop;
                const maxProp = "max-" + prop;

                if (mqExpressions.hasOwnProperty(minProp)) {
                    mqExpressions[minProp] = mqExpressions[minProp].reduce(
                        function (a, b) {
                            return inspectLength(a) > inspectLength(b) ? a : b;
                        }
                    );
                }

                if (mqExpressions.hasOwnProperty(maxProp)) {
                    mqExpressions[maxProp] = mqExpressions[maxProp].reduce(
                        function (a, b) {
                            return inspectLength(a) < inspectLength(b) ? a : b;
                        }
                    );
                }
            });
            return mqExpressions;
        })
        .filter(function (e) {
            return !!e["min-width"] && !!e["max-width"]
                ? inspectLength(e["min-width"]) <= inspectLength(e["max-width"])
                : true;
        })
        .map(function (e) {
            const array = [];

            let special = undefined; // enum special { not, only }

            for (let prop in e) {
                if (prop === "not" || prop === "only") {
                    special = prop;
                } else {
                    switch (typeof e[prop]) {
                        case "string":
                            array.push("(" + prop + ": " + e[prop] + ")");
                            break;
                        case "object":
                            // Handle unrecognized properties.
                            array.push("(" + prop + ": " + e[prop][0] + ")");
                            break;
                        default:
                            // Handle specials
                            array.push(prop);
                    }
                }
            }
            return (!!special ? special + " " : "") + array.join(" and ");
        })
        .join(", ");
};

const plugin = (opts = {}) => {
    return {
        postcssPlugin: pkg.name,
        AtRule(atRule, { list }) {
            if (atRule.name === "media") {
                atRule.params = optimizeAtRuleParams(atRule.params, list);
                if (atRule.params == "") {
                    atRule.remove();
                }
            }
        },
    };
};

plugin.postcss = true;

module.exports = plugin;

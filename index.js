"use strict";

const pkg = require("./package.json");
const SIZE_FEATURES = ["width", "height"];

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

const parseQueryList = function (queryList, list) {
    const queries = [];

    list.comma(queryList).forEach(function (query) {
        query = query
            .replace(/\)\s*and\s*\(/gi, ") and (")
            .replace(/\)\s*and\b/gi, ") and")
            .replace(/\band\s*\(/gi, "and (");
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

            // Remove surrounding parentheses
            const cleanedExpression = expression.replace(/^\(|\)$/g, "");

            // Check for range syntax first (>=, <=, >, <)
            const rangeMatch = cleanedExpression.match(/^(\w+)\s*(>=|<=|>|<)\s*(.+)$/);
            if (rangeMatch) {
                const [, property, operator, val] = rangeMatch;

                feature = `${property} ${operator}`;
                value = val.trim();
            } else {
                expression = list.split(cleanedExpression, [":"]);
                feature = expression[0];
                value = expression[1];
            }

            if (!expressions[feature]) {
                expressions[feature] = [];
            }

            expressions[feature].push(value);
        });
        queries.push(expressions);
    });

    return queries;
};


const optimizeAtRuleParams = function (params, list) {
    const mapAtRuleParams = parseQueryList(params, list);

    return mapAtRuleParams
        .map(function (mqExpressions) {
            SIZE_FEATURES.forEach(function (prop) {
                const minProp = "min-" + prop;
                const maxProp = "max-" + prop;
                const rangeMinProp = prop + " >=";
                const rangeMaxProp = prop + " <=";
                const rangeMinStrictProp = prop + " >";
                const rangeMaxStrictProp = prop + " <";

                // Handle range syntax min-* properties
                if (mqExpressions.hasOwnProperty(minProp)) {
                    mqExpressions[minProp] = mqExpressions[minProp].reduce(
                        function (a, b) {
                            return inspectLength(a) > inspectLength(b) ? a : b;
                        }
                    );
                }

                // Handle range syntax max-* properties
                if (mqExpressions.hasOwnProperty(maxProp)) {
                    mqExpressions[maxProp] = mqExpressions[maxProp].reduce(
                        function (a, b) {
                            return inspectLength(a) < inspectLength(b) ? a : b;
                        }
                    );
                }

                // Handle range syntax >= properties
                if (mqExpressions.hasOwnProperty(rangeMinProp)) {
                    mqExpressions[rangeMinProp] = mqExpressions[rangeMinProp].reduce(
                        function (a, b) {
                            return inspectLength(a) > inspectLength(b) ? a : b;
                        }
                    );
                }

                // Handle range syntax <= properties
                if (mqExpressions.hasOwnProperty(rangeMaxProp)) {
                    mqExpressions[rangeMaxProp] = mqExpressions[rangeMaxProp].reduce(
                        function (a, b) {
                            return inspectLength(a) < inspectLength(b) ? a : b;
                        }
                    );
                }

                // Handle range syntax > properties
                if (mqExpressions.hasOwnProperty(rangeMinStrictProp)) {
                    mqExpressions[rangeMinStrictProp] = mqExpressions[rangeMinStrictProp].reduce(
                        function (a, b) {
                            return inspectLength(a) > inspectLength(b) ? a : b;
                        }
                    );
                }

                // Handle range syntax < properties
                if (mqExpressions.hasOwnProperty(rangeMaxStrictProp)) {
                    mqExpressions[rangeMaxStrictProp] = mqExpressions[rangeMaxStrictProp].reduce(
                        function (a, b) {
                            return inspectLength(a) < inspectLength(b) ? a : b;
                        }
                    );
                }
            });
            return mqExpressions;
        })
        .filter(function (e) {
            if (!!e["min-width"] && !!e["max-width"]) {
                if (inspectLength(e["min-width"]) > inspectLength(e["max-width"])) {
                    return false;
                }
            }

            if (!!e["width >="] && !!e["width <="]) {
                if (inspectLength(e["width >="]) > inspectLength(e["width <="])) {
                    return false;
                }
            }

            if (!!e["width >"] && !!e["width <"]) {
                if (inspectLength(e["width >"]) >= inspectLength(e["width <"])) {
                    return false;
                }
            }

            if (!!e["height >="] && !!e["height <="]) {
                if (inspectLength(e["height >="]) > inspectLength(e["height <="])) {
                    return false;
                }
            }

            if (!!e["height >"] && !!e["height <"]) {
                if (inspectLength(e["height >"]) >= inspectLength(e["height <"])) {
                    return false;
                }
            }

            return true;
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
                            if (prop.includes(" >=") || prop.includes(" <=") ||
                                prop.includes(" >") || prop.includes(" <")) {
                                array.push("(" + prop + " " + e[prop] + ")");
                            } else {
                                array.push("(" + prop + ": " + e[prop] + ")");
                            }
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

const conditions = [
    {
        rules: [
            {
                operator: 'and', // the operator to be used with the next rule
                value: true,
                rule: 'equalTo',
                location: true
            },
            // {
            //     value: 5,
            //     rule: 'greaterThan',
            //     location: 3
            // }
        ],
        result: 'asdf' // this is what the conjunction of the rules should return if all rules are met
    },
    // {
    //     rules: [
    //         {
    //             operator: 'or',
    //             value: 10,
    //             rule: 'lessThan',
    //             location: 20
    //         },
    //         {
    //             value: 9,
    //             rule: 'greaterThan',
    //             location: 10
    //         }
    //     ],
    //     result: 'qwerty'
    // }
];

// Define rule functions
const ruleFunctions = {
    equalTo: (location, value) => location === value,
    greaterThan: (location, value) => location > value,
    lessThan: (location, value) => location < value,
    // Add more rule functions as needed
};

// Function to evaluate a single condition
function evaluateCondition(condition) {
    let overallResult = null;

    const { rules, result } = condition;

    for (let i = 0; i < rules.length; i++) {
        const { value, rule, location, operator } = rules[i];

        // Evaluate the rule
        const ruleFunction = ruleFunctions[rule];
        if (!ruleFunction) {
            throw new Error(`Unknown rule: ${rule}`);
        }
        const ruleResult = ruleFunction(location, value);

        if (i === 0) {
            // Initialize overallResult with the first rule's result
            overallResult = ruleResult;
        } else {
            // Apply the previous operator with the previous overallResult
            const prevOperator = rules[i - 1].operator;
            if (prevOperator === 'and') {
                overallResult = overallResult && ruleResult;
            } else if (prevOperator === 'or') {
                overallResult = overallResult || ruleResult;
            } else {
                throw new Error(`Unknown operator: ${prevOperator}`);
            }
        }
    }

    return overallResult ? result : null;
}

// Function to evaluate all conditions
function evaluateConditions(conditions) {
    for (const condition of conditions) {
        const conditionResult = evaluateCondition(condition);
        if (conditionResult) {
            return conditionResult;
        }
    }
    return null;
}

// Example usage
const result = evaluateConditions(conditions);
console.log(result); // Output will be 'asdf' or 'qwerty' based on the evaluation of conditions

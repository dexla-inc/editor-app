function evaluateConditions(conditions) {
    function equalTo(a, b) {
        return a === b;
    }

    function greaterThan(a, b) {
        return a > b;
    }

    function lessThan(a, b) {
        return a < b;
    }

    // Add other rule functions here if needed

    let finalResult = null;
    let evaluation = true;

    for (let i = 0; i < conditions.length; i++) {
        const { operator, value, rule, location, result } = conditions[i];

        let currentEvaluation;
        switch (rule) {
            case 'equalTo':
                currentEvaluation = equalTo(value, location);
                break;
            case 'greaterThan':
                currentEvaluation = greaterThan(value, location);
                break;
            case 'lessThan':
                currentEvaluation = lessThan(value, location);
                break;
            // Add cases for other rules here
            default:
                throw new Error(`Unknown rule: ${rule}`);
        }

        if (i === 0) {
            evaluation = currentEvaluation;
            finalResult = currentEvaluation ? result : finalResult;
        } else {
            if (operator === 'or') {
                evaluation = evaluation || currentEvaluation;
            } else if (operator === 'and') {
                evaluation = evaluation && currentEvaluation;
            } else {
                throw new Error(`Unknown operator: ${operator}`);
            }

            if (evaluation && operator === 'or') {
                finalResult = result;
            } else if (evaluation && operator === 'and' && !finalResult) {
                finalResult = result;
            }
        }

        if (evaluation) {
            return finalResult;
        }
    }

    return finalResult;
}

// Example usage
const conditions = [
    {
        operator: 'and',
        value: false,
        rule: 'equalTo',
        location: true,
        result: 'Condition 1 met'
    },
    {
        operator: 'and',
        value: 5,
        rule: 'greaterThan',
        location: 3,
        result: 'Condition 2 met'
    },
    {
        operator: 'and',
        value: 'hello',
        rule: 'equalTo',
        location: 'hello',
        result: 'Condition 3 met'
    },
    {
        operator: 'and',
        value: false,
        rule: 'equalTo',
        location: false,
        result: 'Condition 4 met'
    },
    {
        operator: 'and',
        value: 10,
        rule: 'lessThan',
        location: 15,
        result: 'Condition 5 met'
    }
];

const result = evaluateConditions(conditions);
console.log(result); // Expected output: 'Condition 5 met'

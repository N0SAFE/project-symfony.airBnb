let baseRule = { minLength: 3, maxLength: 20, min: 3, max: 20, minDate: "now", maxDate: "now", value: 0, array: [] };
export default (type, value, rule = baseRule) => {
    switch (type) {
        case 'required':
            return value !== '';
        case 'minLength':
            return value.length >= rule.length;
        case 'maxLength':
            return value.length <= rule.length;
        case 'min':
            return value >= rule.min;
        case 'max':
            return value <= rule.max;
        case 'minDate':
            return new Date(value) >= new Date(rule.minDate);
        case 'maxDate':
            return new Date(value) <= new Date(rule.maxDate);
        case 'regex':
            return rule.regex.test(value);
        case 'custom':
            return rule.validator(value);
        case 'equalTo':
            return value === rule.value;
        case 'notEqualTo':
            return value !== rule.value;
        case 'contains':
            return rule.array.indexOf(value) > -1;
        case 'notContains':
            return rule.array.indexOf(value) === -1;
        case 'unique':
            return rule.array.indexOf(value) === -1;
        case 'uniqueIn':
            return rule.array.indexOf(value) === -1;
        case 'uniqueInCollection':
            return rule.array.indexOf(value) === -1;
        case 'uniqueInObject':
            return rule.array.indexOf(value) === -1;
        case 'uniqueInArray':
            return rule.array.indexOf(value) === -1;

        default:
            return false;
    }
}
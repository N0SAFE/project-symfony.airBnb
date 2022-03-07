export default (type, value) => {
    switch (type) {
        case 'email':
            return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
        case 'phone':
            return /^\d{3}-\d{3}-\d{4}$/.test(value);
        case 'password':
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/.test(value);
        case 'name':
            return /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(value);
        case 'zip':
            return /^\d{5}(?:[-\s]\d{4})?$/.test(value);
        case 'number':
            return /^\d+$/.test(value);
        case 'date':
            return /^\d{4}-\d{2}-\d{2}$/.test(value);
        case 'time':
            return /^\d{2}:\d{2}:\d{2}$/.test(value);
        case 'datetime':
            return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value);
        case 'ip':
            return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
        case 'ipv6':
            return /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/.test(value);
        case 'color':
            return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(value);
        case 'hex':
            return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(value);
        case 'rgba':
            return /^rgba\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)$/.test(value);
        case 'rgb':
            return /^rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)$/.test(value);
        case 'hsl':
            return /^hsl\((\d{1,3}),\s?(\d{1,3})%,\s?(\d{1,3})%\)$/.test(value);
        case 'hsla':
            return /^hsla\((\d{1,3}),\s?(\d{1,3})%,\s?(\d{1,3})%,\s?(\d{1,3})\)$/.test(value);
        case 'creditcard':
            return /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(value);
        case 'isbn':
            return /^(?:(?:97(?:8|9))?\s?(?:\d)\s?)?(?:\d{9}(?:[\s-]\d{3})?(?:[\s-]\d{3})?\s?\d|\d[-\s]*\d[-\s]*\d[-\s]*\d|\d{3}[-\s]*\d{5})$/.test(value);
        case 'isbn10':
            return /^(?:[0-9]{9}X|[0-9]{10})$/.test(value);
        case 'isbn13':
            return /^(?:(?:97(?:8|9))?[0-9]{12})$/.test(value);
        case 'uuid':
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
        case 'base64':
            return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(value);
        case 'base64url':
            return /^(?:[A-Za-z0-9-_]{4})*(?:[A-Za-z0-9-_]{2}==|[A-Za-z0-9-_]{3}=|[A-Za-z0-9-_]{4})$/.test(value);
        case 'dataUri':
            return /^data:((.*?)(;charset=[\w-]+|;charset=(\w+)|)|(.*?));base64,(([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$)/i.test(value);
        case 'latitude':
            return /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(value);
        case 'longitude':
            return /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(value);
        case 'postalCode':
            return /^[A-Za-z0-9 -]{3,10}$/.test(value);
    }
}
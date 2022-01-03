// test
export const unzip = function(array) {
    let length = array.length,
        result = [],
        index = 0,
        resIndex = 0;

    while (index < length) {
        result[resIndex++] = array[index++];
        result[resIndex++] = array[index++];
    }
    return result;
}

// test
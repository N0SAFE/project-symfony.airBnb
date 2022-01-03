export default class {
    static array_unique(array) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return [...new Set(array)]
    }

    static array_intersect(array1, array2) {
        // verify if the array is a array
        if (!Array.isArray(array1) || !Array.isArray(array2)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return array1.filter(value => array2.includes(value))
    }

    static array_diff(array1, array2) {
        // verify if the array is a array
        if (!Array.isArray(array1) || !Array.isArray(array2)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return array1.filter(value => !array2.includes(value))
    }

    static array_merge(array1, array2) {
        // verify if the array is a array
        if (!Array.isArray(array1) || !Array.isArray(array2)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return [...array1, ...array2]
    }

    static array_flatten(array) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return array.reduce((acc, cur) => {
            if (Array.isArray(cur)) {
                return acc.concat(array_flatten(cur))
            } else {
                return acc.concat(cur)
            }
        }, [])
    }

    static array_chunk(array, size) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if the size is a number
        if (typeof size !== "number") {
            console.error("the size must be a number")
            return false
        }

        // process
        return array.reduce((acc, cur, index) => {
            if (index % size === 0) {
                acc.push([cur])
            } else {
                acc[acc.length - 1].push(cur)
            }
            return acc
        }, [])
    }

    static array_column(array, column) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if the column is a number
        if (typeof column !== "number") {
            console.error("the column must be a number")
            return false
        }

        // process
        return array.map(value => value[column])

    }

    static array_pad(array, size, value) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if the size is a number
        if (typeof size !== "number") {
            console.error("the size must be a number")
            return false
        }

        // process
        if (size > 0) {
            return [...array, ...Array(size).fill(value)]
        } else {
            return [...Array(Math.abs(size)).fill(value), ...array]
        }
    }

    static array_replace(array, search, replace) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return array.map(value => value === search ? replace : value)
    }

    static array_reverse(array) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return array.reverse()
    }

    static array_slice(array, start, end) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if the start is a number
        if (typeof start !== "number") {
            console.error("the start must be a number")
            return false
        }

        // verify if the end is a number
        if (typeof end !== "number") {
            console.error("the end must be a number")
            return false
        }

        // process
        return array.slice(start, end)
    }

    static array_splice(array, start, deleteCount, ...items) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if the start is a number
        if (typeof start !== "number") {
            console.error("the start must be a number")
            return false
        }

        // verify if the deleteCount is a number
        if (typeof deleteCount !== "number") {
            console.error("the deleteCount must be a number")
            return false
        }

        // process
        return array.splice(start, deleteCount, ...items)
    }

    static array_some_of_content(array, callback) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if the callback is a function
        if (typeof callback !== "function") {
            console.error("the callback must be a function")
            return false
        }

        // process
        return array.some(callback)
    }

    static array_sum(array) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if array is just of numbers
        if (array.some(value => typeof value !== "number")) {
            console.error("the array must be just of number")
            return false
        }

        // process
        return array.reduce((acc, cur) => acc + cur, 0)
    }

    static array_unique_key(array) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return [...new Set(array.map(value => JSON.stringify(value)))].map(value => JSON.parse(value))
    }

    static array_unique_value(array) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return [...new Set(array)]
    }

    static array_unique(array) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return array_unique_key(array)
    }

    static array_values(array) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // process
        return Object.values(array)
    }

    static array_walk(array, callback) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if the callback is a function
        if (typeof callback !== "function") {
            console.error("the callback must be a function")
            return false
        }

        // process
        array.forEach(value => callback(value))
    }

    static array_walk_recursive(array, callback, ...args) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if the callback is a function
        if (typeof callback !== "function") {
            console.error("the callback must be a function")
            return false
        }

        // process
        array.forEach(value => {
            if (Array.isArray(value)) {
                array_walk_recursive(value, callback)
            } else {
                callback(...args)
            }
        })
    }

    static isInArray(toTest, ...args) {
        // verify if the args is a array
        if (!Array.isArray(args)) {
            args = [args]
        }

        for (let arg of args) {
            if (toTest === arg)
                return true
        }
        return false
    }

    static isEqual(array, arrayToCompare) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the first argument must be the type of array")
            return false;
        }

        // verify if the array to compare is a array
        if (!Array.isArray(arrayToCompare)) {
            console.error("the second argument must be the type of array")
            return false;
        }

        // verify if the array length is equal
        if (array.length !== arrayToCompare.length) {
            return false;
        }

        // verify if the array is equal
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== arrayToCompare[i]) {
                return false;
            }
        }

        return true;
    }

    static countOccurrences(array, element) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the first argument must be the type of array")
            return false
        }

        // verify if the element is a number
        if (typeof element !== "number") {
            console.error("the second argument must be the type of number")
            return false
        }

        let count = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] === element) {
                count++;
            }
        }

        return count;
    }

    static getDuplicates(array) {
        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the first argument must be the type of array")
            return false
        }

        let duplicates = [];

        for (let i = 0; i < array.length; i++) {
            let element = array[i];
            let index = array.indexOf(element);

            if (index !== -1 && index !== i) {
                duplicates.push(element);
            }
        }
        return duplicates;
    }

    static arraySort(array, sortWith = "radix", sortType = "asc") {
        const radixSort = arr => {
            const getNum = (num, index) => {
                const strNum = String(num);
                let end = strNum.length - 1;
                const foundNum = strNum[end - index];

                if (foundNum === undefined) return 0;
                else return foundNum;
            };

            const largestNum = arr => {
                let largest = "0";

                arr.forEach(num => {
                    const strNum = String(num);

                    if (strNum.length > largest.length) largest = strNum;
                });

                return largest.length;
            };
            let maxLength = largestNum(arr);

            for (let i = 0; i < maxLength; i++) {
                let buckets = Array.from({ length: 10 }, () => []);

                for (let j = 0; j < arr.length; j++) {
                    let num = getNum(arr[j], i);

                    if (num !== undefined) buckets[num].push(arr[j]);
                };
                arr = buckets.flat();
            };
            return arr;
        };

        const bubbleSort = (inputArr) => {
            let len = inputArr.length;
            let swapped;
            do {
                swapped = false;
                for (let i = 0; i < len; i++) {
                    if (inputArr[i] > inputArr[i + 1]) {
                        let tmp = inputArr[i];
                        inputArr[i] = inputArr[i + 1];
                        inputArr[i + 1] = tmp;
                        swapped = true;
                    }
                }
            } while (swapped);
            return inputArr;
        };

        // verify if the array is a array
        if (!Array.isArray(array)) {
            console.error("the argument must be the type of array")
            return false
        }

        // verify if the sort type is a string
        if (typeof sortType !== "string") {
            console.error("the sort type must be a string")
            return false
        }

        // verify if the sort type is a string
        if (typeof sortWith !== "string") {
            console.error("the sort with must be a string")
            return false
        }

        // create associative array between the sort type and the function
        let association = {
            "radix": radixSort,
            "bubble": bubbleSort
        }

        // verify if the sort with is a function
        if (typeof association[sortWith] !== "function") {
            console.error("the sort with must be a function")
            return false
        }

        // process
        if (association[sortWith] != undefined) {
            if (sortType === "asc") {
                return association[sortWith](array)
            } else if (sortType === "desc") {
                return association[sortWith](array).reverse()
            } else {
                console.error("the sort type must be asc or desc")
                return false
            }
        } else {
            console.error("the sort with must be radix or bubble")
            return false
        }
    }

    /**
     *  info: require parameters of type array, first = Array<string>, ?seconde = Array<any>
     *  args start:
     *  arg         1: {array aruments of type array with the string to count}
     *  arg         ?2:{arrayAssosiateObject of type array with object associate on the first array}
     *  args end
     *  utility: add a double array in a and detect it (a = [[htmlelement.tagName], [HTMLelement]]) return the htmlelement but compare the HTMLelement.tagName
     *  template cout_duplicate(array:Array<...string>, ?arrayAssociateObject:Array<...Object>>)
     *  return Array<Object<...count:int>> || Array<Object<...Object<coutn:int, associatedObject:Object<>>>>
     */
    static count_duplicate(array, arrayAssociateObject = undefined) {
        let counts = {}

        // check if have a array for associate object
        if (arrayAssociateObject != undefined) {
            // verify
            if (!Array.isArray(array) || !Array.isArray(arrayAssociateObject)) {
                console.error("the two arguments must be the type of array")
                return false;
            } else if (array.length != arrayAssociateObject.length) {
                console.error("the two arguments array must have the same length")
                return false
            }


            // loop
            // process
            for (let i = 0; i < array.length; i++) {
                if (counts[array[i]]) {
                    counts[array[i]]["count"] += 1
                } else {
                    counts[array[i]] = { count: 1, associate: arrayAssociateObject[i] }
                }
            }
        } else {
            // verify
            if (!Array.isArray(array)) {
                console.error("the argument must be the type of array")
                return false
            }
            // process
            for (let i = 0; i < array.length; i++) {
                if (counts[array[i]]) {
                    counts[array[i]] += 1
                } else {
                    counts[array[i]] = 1
                }
            }
        }
        return counts
    }
}
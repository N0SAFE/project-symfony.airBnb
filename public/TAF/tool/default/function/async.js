/**
 *  args start
 *  arg         1: <promise>:Promise (promise to set the timeout)
 *  arg         1: <ms>:int (timeout of the promise)
 *  args end
 *  utility: this function can create a timeout for a specifique promise
 *  example start
 *  
 *  exam    let windPromise = await promiseTimeout(aPromise, 100)
 *  exam    ? return <aPromise> if the promise is resolved in under 100 milliseconds else return undefined
 *  
 *  example end
 *  return a promise with the race of <promise> and new promise with resolved in 100 milliseconds
 *  end: if the timeout expire this promise resolve with an undefined else resolve the current <promise> promise 
 */
export const promiseTimeout = function(promise, ms) {

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms. on : ' + this)
        }, ms)
    })

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ])
}

/*
    args start
    arg        1: <time>:int (time in ms for the time sleep)
    args end
    utility: this function can create a sleep for a specifique time
    example start

    exam    await sleep(100)

    example end
    require: use await to call the function
    return a promise who self resolved after <time> in milliseconds
*/
export const sleep = async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
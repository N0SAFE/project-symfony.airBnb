export default new(class HTTP {
    status = Object.entries({
        continue: 100,
        switchingProtocols: 101,
        processing: 102,
        earlyHints: 103,
        ok: 200,
        created: 201,
        accepted: 202,
        nonAuthoritativeInformation: 203,
        noContent: 204,
        resetContent: 205,
        partialContent: 206,
        mutliStatus: 207,
        alreadyReported: 208,
        contentDifferent: 210,
        imUsed: 226,
        multipleChoices: 300,
        movedPermanently: 301,
        found: 302,
        seeOther: 303,
        notModified: 304,
        useProxy: 305,
        switchProxy: 306,
        temporaryRedirect: 307,
        permanentRedirect: 308,
        tooManyRedirect: 310,
        badRequest: 400,
        unauthorized: 401,
        paymentRequired: 402,
        forbidden: 403,
        notFound: 404,
        methodNotAllowed: 405,
        notAcceptable: 406,
        prroxyAuthentificationRequired: 407,
        requestTimeout: 408,
        conflict: 409,
        gone: 410,
        lengthRequired: 411,
        preconditionFailed: 412,
        requestEntityTooLarge: 413,
        requireUriTooLong: 414,
        unsupportedMediaType: 415,
        requestedRangeUnsatisfiable: 416,
        expectationFailed: 417,
        imATeapot: 418,
        badMapping: 421,
        misdirectedRequest: 421,
        unprocessableEntity: 422,
        locked: 423,
        methodFailure: 424,
        tooEarly: 425,
        upgradeRequired: 426,
        preconditionRequired: 428,
        tooManyRequest: 429,
        requestHeaderFieldTooLarge: 431,
        retryWith: 449,
        blockedByWindowsParentalControls: 450,
        unavailableForLegalReasons: 451,
        unrecoverableError: 456,
        noResponse: 444,
        sslCertificateError: 495,
        sslCertificateRequired: 496,
        httpRequestSentToHttpsPort: 497,
        tokenExpired: 498,
        tokenInvalid: 498,
        clientClosedRequest: 499,
        internalServerError: 500,
        notImplemented: 501,
        badGetaway: 502,
        proxyError: 502,
        serviceUnavailable: 503,
        gatewayTimeout: 504,
        httpVersionNotSupported: 505,
        variantAlsoNegotiates: 506,
        insufficientStorage: 507,
        loopDetected: 508,
        bandwidthLimitExceeded: 509,
        notExtended: 510,
        networkAuthentificationRequired: 511,
        unknownError: 520,
        webServerIsDown: 521,
        connectionTimedOut: 522,
        originIsUnreachable: 523,
        aTimeoutOccured: 524,
        sslHandshakeFailed: 525,
        invalidSslCertificate: 526,
        railgunError: 527
    }).reduce((acc, [key, val]) => {
        acc[key] = val;
        acc[val] = key
        return acc
    })

    getCode(str) {
        if (typeof str !== "string") {
            throw new Error("the argument must be of type string")
        }
        return this.status[Object.keys(this.status).find((val) => {
            if (typeof val !== "string") {
                return false
            }
            return val.toLowerCase() == str.toLowerCase().replace(/\s+/g, '').trim()
        })]
    }

})
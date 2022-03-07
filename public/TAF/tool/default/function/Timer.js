// util
export class TimerTimeout {
    constructor(callback, delay, ...args) {
        this.selfID = new Date()
        this.args = args;
        this.callback = callback;
        this.remaining = delay;
        this.this = this
        this.start()
    }
    setObj(obj) { this.this = obj }
    start() {
        this.running = true
        this.started = new Date()
        this.id = setTimeout(this.callback, this.remaining, ...this.args)
    }
    reload() {
        this.stop()
        this.remaining = this.delay
        this.start()
    }
    pause() {
        this.running = false
        clearTimeout(this.id)
        this.remaining -= new Date() - this.started
    }
    stop() {
        this.running = false;
        clearTimeout(this.id)
        delete this.this;
    }
    getTimeLeft() {
        if (this.running) {
            this.pause()
            this.start()
        }
        return this.remaining
    }
    getStateRunning() {
        return this.running
    }
}
export class TimerInfinityReapeter extends TimerTimeout {
    constructor(callback, delay, ...args) {
        super(callback, delay, ...args)
        this.delay = delay
        this.start()
    }
    start(THIS = this) {
        THIS.running = true
        THIS.started = new Date()
        THIS.id = setTimeout(THIS.loop, THIS.remaining, THIS)
    }
    loop(THIS) {
        if (THIS.running == true) {
            THIS.callback(...THIS.args)
            THIS.stop()
            THIS.remaining = THIS.delay
            THIS.start(THIS)
        }
    }
}
export class TimerInfinityReapeterInstant extends TimerInfinityReapeter {
    constructor(callback, delay, ...args) {
        super(callback, delay, ...args)
        this.callback(...args)
    }
}
export class TimerReapeter extends TimerTimeout {
    constructor(callback, delay, numberOfLoop, ...args) {
        super(callback, delay, ...args)
        this.delay = delay
        this.numberOfLoop = numberOfLoop
        this.selfNumberOfLoop = 0
        this.start()
    }
    start(THIS = this) {
        this.running = true
        this.started = new Date()
        this.id = setTimeout(this.loop, this.remaining, THIS)
    }
    loop(THIS) {
        THIS.callback(...THIS.args)
        THIS.stop()
        THIS.remaining = THIS.delay
        if (THIS.selfNumberOfLoop < THIS.numberOfLoop - 1) {
            THIS.start(THIS)
        }
        THIS.selfNumberOfLoop++;
    }
}
export class TimerReapeaterWithFunctionAfter extends TimerReapeter {
    constructor(callback, delay, numberOfLoop, ...args) {
        super(callback, delay, numberOfLoop, ...args)
    }
    loop(THIS) {
        THIS.callback(...THIS.args)
        THIS.stop()
        THIS.remaining = THIS.delay
        if (THIS.selfNumberOfLoop < THIS.numberOfLoop - 1) {
            THIS.start(THIS)
        } else {
            THIS.function(...this.functionArgs)
        }
        THIS.selfNumberOfLoop++;
    }
    setFunction(Function, ...args) {
        this.function = Function
        this.functionArgs = args
    }
}
export class TimerReapeterInstant extends TimerReapeter {
    constructor(callback, delay, numberOfLoop, ...args) {
        super(callback, delay, numberOfLoop, ...args)
        this.callback(...args)
        this.selfNumberOfLoop++;
    }
}
export class TimerReapeaterInstantWithFunctionAfter extends TimerReapeterInstant {
    constructor(callback, delay, numberOfLoop, ...args) {
        super(callback, delay, numberOfLoop, ...args)
    }
    loop(THIS) {
        THIS.callback(...THIS.args)
        THIS.stop()
        THIS.remaining = THIS.delay
        if (THIS.selfNumberOfLoop < THIS.numberOfLoop - 1) {
            THIS.start(THIS)
        } else {
            THIS.function(...THIS.functionArgs)
        }
        THIS.selfNumberOfLoop++;
    }
    setFunction(Function, ...args) {
        this.function = Function
        this.functionArgs = args
    }
}
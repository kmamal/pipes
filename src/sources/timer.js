const { Node, SYM } = require('../node')

class TimerNode extends Node {
	constructor (timeout, interval = null) {
		super()

		this._timeout = timeout
		this._interval = interval
		this._timeoutId = null
		this._intervalId = null
		this._counter = 0
	}

	[SYM.kOpenHook] () {
		this._timeoutId = setTimeout(() => {
			this.write([ this._counter++ ])
			this._intervalId = setInterval(() => {
				this.write([ this._counter++ ])
			}, this._interval)
		}, this._timeout)
	}

	[SYM.kCloseHook] () {
		if (this._timeoutId) {
			clearTimeout(this._timeoutId)
			this._timeoutId = null
		}
		if (this._intervalId) {
			clearInterval(this._intervalId)
			this._intervalId = null
		}
		this._counter = 0
	}
}

const timer = (timeout, interval) => new TimerNode(timeout, interval)

module.exports = {
	TimerNode,
	timer,
}

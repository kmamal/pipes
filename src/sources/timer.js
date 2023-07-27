const { Node, SYM } = require('../node')

class TimerSourceNode extends Node {
	constructor (timeout, interval = null) {
		super()

		this._timeout = timeout
		this._interval = interval
		this._timeoutId = null
		this._counter = 0
	}

	_scheduleAt (time) {
		const remaining = time - Date.now()
		this._timeoutId = setTimeout(async () => {
			await this.write([ this._counter++ ])
			this._scheduleAt(time + this._interval)
		}, remaining)
	}

	[SYM.kOpenHook] () {
		this._scheduleAt(Date.now() + this._timeout)
	}

	[SYM.kCloseHook] () {
		clearTimeout(this._timeoutId)
		this._timeoutId = null
		this._counter = 0
	}
}

const timer = (timeout, interval) => new TimerSourceNode(timeout, interval)

module.exports = {
	TimerSourceNode,
	timer,
}

const { Node, SYM } = require('../node')
const { Future } = require('@kmamal/async/future')

class PromiseNode extends Node {
	constructor () {
		super()
		this._lastValue = undefined
		this._future = new Future()
	}

	get promise () { return this._future.promise() }

	[SYM.kCloseHook] () {
		this._future.resolve(this._lastValue)
	}

	[SYM.kWriteHook] (data) {
		this._lastValue = Array.isArray(data) ? data.at(-1) : data
	}
}

const toPromise = (src) => src.pipe(new PromiseNode()).promise

module.exports = {
	PromiseNode,
	toPromise,
}

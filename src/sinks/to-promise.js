const { Node, SYM } = require('../node')
const { pipe } = require('../pipe')
const { LastNode } = require('../operators/last')
const { Future } = require('@kmamal/async/future')

class PromiseSinkNode extends Node {
	constructor () {
		super()
		this._lastValue = undefined
		this._future = new Future()
	}

	get promise () { return this._future.promise() }

	[SYM.kCloseHook] () {
		this._future.resolve()
	}

	[SYM.kErrorHook] (error) {
		this._future.reject(error)
	}

	[SYM.kWriteHook] (data) {
		this._future.resolve(Array.isArray(data) ? data[0] : data)
	}
}

const toPromise = async (src) => {
	const promiseNode = await pipe([
		src,
		new LastNode(),
		new PromiseSinkNode(),
	])
	return promiseNode.promise
}

module.exports = {
	PromiseSinkNode,
	toPromise,
}

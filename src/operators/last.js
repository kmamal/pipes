const { Node, SYM } = require('../node')
const { pipe } = require('../pipe')
const { EagerOperatorNode } = require('./eager')

class LastOperatorNode extends Node {
	constructor () {
		super()
		this._lastData = undefined
	}

	async [SYM.kCloseHook] () {
		if (this._lastData !== undefined) {
			await this._propagateWrite(this._lastData)
		}
	}

	[SYM.kWriteHook] (data) {
		this._lastData = Array.isArray(data) ? data.slice(-1) : data
	}
}

const last = () => (src) => pipe([
	src,
	new EagerOperatorNode(),
	new LastOperatorNode(),
])

module.exports = {
	LastOperatorNode,
	last,
}

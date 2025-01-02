const { Node, SYM } = require('../node')

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
		this._lastData = data.slice(-1)
	}
}

const last = () =>
	(src) => src.pipe(new LastOperatorNode())

module.exports = {
	LastOperatorNode,
	last,
}

const { Node, SYM } = require('../node')

class TapOperatorNode extends Node {
	constructor (fnTap) {
		super()
		this._fnTap = fnTap
	}

	async [SYM.kWriteHook] (data) {
		if (Array.isArray(data)) {
			for (const x of data) { this._fnTap(x) }
		} else {
			this._fnTap(data)
		}
		await this._propagateWrite(data)
	}
}

const tap = (fnTap) =>
	(src) => src.pipe(new TapOperatorNode(fnTap))

module.exports = {
	TapOperatorNode,
	tap,
}

const { Node, SYM } = require('../node')

class TapNode extends Node {
	constructor (fnTap) {
		super()
		this._fnTap = fnTap
	}

	async [SYM.kWriteHook] (data) {
		for (const x of data) { this._fnTap(x) }
		await this._propagateWrite(data)
	}
}

const tap = (fnTap) =>
	(src) => src.pipe(new TapNode(fnTap))

module.exports = {
	TapNode,
	tap,
}

const { Node, SYM } = require('../node')

class EagerOperatorNode extends Node {
	constructor (readSize = 4096) {
		super()
		this._readSize = readSize
	}

	[SYM.kOpenHook] () {
		this._propagateRead(this._readSize)
	}

	async [SYM.kWriteHook] (data) {
		await this._propagateWrite(data)
		this._propagateRead(this._readSize)
	}
}

const eager = (src) => src.pipe(new EagerOperatorNode())

module.exports = {
	EagerOperatorNode,
	eager,
}

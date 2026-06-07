const { Node, SYM } = require('../node')
const { defaultReadSize } = require('../constants')

class EagerOperatorNode extends Node {
	constructor (readSize = defaultReadSize) {
		super()
		this._readSize = readSize
	}

	[SYM.kOpenHook] () {
		this.read(this._readSize)
	}

	async [SYM.kWriteHook] (data) {
		await this._propagateWrite(data)
		this.read(this._readSize)
	}
}

const eager = (src) => src.pipe(new EagerOperatorNode())

module.exports = {
	EagerOperatorNode,
	eager,
}

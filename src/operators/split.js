const { Node, SYM } = require('../node')

class SplitOperatorNode extends Node {
	constructor (pattern, readSize = 4096) {
		super()
		this._pattern = pattern
		this._buffer = ''
		this._readSize = readSize
	}

	async [SYM.kCloseHook] () {
		await this._propagateWrite([ this._buffer ])
	}

	async [SYM.kReadHook] () {
		await this._propagateRead(this._readSize)
	}

	async [SYM.kWriteHook] (data) {
		this._buffer += data
		const parts = this._buffer.split(this._pattern)
		this._buffer = parts.pop()
		if (parts.length === 0) {
			this._propagateRead(this._readSize)
		}
		else {
			await this._propagateWrite(parts)
		}
	}
}

const split = (pattern, readSize) =>
	(src) => src.pipe(new SplitOperatorNode(pattern, readSize))

module.exports = {
	SplitOperatorNode,
	split,
}

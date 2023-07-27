const { Node, SYM } = require('../node')

class SplitOperatorNode extends Node {
	constructor (pattern) {
		super()
		this._pattern = pattern
		this._buffer = ''
	}

	async [SYM.kCloseHook] () {
		await this._propagateWrite([ this._buffer ])
	}

	async [SYM.kReadHook] () {
		await this._propagateRead(4096)
	}

	async [SYM.kWriteHook] (data) {
		this._buffer += data
		const parts = this._buffer.split(this._pattern)
		this._buffer = parts.pop()
		if (parts.length === 0) {
			await this._propagateRead(4096)
		} else {
			await this._propagateWrite(parts)
		}
	}
}

const split = (pattern) =>
	(src) => src.pipe(new SplitOperatorNode(pattern))

module.exports = {
	SplitOperatorNode,
	split,
}

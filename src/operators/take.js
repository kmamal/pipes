const { Node, SYM } = require('../node')

class TakeOperatorNode extends Node {
	constructor (n) {
		super()
		this._remaining = n
	}

	async [SYM.kWriteHook] (data) {
		const value = data.slice(0, this._remaining)
		await this._propagateWrite(value)
		this._remaining -= value.length
		if (this._remaining === 0) { this.close() }
	}
}

const take = (n) =>
	(src) => src.pipe(new TakeOperatorNode(n))

module.exports = {
	TakeOperatorNode,
	take,
}

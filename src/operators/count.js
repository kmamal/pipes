const { Node, SYM } = require('../node')

class CountOperatorNode extends Node {
	constructor () {
		super()
		this._count = 0
	}

	async [SYM.kCloseHook] () {
		await this._propagateWrite([ this._count ])
	}

	[SYM.kWriteHook] (data) {
		this._count += data.length
	}
}

const count = () =>
	(src) => src.pipe(new CountOperatorNode())

module.exports = {
	CountOperatorNode,
	count,
}

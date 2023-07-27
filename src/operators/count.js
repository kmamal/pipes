const { Node, SYM } = require('../node')
const { pipe } = require('../pipe')
const { EagerOperatorNode } = require('./eager')

class CountOperatorNode extends Node {
	constructor () {
		super()
		this._count = 0
	}

	async [SYM.kCloseHook] () {
		await this._propagateWrite(this._count)
	}

	[SYM.kWriteHook] (data) {
		this._count += data.length
	}
}

const count = () => (src) => pipe([
	src,
	new EagerOperatorNode(),
	new CountOperatorNode(),
])

module.exports = {
	CountOperatorNode,
	count,
}

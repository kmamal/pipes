const { Node, SYM } = require('../node')

class StringSourceNode extends Node {
	constructor (string) {
		super()
		this._string = string
	}

	async [SYM.kReadHook] () {
		await this._propagateWrite(this._string)
		this.close()
	}
}

const fromString = (iterable) => new StringSourceNode(iterable)

module.exports = {
	StringSourceNode,
	fromString,
}

const { Node, SYM } = require('../node')
const { EmptyNode } = require('./empty')

class ConcatSourceNode extends Node {
	constructor (nodes) {
		if (nodes.length === 0) { return new EmptyNode() }
		super()
		this._nodes = nodes
		this._index = 0
		this._node().pipe(this)
	}

	_node () { return this._nodes[this._index] }

	async _closeFrom (from) {
		if (from !== this[SYM.kSrc]) {
			await super._closeFrom(from)
			return
		}

		this._node().unpipe()
		this._index++
		if (this._index === this._nodes.length) {
			await super._closeFrom(from)
			this._index = 0
			return
		}
		this._node().pipe(this)
	}
}

const concat = (nodes) => new ConcatSourceNode(nodes)

module.exports = {
	ConcatSourceNode,
	concat,
}

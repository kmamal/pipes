const { Node, SYM } = require('../node')

class EmptySourceNode extends Node {
	[SYM.kOpenHook] () { this.close() }
}

const empty = () => new EmptySourceNode()

module.exports = {
	EmptySourceNode,
	empty,
}

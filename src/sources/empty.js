const { Node, SYM } = require('../node')
const _ = require('@kmamal/util')

class EmptyNode extends Node {
	[SYM.kOpenHook] () { _.sleep(0).then(() => { this.close() }) }
}

const empty = () => new EmptyNode()

module.exports = {
	EmptyNode,
	empty,
}

const { Node, SYM } = require('../node')
const { sleep } = require('@kmamal/util/promise/sleep')

class EmptySourceNode extends Node {
	[SYM.kOpenHook] () { sleep(0).then(() => { this.close() }) }
}

const empty = () => new EmptySourceNode()

module.exports = {
	EmptySourceNode,
	empty,
}

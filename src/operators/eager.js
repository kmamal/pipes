const { Node, SYM } = require('../node')
const _ = require('@kmamal/util')

class EagerNode extends Node {
	[SYM.kOpenHook] () { _.sleep(0).then(() => { this.read(1) }) }
	async [SYM.kWriteHook] (data) {
		this.read(1)
		await this._propagateWrite(data)
	}
}

const eager = (src) => src.pipe(new EagerNode())

module.exports = {
	EagerNode,
	eager,
}

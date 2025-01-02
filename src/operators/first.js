const { Node, SYM } = require('../node')

class FirstOperatorNode extends Node {
	async [SYM.kWriteHook] (data) {
		await this._propagateWrite(data.slice(0, 1))
		this.close()
	}
}

const first = () => (src) => src.pipe(new FirstOperatorNode())

module.exports = {
	FirstOperatorNode,
	first,
}

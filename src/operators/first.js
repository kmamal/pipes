const { Node, SYM } = require('../node')

class FirstOperatorNode extends Node {
	async [SYM.kWriteHook] (data) {
		const value = Array.isArray(data) ? data.slice(0, 1) : data
		await this._propagateWrite(value)
		this.close()
	}
}

const first = () => (src) => src.pipe(new FirstOperatorNode())

module.exports = {
	FirstOperatorNode,
	first,
}

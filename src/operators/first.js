const { Node, SYM } = require('../node')

class FirstNode extends Node {
	async [SYM.kWriteHook] (data) {
		const value = Array.isArray(data) ? data.slice(0, 1) : data
		await this._propagateWrite(value)
		await this.close()
	}
}

const first = (src) => src.pipe(new FirstNode())

module.exports = {
	FirstNode,
	first,
}

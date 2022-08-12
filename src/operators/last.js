const { Node, SYM } = require('../node')

class LastNode extends Node {
	constructor () {
		super()
		this._lastValue = undefined
	}

	async [SYM.kCloseHook] () {
		if (this._lastValue !== undefined) {
			await this.write(this._lastValue)
		}
	}

	[SYM.kWriteHook] (data) {
		this._lastValue = Array.isArray(data) ? data.slice(-1) : data
	}
}

const last = (src) => src.pipe(new LastNode())

module.exports = {
	LastNode,
	last,
}

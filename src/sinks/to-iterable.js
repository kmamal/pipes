const { Node, SYM } = require('../node')

class IterableSinkNode extends Node {
	constructor () {
		super()
		this._done = false
		this._buffer = []
		this._waiting = null
	}

	async _getNext () {
		if (this._done) { return { done: true } }

		const value = this._buffer.length > 0
			? this._buffer.shift()
			: await new Promise((resolve) => { this._waiting = resolve })
		return { done: value === null, value }
	}

	[SYM.kCloseHook] () {
		this._done = true
		if (this._waiting) {
			this._waiting(null)
			this._waiting = null
		}
	}

	[SYM.kWriteHook] (data) {
		if (!this._waiting) {
			this._buffer.push(data)
			return
		}

		this._waiting(data)
		this._waiting = null
	}

	async * [Symbol.asyncIterator] () {
		await this.open()
		for (;;) {
			this.read(1)
			const { done, value: data } = await this._getNext()
			if (done) { break }
			Array.isArray(data) ? yield* data : yield data
		}
		await this.close()
	}
}

const toAsyncIterable = (src) => src.pipe(new IterableSinkNode())

module.exports = {
	IterableSinkNode,
	toAsyncIterable,
}

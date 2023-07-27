const { Node, SYM } = require('../node')

class IterableSinkNode extends Node {
	constructor () {
		super()
		this._done = false
		this._buffer = []
		this._resolveNext = null
	}

	async _getNext () {
		if (this._done) { return { done: true } }

		this._propagateRead(1)
		const value = this._buffer.length > 0
			? this._buffer.shift()
			: await new Promise((resolve) => { this._resolveNext = resolve })
		return { done: value === null, value }
	}

	[SYM.kCloseHook] () {
		this._done = true
		if (this._resolveNext) {
			this._resolveNext(null)
			this._resolveNext = null
		}
	}

	[SYM.kWriteHook] (data) {
		if (!this._resolveNext) {
			this._buffer.push(data)
			return
		}

		this._resolveNext(data)
		this._resolveNext = null
	}

	async * [Symbol.asyncIterator] () {
		await this.open()
		try {
			for (;;) {
				const { done, value: data } = await this._getNext()
				if (done) { break }
				Array.isArray(data) ? yield* data : yield data
			}
		} finally {
			await this.close()
		}
	}
}

const toAsyncIterable = (src) => src.pipe(new IterableSinkNode())

module.exports = {
	IterableSinkNode,
	toAsyncIterable,
}

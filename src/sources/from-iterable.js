const { Node, SYM } = require('../node')

class IterableSourceNode extends Node {
	constructor (iterable) {
		super()
		this._iterable = iterable
		this._makeIterator = null
			?? iterable[Symbol.iterator]
			?? iterable[Symbol.asyncIterator]
	}

	[SYM.kOpenHook] () {
		this._iterator = this._makeIterator.call(this._iterable)
	}

	[SYM.kCloseHook] () {
		this._iterator.return?.()
	}

	[SYM.kErrorHook] (error) {
		this._iterator.throw?.(error)
	}

	async [SYM.kReadHook] (n) {
		const values = new Array(n)
		let shouldClose = false

		for (let i = 0; i < n; i++) {
			const { done, value } = await this._iterator.next()
			if (done) {
				values.length = i
				shouldClose = true
				break
			}
			values[i] = value
		}

		await this._propagateWrite(values)

		if (shouldClose) { this.close() }
	}
}

const fromIterable = (iterable) => new IterableSourceNode(iterable)

module.exports = {
	IterableSourceNode,
	fromIterable,
}

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

	async [SYM.kReadHook] (n) {
		const values = new Array(n)
		let done
		let value

		for (let i = 0; i < n; i++) {
			({ done, value } = await this._iterator.next())
			if (done) {
				values.length = i
				break
			}
			values[i] = value
		}

		if (values.length > 0) { await this._propagateWrite(values) }
		if (done) { await this.close() }
	}
}

const fromIterable = (iterable) => new IterableSourceNode(iterable)

module.exports = {
	IterableSourceNode,
	fromIterable,
}

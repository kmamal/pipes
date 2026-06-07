const { Node, SYM } = require('../node')

class StreamSourceNode extends Node {
	constructor (stream) {
		super()
		this._stream = stream
	}

	[SYM.kOpenHook] () {
		this._iterator = this._stream[Symbol.asyncIterator]()
	}

	[SYM.kCloseHook] () {
		this._iterator.return?.()
	}

	[SYM.kErrorHook] (error) {
		this._iterator.throw?.(error)
	}

	async [SYM.kReadHook] (n) {
		const chunks = []
		let shouldClose = false
		let totalLength = 0

		while (totalLength < n) {
			const { done, value: chunk } = await this._iterator.next()
			if (done) {
				shouldClose = true
				break
			}
			chunks.push(chunk)
			totalLength += chunk.length
		}

		const data = Buffer.isBuffer(chunks[0]) ? Buffer.concat(chunks) : chunks.join('')
		await this._propagateWrite(data)

		if (shouldClose) { this.close() }
	}
}

const fromStream = (stream) => new StreamSourceNode(stream)

module.exports = {
	StreamSourceNode,
	fromStream,
}

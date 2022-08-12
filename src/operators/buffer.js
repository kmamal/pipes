
const { Node, SYM } = require('../node')
const {
	ArrayChunkList,
	BufferChunkList,
	StringChunkList,
} = require('@kmamal/structs/chunk-list')

const byType = {
	array: ArrayChunkList,
	buffer: BufferChunkList,
	string: StringChunkList,
}
const makeBuffer = (type) => new byType[type]()

class BufferNode extends Node {
	constructor (options) {
		super()
		this._type = options?.type
		if (this._type) { this._buffer = makeBuffer(this._type) }
		this._numPending = 0
	}

	[SYM.kReadHook] (n) {
		const { length } = this._buffer
		const satisfied = Math.min(length, n)
		if (satisfied > 0) {
			const data = this._buffer.shiftN(satisfied)
			this._propagateWrite(data)
		}

		const remaining = n - satisfied
		if (remaining > 0) {
			this._numPending += remaining
			this._propagateRead(n)
		}
	}

	async [SYM.kWriteHook] (data) {
		if (!this._type) {
			this._type = typeof data === 'string' ? 'string'
				: Array.isArray(data) ? 'array'
				: 'buffer'
			this._buffer = makeBuffer(this._type)
		}

		const { length } = data
		const satisfied = Math.min(this._numPending, length)
		if (satisfied > 0) {
			await this._propagateWrite(data.slice(0, satisfied))
		}

		const remaining = length - satisfied
		if (remaining > 0) {
			this._buffer.pushChunk(data.slice(satisfied))
		}
	}
}

const buffer = (options) =>
	(src) => src.pipe(new BufferNode(options))

module.exports = {
	BufferNode,
	buffer,
}

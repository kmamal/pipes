
const { Node, SYM } = require('../node')
const {
	ArrayChunkList,
	BufferChunkList,
	StringChunkList,
} = require('@kmamal/structs/chunk-list')
const { sleep } = require('@kmamal/util/promise/sleep')

const byType = {
	array: ArrayChunkList,
	buffer: BufferChunkList,
	string: StringChunkList,
}
const makeBuffer = (type) => new byType[type]()


class BufferOperatorNode extends Node {
	constructor (options) {
		super()
		this._type = options?.type
		this._prefill = options?.prefill ?? 4096
		if (this._type) { this._buffer = makeBuffer(this._type) }
		this._numPending = 0
	}

	[SYM.kOpenHook] () {
		sleep(0).then(() => { this._propagateRead(this._prefill) })
	}

	async [SYM.kCloseHook] () {
		await this._propagateWrite(this._buffer.shiftN(this._buffer.length))
	}

	async [SYM.kReadHook] (n) {
		const { length } = this._buffer
		const satisfied = Math.min(length, n)
		if (satisfied > 0) {
			const data = this._buffer.shiftN(satisfied)
			await this._propagateWrite(data)
		}

		const unsatisfied = n - satisfied
		this._numPending += unsatisfied

		const missing = (this._numPending + this._prefill) - this._buffer.length
		if (missing > 0) { await this._propagateRead(missing) }
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
			this._numPending -= satisfied
			await this._propagateWrite(data.slice(0, satisfied))
		}

		const remaining = length - satisfied
		if (remaining > 0) { this._buffer.pushChunk(data.slice(satisfied)) }

		const missing = (this._numPending + this._prefill) - this._buffer.length
		if (missing > 0) { await this._propagateRead(missing) }
	}
}

const buffer = (options) =>
	(src) => src.pipe(new BufferOperatorNode(options))

module.exports = {
	BufferOperatorNode,
	buffer,
}

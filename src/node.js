const EventEmitter = require('events')

const kState = Symbol("state")
const kError = Symbol("error")
const kSrc = Symbol("src")
const kDst = Symbol("dst")
const kCanWrite = Symbol("can write")
const kWritePromise = Symbol("write promise")
const kReadPromise = Symbol("read promise")
const kOpenHook = Symbol("open hook")
const kCloseHook = Symbol("close hook")
const kReadHook = Symbol("read hook")
const kWriteHook = Symbol("write hook")

const kErrorNode = Symbol("node")

class Node extends EventEmitter {
	constructor (hooks) {
		super()
		this[kState] = 'closed'
		this[kError] = null
		this[kSrc] = null
		this[kDst] = null
		this[kCanWrite] = true
		this[kWritePromise] = Promise.resolve()
		this[kReadPromise] = Promise.resolve()

		if (hooks) {
			if (hooks.open) { this[kOpenHook] = hooks.open }
			if (hooks.close) { this[kCloseHook] = hooks.close }
			if (hooks.read) { this[kReadHook] = hooks.read }
			if (hooks.write) { this[kWriteHook] = hooks.write }
		}
	}

	async pipe (node) {
		if (this[kError]) { return node }
		this[kDst] = node
		node[kSrc] = this
		if (false
			|| this[kState] === 'opened'
			|| node[kState] === 'opened'
		) { await this.open() }
		return node
	}

	unpipe () {
		if (this[kError]) { return this }
		const dst = this[kDst]
		if (dst) {
			this[kDst] = null
			dst[kSrc] = null
		}
		return this
	}

	async _propagateOpenDownstream (from) {
		if (!this[kDst] || this[kDst] === from) { return }
		await this[kDst]?._openFrom(this)
	}

	async _propagateOpenUpstream (from) {
		if (!this[kSrc] || this[kSrc] === from) { return }
		await this[kSrc]?._openFrom(this)
	}

	async _openFrom (from) {
		await this._propagateOpenDownstream(from)
		if (!this[kError] && this[kState] === 'closed') {
			this[kState] = 'opening'
			await this[kOpenHook]?.(from)
			this[kState] = 'opened'
		}
		await this._propagateOpenUpstream(from)
	}

	async open () {
		await this._openFrom(null)
	}

	async _propagateCloseUpstream (from) {
		if (!this[kSrc] || this[kSrc] === from) { return }
		await this[kSrc]._closeFrom(this)
	}

	async _propagateCloseDownstream (from) {
		if (!this[kDst] || this[kDst] === from) { return }
		await this[kDst]._closeFrom(this)
	}

	async _closeFrom (from) {
		await this._propagateCloseUpstream(from)
		if (!this[kError] && this[kState] === 'opened') {
			this[kState] = 'closing'
			await this[kCloseHook]?.(from)
			this[kState] = 'closed'
		}
		await this._propagateCloseDownstream(from)
	}

	async close () {
		await this._closeFrom(null)
	}

	async _doError (error) {
		this.emit('error', error)
		await this.close()
	}

	async _propagateError (error) {
		this[kDst]
			? await this[kDst]._propagateError(error)
			: await this._doError(error)
	}

	async error (error) {
		if (this[kError]) { return }
		this[kError] = error
		Object.assign(error, { [kErrorNode]: this })
		await this._propagateError(error)
	}

	_propagateRead (n) {
		if (n <= 0) { return }
		this[kSrc]?.read(n)
	}

	[kReadHook] (n) {
		this._propagateRead(n)
	}

	read (n) {
		if (n <= 0) { return }
		if (this[kError] || this[kState] !== 'opened') { return }
		this[kReadPromise] = this[kReadPromise].then(async () => {
			await this[kReadHook](n)
		})
	}

	async _propagateWrite (data) {
		if (data.length === 0) { return }
		this[kWritePromise] = this[kWritePromise].then(async () => {
			await this[kDst]?.write(data)
		})
		await this._writePromise
	}

	async [kWriteHook] (data) {
		await this._propagateWrite(data)
	}

	async write (data) {
		if (data.length === 0) { return }
		if (this[kError] || this[kState] !== 'opened') { return }

		if (!this[kCanWrite]) { this.error(new Error("bad write")) }
		this[kCanWrite] = false
		await this[kWriteHook](data)
		this[kCanWrite] = true
	}
}

module.exports = {
	Node,
	SYM: {
		kState,
		kError,
		kSrc,
		kDst,
		kCanWrite,
		kWritePromise,
		kReadPromise,
		kOpenHook,
		kCloseHook,
		kReadHook,
		kWriteHook,
	},
}

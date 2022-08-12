const { Node } = require('../node')

class DebugNode extends Node {
	constructor (name) {
		super()
		this._name = name
	}

	async pipe (node) {
		console.log(`[${this._name}] pipe`)
		return await super.pipe(node)
	}

	unpipe () {
		console.log(`[${this._name}] unpipe`)
		return super.unpipe()
	}

	async _openFrom (from) {
		console.log(`[${this._name}] open`)
		await super.open(from)
	}

	async _doError (error) {
		console.log(`[${this._name}] _doError ${error.message}`)
		await super._doError(error)
	}

	async _propagateError (error) {
		console.log(`[${this._name}] _propagateError ${error.message}`)
		await super._propagateError(error)
	}

	async error (error) {
		console.log(`[${this._name}] error ${error.message}`)
		await super.error(error)
	}

	read (n) {
		console.log(`[${this._name}] read ${n}`)
		super.read(n)
	}

	async write (data) {
		console.log(`[${this._name}] write ${data.length}`)
		await super.write(data)
	}
}

const debug = (name) =>
	(src) => src.pipe(new DebugNode(name))

module.exports = {
	DebugNode,
	debug,
}

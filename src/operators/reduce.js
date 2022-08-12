const { Node, SYM } = require('../node')
const _ = require('@kmamal/util')

class ReduceNode extends Node {
	constructor (fnReduce, initial) {
		super()
		this._fnReduce = fnReduce
		this._acc = initial
	}

	async [SYM.kCloseHook] () {
		if (this._acc !== undefined) {
			await this._propagateWrite([ this._acc ])
		}
	}

	[SYM.kWriteHook] (data) {
		this._acc = _.reduce(data, this._fnReduce, this._acc)
	}
}

const reduce = (fnReduce, initial) =>
	(src) => src.pipe(new ReduceNode(fnReduce, initial))

module.exports = {
	ReduceNode,
	reduce,
}

const { Node, SYM } = require('../node')
const { reduce: reduceArray } = require('@kmamal/util/array/reduce')

class ReduceOperatorNode extends Node {
	constructor (fnReduce, initial) {
		super()
		this._fnReduce = fnReduce
		this._acc = initial
	}

	async [SYM.kCloseHook] () {
		if (this._acc === undefined) { return }
		await this._propagateWrite([ this._acc ])
	}

	[SYM.kWriteHook] (data) {
		this._acc = reduceArray(data, this._fnReduce, this._acc)
	}
}

const reduce = (fnReduce, initial) =>
	(src) => src.pipe(new ReduceOperatorNode(fnReduce, initial))


module.exports = {
	ReduceOperatorNode,
	reduce,
}

const { Node, SYM } = require('../node')
const { scan: scanArray } = require('@kmamal/util/array/scan')
const { last } = require('@kmamal/util/array/last')

class ScanOperatorNode extends Node {
	constructor (fnReduce, initial) {
		super()
		this._fnReduce = fnReduce
		this._acc = initial
	}

	async [SYM.kWriteHook] (data) {
		const scanned = scanArray.$$$(data, this._fnReduce, this._acc)
		this._acc = last(scanned)
		await this._propagateWrite(scanned)
	}
}

const scan = (fnReduce, initial) =>
	(src) => src.pipe(new ScanOperatorNode(fnReduce, initial))

module.exports = {
	ScanOperatorNode,
	scan,
}

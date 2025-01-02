const { Node, SYM } = require('../node')
const { scan: scanArray } = require('@kmamal/util/array/scan')

class ScanOperatorNode extends Node {
	constructor (fnReduce, initial) {
		super()
		this._fnReduce = fnReduce
		this._acc = initial
	}

	async [SYM.kWriteHook] (data) {
		const scanned = scanArray.$$$(data, this._fnReduce, this._acc)
		this._acc = scanned.at(-1)
		await this._propagateWrite(scanned)
	}
}

const scan = (fnReduce, initial) =>
	(src) => src.pipe(new ScanOperatorNode(fnReduce, initial))

module.exports = {
	ScanOperatorNode,
	scan,
}

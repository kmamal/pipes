const { Node, SYM } = require('../node')
const _ = require('@kmamal/util')

class ScanNode extends Node {
	constructor (fnReduce, initial) {
		super()
		this._fnReduce = fnReduce
		this._acc = initial
	}

	async [SYM.kWriteHook] (data) {
		const scanned = _.scan.$$$(data, this._fnReduce, this._acc)
		this._acc = _.last(scanned)
		await this._propagateWrite(scanned)
	}
}

const scan = (fnReduce, initial) =>
	(src) => src.pipe(new ScanNode(fnReduce, initial))

module.exports = {
	ScanNode,
	scan,
}

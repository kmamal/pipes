const { Node, SYM } = require('../node')
const { map: mapArray } = require('@kmamal/util/array/map')

class MapOperatorNode extends Node {
	constructor (fnMap) {
		super()
		this._fnMap = fnMap
	}

	async [SYM.kWriteHook] (data) {
		mapArray.$$$(data, this._fnMap)
		await this._propagateWrite(data)
	}
}

const map = (fnMap) =>
	(src) => src.pipe(new MapOperatorNode(fnMap))

module.exports = {
	MapOperatorNode,
	map,
}

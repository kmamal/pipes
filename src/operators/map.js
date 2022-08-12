const { Node, SYM } = require('../node')
const _ = require('@kmamal/util')

class MapNode extends Node {
	constructor (fnMap) {
		super()
		this._fnMap = fnMap
	}

	async [SYM.kWriteHook] (data) {
		_.map.$$$(data, this._fnMap)
		await this._propagateWrite(data)
	}
}

const map = (fnMap) =>
	(src) => src.pipe(new MapNode(fnMap))

module.exports = {
	MapNode,
	map,
}

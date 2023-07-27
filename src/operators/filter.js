const { Node, SYM } = require('../node')
const { filter: filterArray } = require('@kmamal/util/array/filter')

class FilterOperatorNode extends Node {
	constructor (fnFilter) {
		super()
		this._fnFilter = fnFilter
	}

	async [SYM.kWriteHook] (data) {
		const { length } = data
		filterArray.$$$(data, this._fnFilter)
		await this._propagateWrite(data)
		if (data.length === 0) { this._propagateRead(length) }
	}
}

const filter = (fnFilter) =>
	(src) => src.pipe(new FilterOperatorNode(fnFilter))

module.exports = {
	FilterOperatorNode,
	filter,
}

const { Node, SYM } = require('../node')
const _ = require('@kmamal/util')

class FilterNode extends Node {
	constructor (fnFilter) {
		super()
		this._fnFilter = fnFilter
	}

	async [SYM.kWriteHook] (data) {
		const { length } = data
		_.filter.$$$(data, this._fnFilter)
		this.read(length - data.length)
		await this._propagateWrite(data)
	}
}

const filter = (fnFilter) =>
	(src) => src.pipe(new FilterNode(fnFilter))

module.exports = {
	FilterNode,
	filter,
}

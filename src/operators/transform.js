const { Node, SYM } = require('../node')

class TransformOperatorNode extends Node {
	constructor (fnTransform) {
		super()
		this._fnTransform = fnTransform
	}

	async [SYM.kWriteHook] (data) {
		const { length } = data
		const transformed = this._fnTransform(data)
		await this._propagateWrite(transformed)
		if (data.length === 0) { this._propagateRead(length) }
	}
}

const transform = (fnTransform) =>
	(src) => src.pipe(new TransformOperatorNode(fnTransform))

module.exports = {
	TransformOperatorNode,
	transform,
}

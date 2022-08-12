const { Node, SYM } = require('../node')

class TransformNode extends Node {
	constructor (fnTransform) {
		super()
		this._fnTransform = fnTransform
	}

	async [SYM.kWriteHook] (data) {
		const { length } = data
		const transformed = this._fnTransform(data)
		this.read(length - transformed.length)
		await this._propagateWrite(transformed)
	}
}

const transform = (fnTransform) =>
	(src) => src.pipe(new TransformNode(fnTransform))

module.exports = {
	TransformNode,
	transform,
}

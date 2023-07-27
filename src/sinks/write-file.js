const { Node, SYM } = require('../node')
const Fs = require('fs')

class WriteFileSinkNode extends Node {
	constructor (path, options) {
		super()
		this._path = path
		this._options = options
		this._file = null
		this._position = 0
	}

	async [SYM.kOpenHook] () {
		this._file = this._options?.file
			?? await Fs.promises.open(this._path, this._options?.flags ?? 'w')
		this._position = 0
	}

	async [SYM.kCloseHook] () {
		await this._file.close()
	}

	async [SYM.kWriteHook] (_data) {
		const encoding = this._options?.encoding
		const data = encoding ? _data.toString(encoding) : _data
		await this._file.write(data, {
			position: this._position,
		})
		this._position += Buffer.length
	}
}

const writeFile = (path, options) =>
	(src) => src.pipe(new WriteFileSinkNode(path, options))

module.exports = {
	WriteFileSinkNode,
	writeFile,
}

const { Node, SYM } = require('../node')
const Fs = require('fs')

class ReadFileSourceNode extends Node {
	constructor (path, options) {
		super()
		this._path = path
		this._options = options
		this._file = null
		this._position = 0
	}

	async [SYM.kOpenHook] () {
		this._file = this._options?.file
			?? await Fs.promises.open(this._path, this._options?.flags ?? 'r')
		this._position = 0
	}

	async [SYM.kCloseHook] () {
		await this._file.close()
	}

	async [SYM.kReadHook] (n) {
		let _data = Buffer.alloc(n)
		const { bytesRead } = await this._file.read(_data, {
			position: this._position,
		})

		if (bytesRead === 0) {
			this.close()
			return
		}

		if (bytesRead < n) {
			_data = _data.subarray(0, bytesRead)
		}

		this._position += bytesRead
		const encoding = this._options?.encoding
		const data = encoding ? _data.toString(encoding) : _data
		await this.write(data)
	}
}

const readFile = (path, options) => new ReadFileSourceNode(path, options)

module.exports = {
	ReadFileSourceNode,
	readFile,
}

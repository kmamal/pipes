const { Node, SYM } = require('../node')
const fp = require('@kmamal/util/fp')

const _getBalance = (x) => x.balance

class TeeNode extends Node {
	constructor () {
		super()
		this._dummies = new Map()
		this._maxBalance = 0
		this._numOpen = 0
	}

	_dummyNodes () { return [ ...this._dumies.keys() ] }

	[SYM.kCloseHook] () {
		this._maxBalance = 0
	}

	async connect (node) {
		const nodeInfo = {
			balance: 0,
			dummy: new Node({
				read: (n) => {
					nodeInfo.balance += n
					if (nodeInfo.balance > this._maxBalance) {
						const diff = nodeInfo.balance - this._maxBalance
						this.read(diff)
						this._maxBalance = nodeInfo.balance
					}
				},
				open: () => {
					if (this._numOpen++ === 0) { this.open() }
				},
				close: () => {
					if (--this._numOpen === 0) { this.close() }
				},
			}),
		}
		this._dummies.set(node, nodeInfo)
		await nodeInfo.dummy.pipe(node)
	}

	disconnect (node) {
		const nodeInfo = this._dummies.get(node)
		this._dummies.delete(node)

		const { dummy } = nodeInfo
		dummy.unpipe()

		if (nodeInfo.dummy[SYM.kState === 'opened']) { this._numOpen-- }

		this._maxBalance = fp.pass(
			this._dummyNodes(),
			fp.map.$$$(_getBalance),
			fp.max,
		)
	}

	async _propagateOpenDownstream () {
		await Promise.all(this._dummyNodes().map(async (dummy) => {
			await dummy.open()
		}))
	}

	async _propagateCloseDownstream () {
		await Promise.all(this._dummyNodes().map(async (dummy) => {
			await dummy.close()
		}))
	}

	async _propagateError (error) {
		if (this._dummies.size === 0) {
			await this._doError(error)
			return
		}

		await Promise.all(this._dummyNodes().map(async (dummy) => {
			await dummy.error(error)
		}))
	}

	async _propagateWrite (data) {
		const { length } = data
		await Promise.all([ ...this._dummies.entries() ]
			.map(async ([ dummy, nodeInfo ]) => {
				if (dummy[SYM.kState] !== 'opened') { return }
				await dummy.write(data)
				nodeInfo.balance = Math.max(nodeInfo.balance - length)
			}))
		this._maxBalance -= length
	}
}

module.exports = { TeeNode }

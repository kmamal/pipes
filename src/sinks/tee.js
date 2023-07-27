const { Node, SYM } = require('../node')
const { max } = require('@kmamal/util/array/max')

const _getBalance = (x) => x.balance

class TeeSinkNode extends Node {
	constructor () {
		super()
		this._dummies = new Set()
		this._maxBalance = 0
		this._numOpen = 0
	}

	[SYM.kCloseHook] () {
		this._maxBalance = 0
	}

	makeSource () {
		const dummy = new Node({
			read: (n) => {
				dummy.balance += n
				if (dummy.balance > this._maxBalance) {
					const diff = dummy.balance - this._maxBalance
					this.read(diff)
					this._maxBalance = dummy.balance
				}
			},
			open: () => {
				if (this._numOpen++ === 0) { this.open() }
			},
			close: () => {
				this._dummies.delete(dummy)
				this._maxBalance = max([ ...this._dummies.values() ].map(_getBalance))
				if (--this._numOpen === 0) { this.close() }
			},
		})
		dummy.balance = 0
		this._dummies.add(dummy)
		return dummy
	}

	async _propagateOpenDownstream () {
		await Promise.all([ ...this._dummies.values() ].map(async (dummy) => {
			await dummy.open()
		}))
	}

	async _propagateCloseDownstream () {
		await Promise.all([ ...this._dummies.values() ].map(async (dummy) => {
			await dummy.close()
		}))
	}

	async _propagateError (error) {
		if (this._dummies.size === 0) {
			await this._doError(error)
			return
		}

		await Promise.all([ ...this._dummies.values() ].map(async (dummy) => {
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

const tee = () => new TeeSinkNode()

module.exports = {
	TeeSinkNode,
	tee,
}

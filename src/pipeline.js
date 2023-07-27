const { _makeConnections } = require("./make-connections")
const { EagerOperatorNode } = require("./operators/eager")
const { LastOperatorNode } = require("./operators/last")
const { PromiseSinkNode } = require("./sinks/to-promise")

const pipeline = async (nodes) => {
	const promiseNode = await _makeConnections(nodes[0], [
		new EagerOperatorNode(),
		...nodes.slice(1),
		new LastOperatorNode(),
		new PromiseSinkNode(),
	])
	await promiseNode.open()
	return await promiseNode.promise
}

module.exports = { pipeline }

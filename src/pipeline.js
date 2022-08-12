const { EagerNode } = require("./operators/eager")
const { PromiseNode } = require("./sinks/to-promise")

const _makeConnections = async (_node, nodes) => {
	let node = _node
	for (const next of nodes) {
		node = Array.isArray(next)
			? _makeConnections(node, next)
			: node = await node.pipe(next)
	}
	return node
}

const pipeline = async (nodes) => {
	const promiseNode = await _makeConnections(nodes[0], [
		...nodes.slice(1),
		new EagerNode(),
		new PromiseNode(),
	])
	await promiseNode.open()
	return await promiseNode.promise
}

module.exports = { pipeline }

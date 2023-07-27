
const _makeConnections = async (_node, nodes) => {
	let node = _node
	for (const next of nodes) {
		node
			= Array.isArray(next) ? await _makeConnections(node, next)
			: typeof next === 'function' ? await next(node)
			: await node.pipe(next)
	}
	return node
}

module.exports = { _makeConnections }

const { _makeConnections } = require('./make-connections')

const pipe = async (nodes) => await _makeConnections(nodes[0], nodes.slice(1))

module.exports = { pipe }

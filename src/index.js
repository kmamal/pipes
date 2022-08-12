const operators = require('./operators')
const sinks = require('./sinks')
const sources = require('./sources')

module.exports = {
	operators,
	sinks,
	sources,
	...operators,
	...sinks,
	...sources,
	...require('./node'),
	...require('./pipeline'),
}

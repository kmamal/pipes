const { reduce } = require('./reduce')

const collect = () => reduce((a, c) => {
	a.push(c)
	return a
}, [])

module.exports = { collect }

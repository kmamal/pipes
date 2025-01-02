const { reduce } = require('./reduce')
const { transform } = require('./transform')

const collectArray = () => reduce((parts, value) => {
	parts.push(value)
	return parts
}, [])

const collectString = () => [
	transform((str) => [ str ]),
	reduce((parts, value) => {
		parts.push(value)
		return parts
	}, []),
	transform((parts) => [ parts.join('') ]),
]

const collectBuffer = () => [
	transform((buf) => [ buf ]),
	reduce((parts, value) => {
		parts.push(value)
		return parts
	}, []),
	transform((parts) => [ Buffer.concat(parts) ]),
]

module.exports = {
	collectArray,
	collectString,
	collectBuffer,
}

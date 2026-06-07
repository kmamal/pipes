const { reduce } = require('./reduce')
const { transform } = require('./transform')

const collectArray = () => reduce((parts, value) => {
	parts.push(value)
	return parts
}, [])

const collectString = () => [
	transform((str) => [ str ]),
	collectArray(),
	transform((parts) => [ parts.join('') ]),
]

const collectBuffer = () => [
	transform((buf) => [ buf ]),
	collectArray(),
	transform((parts) => [ Buffer.concat(parts) ]),
]

module.exports = {
	collectArray,
	collectString,
	collectBuffer,
}

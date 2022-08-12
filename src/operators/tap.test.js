const { test } = require('@kmamal/testing')
const { TapNode } = require('./tap')
const { fromIterable } = require('../sources/from-iterable')
const { pipeline } = require('../pipeline')

test('operators.tap', async (t) => {
	t.expect(3)
	let i = 0

	await pipeline([
		fromIterable([ 1, 2, 3 ]),
		new TapNode((x) => {
			t.equal(x, ++i)
		}),
	])
})

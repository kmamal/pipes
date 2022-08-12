const { test } = require('@kmamal/testing')
const { fromIterable } = require('../sources/from-iterable')
const { EagerNode } = require('./eager')
const { ReduceNode } = require('./reduce')
const { pipeline } = require('../pipeline')

test('operators.reduce', async (t) => {
	t.equal(
		await pipeline([
			fromIterable([ 1, 2, 3 ]),
			new EagerNode(),
			new ReduceNode((a, c) => a + c),
		]),
		6,
	)
})

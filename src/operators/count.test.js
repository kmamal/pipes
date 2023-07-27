const { test } = require('@kmamal/testing')
const { count } = require('./count')
const { fromIterable } = require('../sources/from-iterable')
const { pipeline } = require('../pipeline')

test("operators.count", async (t) => {
	t.equal(await pipeline([
		fromIterable([ 1, 2, 3, 1, 2, 3 ]),
		count(),
	]), 6)
})

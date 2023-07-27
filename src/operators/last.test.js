const { test } = require('@kmamal/testing')
const { last } = require('./last')
const { fromIterable } = require('../sources/from-iterable')
const { pipeline } = require('../pipeline')

test("operators.last", async (t) => {
	t.equal(await pipeline([
		fromIterable([ 1, 2, 3 ]),
		last(),
	]), 3)
})

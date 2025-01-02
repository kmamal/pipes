const { test } = require('@kmamal/testing')
const { map } = require('./map')
const { collectArray } = require('./collect')
const { fromIterable } = require('../sources/from-iterable')
const { pipeline } = require('../pipeline')

test("operators.map", async (t) => {
	t.equal(await pipeline([
		fromIterable([ 1, 2, 3 ]),
		map((x) => 2 * x),
		collectArray(),
	]), [ 2, 4, 6 ])
})

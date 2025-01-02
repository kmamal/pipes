const { test } = require('@kmamal/testing')
const { filter } = require('./filter')
const { fromIterable } = require('../sources/from-iterable')
const { collectArray } = require('./collect')
const { pipeline } = require('../pipeline')

test("operators.filter", async (t) => {
	t.equal(await pipeline([
		fromIterable([ 1, 2, 3 ]),
		filter((x) => x % 2 !== 0),
		collectArray(),
	]), [ 1, 3 ])
})

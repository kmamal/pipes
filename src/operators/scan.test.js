const { test } = require('@kmamal/testing')
const { scan } = require('./scan')
const { collectArray } = require('./collect')
const { fromIterable } = require('../sources/from-iterable')
const { pipeline } = require('../pipeline')

test("operators.scan", async (t) => {
	t.equal(await pipeline([
		fromIterable([ 1, 2, 3 ]),
		scan((a, c) => a + c),
		collectArray(),
	]), [ 1, 3, 6 ])
})

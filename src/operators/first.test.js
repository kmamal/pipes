const { test } = require('@kmamal/testing')
const { first } = require('./first')
const { debug } = require('./debug')
const { fromIterable } = require('../sources/from-iterable')
const { pipeline } = require('../pipeline')

test("operators.first", async (t) => {
	t.equal(await pipeline([
		fromIterable([ 1, 2, 3 ]),
		debug("b"),
		first(),
		debug("a"),
	]), 1)
})

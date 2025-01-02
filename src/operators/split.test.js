const { test } = require('@kmamal/testing')
const { split } = require('./split')
const { collectArray } = require('./collect')
const { fromString } = require('../sources/from-string')
const { pipeline } = require('../pipeline')

test("operators.split", async (t) => {
	t.equal(await pipeline([
		fromString('foo bar baz'),
		split(' '),
		collectArray(),
	]), [ 'foo', 'bar', 'baz' ])
})

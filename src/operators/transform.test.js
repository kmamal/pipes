const { test } = require('@kmamal/testing')
const { transform } = require('./transform')
const { fromString } = require('../sources/from-string')
const { collectString } = require('./collect')
const { pipeline } = require('../pipeline')

test("operators.transform", async (t) => {
	t.equal(await pipeline([
		fromString('foo bar baz'),
		transform((s) => s.split('').reverse().join('')),
		collectString(),
	]), 'zab rab oof')
})

const { test } = require('@kmamal/testing')
const { empty } = require('./empty')
const { collectArray } = require('../operators/collect')
const { pipeline } = require('../pipeline')

test("sources.empty", async (t) => {
	t.equal(await pipeline([
		empty(),
		collectArray(),
	]), [])
})

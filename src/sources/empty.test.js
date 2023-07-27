const { test } = require('@kmamal/testing')
const { empty } = require('./empty')
const { collect } = require('../operators/collect')
const { pipeline } = require('../pipeline')

test("sources.empty", async (t) => {
	t.equal(await pipeline([
		empty(),
		collect(),
	]), [])
})

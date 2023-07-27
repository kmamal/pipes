const { test } = require('@kmamal/testing')
const { tee } = require('./tee')
const { fromIterable } = require('../sources/from-iterable')
const { collect } = require('../operators/collect')
const { pipe } = require('../pipe')
const { pipeline } = require('../pipeline')

test("sinks.tee", async (t) => {
	const teeNode = await pipe([
		fromIterable([ 1, 2, 3 ]),
		tee(),
	])

	const pipeline1 = pipeline([
		teeNode.makeSource(),
		collect(),
	])

	const pipeline2 = pipeline([
		teeNode.makeSource(),
		collect(),
	])

	t.equal(await pipeline1, [ 1, 2, 3 ])
	t.equal(await pipeline2, [ 1, 2, 3 ])
})

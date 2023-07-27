const { test } = require('@kmamal/testing')
const { concat } = require('./concat')
const { fromIterable } = require('./from-iterable')
const { collect } = require('../operators/collect')
const { pipeline } = require('../pipeline')

test("sources.concat", async (t) => {
	t.equal(await pipeline([
		concat([
			fromIterable([ 1, 2, 3 ]),
			fromIterable([ 4, 5, 6 ]),
		]),
		collect(),
	]), [ 1, 2, 3, 4, 5, 6 ])
})

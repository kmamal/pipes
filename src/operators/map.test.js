const { test } = require('@kmamal/testing')
const { MapNode } = require('./map')
const { ScanNode } = require('./scan')
const { fromIterable } = require('../sources/from-iterable')
const { pipeline } = require('../pipeline')

test('operators.map', async (t) => {
	t.equal(
		await pipeline([
			fromIterable([ 1, 2, 3 ]),
			new MapNode((x) => 2 * x),
			new ScanNode((a, c) => {
				a.push(c)
				return a
			}, []),
		]),
		[ 2, 4, 6 ],
	)
})

const { test } = require('@kmamal/testing')
const { ScanNode } = require('./scan')
const { fromIterable } = require('../sources/from-iterable')
const { pipeline } = require('../pipeline')

test('operators.scan', async (t) => {
	t.equal(
		await pipeline([
			fromIterable([ 1, 2, 3 ]),
			new ScanNode((a, c) => a + c),
			new ScanNode((a, c) => {
				a.push(c)
				return a
			}, []),
		]),
		[ 1, 3, 6 ],
	)
})

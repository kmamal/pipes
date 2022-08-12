const { test } = require('@kmamal/testing')
const { FilterNode } = require('./filter')
const { TapNode } = require('./tap')
const { fromIterable } = require('../sources/from-iterable')
const { ScanNode } = require('./scan')
const { pipeline } = require('../pipeline')

test('operators.filter', async (t) => {
	t.equal(
		await pipeline([
			fromIterable([ 1, 2, 3 ]),
			new TapNode(console.log),
			new FilterNode((x) => x % 2 !== 0),
			new ScanNode((a, c) => {
				a.push(c)
				return a
			}, []),
		]),
		[ 1, 3 ],
	)
})

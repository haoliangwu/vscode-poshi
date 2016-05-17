import { assert } from 'chai'
import * as helper from '../../completion/CompletionHelper'

describe('CompletionHelper', function () {
  it('parseCommandSegments(text)', () => {
    const text = `<command name="foo"><command/>
    <command name="bar"><command/>
    <command name="baz"><command/>`

    assert.deepEqual(helper.parseCommandSegments(text), ['foo', 'bar', 'baz'])
  })

  it('parseLocatorSegments(text)', () => {
    const text = `
<tr>
	<td>foo</td>
	<td>1</td>
	<td></td>
</tr>
<tr>
	<td>bar</td>
	<td>2</td>
	<td></td>
</tr>
<tr>
	<td>baz</td>
	<td>3</td>
	<td></td>
</tr>`

    assert.deepEqual(helper.parseLocatorSegments(text), [['foo', '1'], ['bar', '2'], ['baz', '3']])
  })
})

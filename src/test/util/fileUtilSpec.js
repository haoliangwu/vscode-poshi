import { assert } from 'chai'
import * as fileUtil from '../../util/fileUtil'

describe('fileUtil', function () {
  it('getExtName(wholeName)', () => {
    const wholeName = 'foo.bar'

    assert.equal(fileUtil.getFileName(wholeName), 'foo')
  })

  it('getFileName(wholeName)', () => {
    const wholeName = 'foo.bar'

    assert.equal(fileUtil.getExtName(wholeName), 'bar')
  })

  it('getChangeTextByCursor', () => {
    const lineText = '<execute function="Type" locator1="PGLogin#EMAIL_ADDRESS_FIELD" value1="${userEmailAddress}" />'
    const _ = fileUtil.getChangeTextByCursor

    assert.equal(_(lineText, 24), undefined)

    assert.equal(_(lineText, 18), undefined)
    assert.equal(_(lineText, 19), 'function="Type"')
    assert.equal(_(lineText, 23), 'function="Type"')
    assert.equal(_(lineText, 24), undefined)
  })

  it('parseIndexSyntaxSegment()', () => {
    const segment1 = 'foo#bar'
    const segment2 = 'baz'
    const segment3 = 'foo#'
    const segment4 = ''

    const _ = fileUtil.parseIndexSyntaxSegment

    assert.equal(_(segment1), 'foo')
    assert.equal(_(segment2), 'baz')
    assert.equal(_(segment3), 'foo')
    assert.equal(_(segment4), '')
  })
})

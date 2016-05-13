import { assert } from 'chai'
import * as fileUtil from '../../util/fileUtil'

describe('fileUtil', function () {
  it('should return whole file name', () => {
    const uri = 'aaa/bbb/ccc/foo.bar'

    assert.equal(fileUtil.getWholeName(uri), 'foo.bar')
  })

  it('should return file name', () => {
    const wholeName = 'foo.bar'

    assert.equal(fileUtil.getFileName(wholeName), 'foo')
  })

  it('should return ext name', () => {
    const wholeName = 'foo.bar'

    assert.equal(fileUtil.getExtName(wholeName), 'bar')
  })
})

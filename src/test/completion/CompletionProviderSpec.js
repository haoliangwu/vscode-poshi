import * as completion from '../../completion/CompletionProvider'

describe('CompletionProvider', function () {
  it('init()', () => {
    const settings = {
      poshi: {
        liferay: {
          home: '/home/lyon/liferay/portal/portal-6210'
        },
        project: {
          home: '/portal-web/test/functional/com/liferay/portalweb'
        }
      }
    }

    completion.init(settings)
  })
})

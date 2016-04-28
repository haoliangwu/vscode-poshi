import { mappingLocator, initMappingLocator, initMapping } from '../util/mappingUtil'

const mockData = {
  url: '/home/lyon/liferay/portal/portal-6210/portal-web/test/functional/com/liferay/portalweb'
}

initMapping(mockData.url)

setTimeout(() => {
  initMappingLocator()
}, 2000)

setTimeout(() => {
  console.log(mappingLocator['CPCategoriesAdd'].get('SAVE_BUTTON'))
}, 4000)

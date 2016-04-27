import { mappingVar, initMappingVar, initMapping } from '../util/mappingUtil'

const mockData = {
  url: '/home/lyon/liferay/portal/portal-6210/portal-web/test/functional/com/liferay/portalweb'
}

initMapping(mockData.url)

setTimeout(() => {
  initMappingVar()
}, 2000)

setTimeout(() => {
  console.log(mappingVar.testcase.get('PGCalendar'))
}, 4000)

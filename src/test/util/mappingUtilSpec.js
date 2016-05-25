import { assert } from 'chai'
import { mapping, mappingLocator, mappingMacroVars, initMapping } from '../../util/mappingUtil'

const baseURL = '/home/lyon/liferay/portal/the-poshi-6.2.10/portal-web/test/functional/com/liferay/portalweb'

before(() => {
  return initMapping({url: baseURL})
})

describe('utilMapping', function () {
  it('mapping', () => {
    const target1 = `${baseURL}/functions/AddSelection.function`
    const target2 = `${baseURL}/macros/AkismetPortlet.macro`
    const target3 = `${baseURL}/tests/enduser/calendar/pgcalendar/PGCalendar.testcase`
    const target4 = `${baseURL}/tests/enduser/calendar/pgcalendar/block/action/PGCalendar.path`

    assert.equal(mapping['function'].get('AddSelection').uri, target1)
    assert.equal(mapping['macro'].get('AkismetPortlet').uri, target2)
    assert.equal(mapping['testcase'].get('PGCalendar').uri, target3)
    assert.equal(mapping['path'].get('PGCalendar').uri, target4)
  })

  it('mappingLocator', () => {
    const map1 = mappingLocator['PGCalendar']
    const target1 = "//button[contains(@class,'btn') and contains(@class,'btn-primary') and contains(@class,'calendar-add-event-btn')]"

    assert.equal(map1.get('ADD_EVENT_BUTTON'), target1)
  })

  it('mappingMacroVars', () => {
    const map1 = mappingMacroVars['Page']
    const map2 = mappingMacroVars['CalendarConfiguration']
    const target1 = ['portletName', 'friendlyURL', 'pageAccess', 'pageStaging', 'siteName', 'siteNameURL', 'siteURL', 'specificURL', 'virtualHostsURL']
    const target2 = []

    assert.deepEqual(map1.get('gotoCP'), target1)
    assert.deepEqual(map2.get('save'), target2)
  })
})

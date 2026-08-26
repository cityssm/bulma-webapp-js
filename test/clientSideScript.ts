import type { CityssmGlobal } from '../src/types.js'

declare const cityssm: CityssmGlobal

interface TestResponse {
  test: string
}

;(() => {
  cityssm.postJSON<TestResponse>('/test/postJSON', {}, (responseJSON) => {
    // eslint-disable-next-line no-console
    console.log(responseJSON.test)
  })
})()

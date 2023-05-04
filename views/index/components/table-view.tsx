import { computed, defineComponent, ref, watch } from 'vue'
import xmljs from 'xml-js'

import { useApp } from '../hooks/app'

import './table-view.styl'
import { useFileList } from '../hooks/file-list'

const TableView = defineComponent({
  name: 'TableView',
  setup () {
    const { fileIndexRef } = useApp()
    const { fileListRef } = useFileList()

    const reswDataRef = ref<Record<string, xmljs.Element>>({})

    const loadFileContent = async (index: number) => {
      const result = await fetch('/file/' + index)
        .then(item => item.json() as Promise<Record<string, string>>)

      for (const lang of Object.keys(result)) {
        const xmlStr = result[lang]
        const xmlObj = xmljs.xml2js(xmlStr)
        reswDataRef.value[lang] = xmlObj as xmljs.Element
      }

      console.log(reswDataRef.value)
    }

    const langList = computed(() => {
      return Object.keys(reswDataRef.value)
    })

    const reswKeyList = computed(() => {
      const firstLang = Object.keys(reswDataRef.value)[0]
      const firstLangObj = reswDataRef.value[firstLang]
      const rootElement = firstLangObj?.elements?.[0]
      if (!rootElement) {
        return []
      }

      const dataElement = rootElement.elements
        ?.filter(item => item.name === 'data') ?? []

      return dataElement.map(item => item.attributes?.name ?? '<UNAVAILABLE>')
    })

    const getValue = (lang: string, key: string): string => {
      const langObj = reswDataRef.value[lang]
      const rootElement = langObj?.elements?.[0]
      if (!rootElement) {
        return ''
      }

      const dataElement = rootElement.elements
        ?.find(item => item.name === 'data' && item.attributes?.name === key)
      if (!dataElement) {
        return ''
      }

      const value = dataElement.elements?.[0]?.elements?.[0]?.text ?? '<UNAVAILABLE>'
      return value as string
    }

    const updateText = (lang: string, key: string, value: string) => {
      const langObj = reswDataRef.value[lang]
      const rootElement = langObj?.elements?.[0] ?? {
        elements: [],
        name: 'root',
        type: 'element'
      }

      let dataElement = rootElement.elements
        ?.find(item => item.name === 'data' && item.attributes?.name === key)

      if (!dataElement) {
        dataElement = {
          attributes: { name: key, 'xml:space': 'preserve' },
          elements: [],
          name: 'data',
          type: 'element'
        }
        rootElement?.elements?.push(dataElement)
      }

      let valueElement = dataElement.elements?.[0]?.elements?.[0]
      if (!valueElement) {
        valueElement = {
          type: 'text',
          text: value
        }
        dataElement?.elements?.push({
          name: 'value',
          type: 'element',
          elements: [valueElement]
        })
      } else {
        if (valueElement.text === value) {
          return
        }
        valueElement.text = value
      }

      console.log(langObj)
      const filename = fileListRef.value[fileIndexRef.value]
      return submitSingleLangChanges(lang, filename)
    }

    const submitSingleLangChanges = async (lang: string, filename: string) => {
      const langObj = reswDataRef.value[lang]
      const xmlStr = xmljs.js2xml(langObj, {
        spaces: 2
      })

      try {
        await fetch('/file/update', {
          method: 'POST',
          body: JSON.stringify({
            filename,
            lang,
            xmlStr
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.error(error)
        alert('Exception! ' + (error as Error).message)
      }
    }

    watch(fileIndexRef, async (fileIndex) => {
      await loadFileContent(fileIndex)
    })

    const Content = () => {
      if (fileIndexRef.value < 0) {
        return <div class='table-view dp-flex align-center justify-center border-box'>Please select a file first.</div>
      }

      return (
        <div class='table-view border-box over-auto'>
          <div>
            <button>➕ Add new record</button>
          </div>

          <table class='data-table'>
            <thead>
            <tr>
              <td style='width: 10px'></td>
              <td style='width: 10px'>Key</td>
              { Object.keys(reswDataRef.value).map(lang => <td>{lang}</td>) }
            </tr>
            </thead>
            <tbody>
              {
                reswKeyList.value.map(key => (
                  <tr>
                    <td>
                      <button>❌</button>
                    </td>
                    <td>{key}</td>
                    {
                      langList.value.map(lang => (
                        <td>
                          <textarea
                            class='w-100'
                            style='margin-top: 10px'
                            value={getValue(lang, key as string)}
                            onBlur={async event => {
                              const target = event.target as HTMLTextAreaElement
                              const newValue = target.value.trim()
                              target.disabled = true
                              await updateText(lang, key as string, newValue)
                              target.disabled = false
                            }}
                          />
                        </td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )
    }

    return () => (
      <Content />
    )
  }
})

export {
  TableView
}

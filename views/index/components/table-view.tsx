import { computed, defineComponent, ref, watch } from 'vue'
import xmljs from 'xml-js'

import { useApp } from '../hooks/app'
import { useFileList } from '../hooks/file-list'

import './table-view.styl'

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

    const currentFilename = computed(() => {
      return fileListRef.value[fileIndexRef.value]
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

      return dataElement.map(item => item.attributes?.name ?? '')
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

      const value = dataElement.elements?.[0]?.elements?.[0]?.text ?? ''
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

      return submitSingleLangChanges(lang, currentFilename.value)
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

    const onTextareaBlur = async (event: FocusEvent, lang: string, key: string) => {
      const target = event.target as HTMLTextAreaElement
      const newValue = target.value.trim()
      target.disabled = true
      await updateText(lang, key, newValue)
      target.disabled = false
    }

    const onAddRecordButtonClick = async () => {
      const key = window.prompt('Please provide a key:')
      if (!key) {
        return
      }

      for (const lang of Object.keys(reswDataRef.value)) {
        const langObj = reswDataRef.value[lang]
        langObj.elements?.[0]?.elements?.push({
          attributes: {
            name: key,
            'xml:space': 'preserve'
          },
          elements: [{
            type: 'element',
            name: 'value',
            elements: [
              { type: 'text', text: 'Put your text here' }
            ]
          }],
          name: 'data',
          type: 'element'
        })

        await submitSingleLangChanges(lang, currentFilename.value)
      }

      await loadFileContent(fileIndexRef.value)
    }

    const removeKey = async (key: string) => {
      for (const lang of Object.keys(reswDataRef.value)) {
        const langObj = reswDataRef.value[lang]
        const targetIndex = langObj.elements?.[0]?.elements?.findIndex(item => item.attributes?.name === key) ?? -1
        if (targetIndex > -1) {
          langObj.elements?.[0]?.elements?.splice(targetIndex, 1)
        }
        await submitSingleLangChanges(lang, currentFilename.value)
      }

      await loadFileContent(fileIndexRef.value)
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
            <button onClick={onAddRecordButtonClick}>➕ Add new record</button>
          </div>

          <table class='data-table'>
            <thead>
              <tr>
                <td></td>
                <td style='width: 10px'>Key</td>
                { Object.keys(reswDataRef.value).map(lang => <td>{lang}</td>) }
              </tr>
            </thead>
            <tbody>
              {
                reswKeyList.value.map(key => (
                  <tr>
                    <td class='t-center'>
                      <button onClick={async event => {
                        const target = event.target as HTMLButtonElement
                        target.disabled = true
                        await removeKey(key as string)
                        target.disabled = false
                      }}>❌</button>
                    </td>
                    <td>{key}</td>
                    {
                      langList.value.map(lang => (
                        <td>
                          <textarea
                            class='w-100'
                            style='margin-top: 10px'
                            value={getValue(lang, key as string)}
                            onBlur={event => onTextareaBlur(event, lang, key as string)}
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

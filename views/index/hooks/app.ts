import { computed, ref } from 'vue'
import xmljs from 'xml-js'

const filenameRef = ref<string>('')
const reswDataRef = ref<Record<string, xmljs.Element>>({})

const switchFile = (filename: string) => {
  filenameRef.value = filename
  return loadFileContent(filename)
}

const loadFileContent = async (filename: string) => {
  const result = await fetch('/file/' + filename)
    .then(item => item.json() as Promise<Record<string, string>>)

  for (const lang of Object.keys(result)) {
    const xmlStr = result[lang]
    const xmlObj = xmljs.xml2js(xmlStr)
    reswDataRef.value[lang] = xmlObj as xmljs.Element
  }

  console.log(reswDataRef.value)
}

const reload = () => {
  const filename = filenameRef.value
  return loadFileContent(filename)
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

  return submitSingleLangChanges(lang, filenameRef.value)
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

const removeKey = async (key: string) => {
  for (const lang of Object.keys(reswDataRef.value)) {
    const langObj = reswDataRef.value[lang]
    const targetIndex = langObj.elements?.[0]?.elements?.findIndex(item => item.attributes?.name === key) ?? -1
    if (targetIndex > -1) {
      langObj.elements?.[0]?.elements?.splice(targetIndex, 1)
    }
    await submitSingleLangChanges(lang, filenameRef.value)
  }

  await loadFileContent(filenameRef.value)
}

const translateKeyByGpt = async (key: string) => {
  const content = window.prompt('Please enter the text:')
  if (!content) {
    return
  }

  const result = await fetch('/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: content
    })
  }).then(item => item.json() as Promise<Record<string, string>>)

  for (const lang of Object.keys(result)) {
    const value = result[lang]
    await updateText(lang, key, value)
  }

  await reload()
}

const useApp = () => {
  return {
    filenameRef,
    reswDataRef,
    langList,
    reswKeyList,
    loadFileContent,
    switchFile,
    getValue,
    updateText,
    submitSingleLangChanges,
    removeKey,
    reload,
    translateKeyByGpt
  }
}

export {
  useApp
}

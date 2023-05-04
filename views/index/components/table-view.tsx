import { defineComponent } from 'vue'

import { useApp } from '../hooks/app'

import './table-view.styl'

const TableView = defineComponent({
  name: 'TableView',
  setup () {
    const {
      filenameRef, reswDataRef,
      langList, reswKeyList,
      loadFileContent, getValue, updateText, submitSingleLangChanges,
      removeKey
    } = useApp()

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

        await submitSingleLangChanges(lang, filenameRef.value)
      }

      await loadFileContent(filenameRef.value)
    }

    const onRemoveButtonClick = async (event: Event, key: string) => {
      if (!window.confirm(`You are going to remove "${key}"`)) {
        return
      }
      const target = event.target as HTMLButtonElement
      target.disabled = true
      await removeKey(key)
      target.disabled = false
    }

    const PlaceHolder = () => (
      <div class='table-view dp-flex align-center justify-center border-box'>Please select a file first.</div>
    )

    const ActionBar = () => (
      <div>
        <button onClick={onAddRecordButtonClick}>➕ Add new record</button>
      </div>
    )

    const TableHeader = () => (
      <thead>
        <tr>
          <td></td>
          <td style='width: 10px'>Key</td>
          { Object.keys(reswDataRef.value).map(lang => <td>{lang}</td>) }
        </tr>
      </thead>
    )

    const TableBody = () => (
      <tbody>{
        reswKeyList.value.map(key => (
          <tr>
            <td class='t-center'>
              <button onClick={event => onRemoveButtonClick(event, key as string)}>❌
              </button>
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
      }</tbody>
    )

    return () => {
      if (!filenameRef.value) {
        return <PlaceHolder />
      }

      return (
        <div class='table-view border-box over-auto'>
          <ActionBar />

          <table class='data-table'>
            <TableHeader />
            <TableBody />
          </table>
        </div>
      )
    }
  }
})

export {
  TableView
}

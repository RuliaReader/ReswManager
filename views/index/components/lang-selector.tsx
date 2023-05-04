import { defineComponent } from 'vue'

import './lang-selector.styl'
import { useFileList } from '../hooks/file-list'
import { useApp } from '../hooks/app'

const LangSelector = defineComponent({
  setup () {
    const { fileListRef } = useFileList()
    const { filenameRef, switchFile } = useApp()

    return () => (
      <div class='lang-selector'>
        <div>
          { fileListRef.value.map((item) => (
            <button
              class={[
                'lang-button',
                filenameRef.value === item ? 'selected' : null
              ]}
              onClick={() => switchFile(item)}
            >{item}</button>
          )) }
        </div>
      </div>
    )
  }
})

export {
  LangSelector
}

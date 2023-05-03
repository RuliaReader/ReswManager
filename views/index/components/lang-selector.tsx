import { defineComponent } from 'vue'

import './lang-selector.styl'
import { useFileList } from '../hooks/file-list'
import { useApp } from '../hooks/app'

const LangSelector = defineComponent({
  setup () {
    const { fileListRef } = useFileList()
    const { fileIndexRef, switchFile } = useApp()

    return () => (
      <div class='lang-selector'>
        <div>
          { fileListRef.value.map((item, index) => (
            <button
              class={[
                'lang-button',
                fileIndexRef.value === index ? 'selected' : null
              ]}
              onClick={() => switchFile(index)}
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

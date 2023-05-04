import { defineComponent, PropType } from 'vue'

import './gpt-result-selector.styl'

const GptResultSelector = defineComponent({
  name: 'GptResultSelector',

  props: {
    translation: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({})
    },
    currentKey: {
      type: String as PropType<string>,
      default: ''
    }
  },

  emits: ['select', 'close', 'selectAll'],

  setup (props, { emit }) {
    const onTakeButtonClicked = (lang: string) => {
      emit('select', {
        lang,
        text: props.translation[lang],
        key: props.currentKey
      })
    }

    const onTakeAllButtonClicked = () => {
      emit('selectAll', {
        translation: props.translation,
        key: props.currentKey
      })
    }

    const onCloseButtonClick = () => {
      emit('close')
    }

    return () => (
      <div class='gpt-result-selector dp-flex align-center justify-center w-100 h-100 p-absolute p-zero'>
        <div class='panel'>
          <h2 style='margin: 0'>GPT translation result:</h2>
          <div style='margin-top: 10px'>{
            Object.keys(props.translation).map(lang => (
              <div class='result-item'>
                <button class='v-middle' onClick={() => onTakeButtonClicked(lang)}>Take it</button>
                <span class='translation-text v-middle'>{lang}: {props.translation[lang]}</span>
              </div>
            ))
          }</div>
          <div>
            <button onClick={onTakeAllButtonClicked}>Take all</button>
            <button style='margin-left: 10px' onClick={onCloseButtonClick}>Close</button>
          </div>
        </div>
      </div>
    )
  }
})

export {
  GptResultSelector
}

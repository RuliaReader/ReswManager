import { ref } from 'vue'

const isDisplayRef = ref(false)
const translationRef = ref<Record<string, string>>({})
const keyRef = ref<string>('')

const openDialog = (translation: Record<string, string>, key: string) => {
  translationRef.value = translation
  keyRef.value = key
  isDisplayRef.value = true
}

const closeDialog = () => {
  isDisplayRef.value = false
}

const useGptResultSelector = () => {
  return {
    isDisplayRef,
    translationRef,
    keyRef,
    openDialog,
    closeDialog
  }
}

export {
  useGptResultSelector
}

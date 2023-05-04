import { ref } from 'vue'

const fileListRef = ref<string[]>([])
const inLoadingRef = ref(false)

const mutate = () => {
  if (inLoadingRef.value) {
    return
  }

  inLoadingRef.value = true
  fetch('/file/list')
    .then(item => item.json())
    .then(response => {
      fileListRef.value = response as string[]
      inLoadingRef.value = false
    })
}

const useFileList = () => {
  mutate()

  return {
    fileListRef,
    inLoadingRef,
    mutate
  }
}

export {
  useFileList
}

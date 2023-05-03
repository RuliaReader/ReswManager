import { ref } from 'vue'

const fileListRef = ref<string[]>([])

const useFileList = () => {
  fetch('/file-list')
    .then(item => item.json())
    .then(response => {
      fileListRef.value = response as string[]
    })

  return {
    fileListRef
  }
}

export {
  useFileList
}

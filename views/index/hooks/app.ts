import { ref } from 'vue'

const fileIndexRef = ref<number>(-1)

const switchFile = (index: number) => {
  fileIndexRef.value = index
}

const useApp = () => {
  return {
    fileIndexRef,
    switchFile
  }
}

export {
  useApp
}

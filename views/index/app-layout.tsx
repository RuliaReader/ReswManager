import { defineComponent } from 'vue'
import { LangSelector } from './components/lang-selector'
import { TableView } from './components/table-view'

const AppLayout = defineComponent({
  name: 'AppLayout',
  setup () {
    return () => (
      <div class='app-container dp-flex p-absolute p-zero'>
        <LangSelector />
        <TableView />
      </div>
    )
  }
})

export {
  AppLayout
}

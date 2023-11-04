import { defineComponent } from 'vue'
import { FileSelector } from './components/file-selector'
import { TableView } from './components/table-view'

const AppLayout = defineComponent({
  name: 'AppLayout',

  setup () {
    return () => (
      <div class='app-container dp-flex flex-column p-absolute p-zero'>
        {/* <div class='app-title-bar'>ACTION_BAR</div> */}
        <div class='main-content dp-flex over-hidden'>
          <FileSelector />
          <TableView />
        </div>
      </div>
    )
  }
})

export {
  AppLayout
}

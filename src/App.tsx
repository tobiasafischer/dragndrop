import './styles.css'
import { Board, DragDropProvider } from './components'
import { api } from './assets'

const App: React.FC = () => (
   <div className="App">
      <DragDropProvider data={api.columns}>
         <Board />
      </DragDropProvider>
   </div>
)
export default App

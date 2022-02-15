import React from 'react'
import { api } from './assets'
import { Board, DragDropProvider } from './components'
import './styles.css'

const App: React.FC = () => (
   <div className="App">
      <DragDropProvider data={api.columns}>
         <Board />
      </DragDropProvider>
   </div>
)
export default App

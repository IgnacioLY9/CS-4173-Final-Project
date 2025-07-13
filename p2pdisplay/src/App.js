import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import {Messaging} from './Pages/Messaging'
import { Login } from './Pages/Login'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Login/>}/>
        <Route path="/Messaging" element = {<Messaging/>}/>
      </Routes>
    </BrowserRouter>
  )

}

export default App
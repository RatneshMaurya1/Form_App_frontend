import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import CreateForm from './pages/CreateForm/CreateForm'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/create' element={<CreateForm/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

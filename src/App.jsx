import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import CreateForm from './pages/CreateForm/CreateForm'
import { Toaster } from 'react-hot-toast'
import ViewForm from './pages/ViewForm/ViewForm'
import EditForm from './pages/EditForm/EditForm'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/create' element={<CreateForm/>} />
      <Route path='/View/:id' element={<ViewForm/>} /> 
      <Route path='/edit/:id' element={<EditForm/>} />
    </Routes>
    <Toaster/>
    </BrowserRouter>
    </>
  )
}

export default App

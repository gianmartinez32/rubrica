import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './screens/Login/Login'
import Home from './screens/Home/Home'
import Details from './screens/Details/Details'
import Sell from './screens/Sell/Sell'
import Product from './screens/Product/Product'

function App() {
  const { authState } = useAuth()

  return (
    <>
     <Routes>
     {
      !authState?.authenticated ? 
      <Route path='*' Component={Login}/> :
      <>
      <Route path='/home' Component={Home}/>
      <Route path='/detail' Component={Details}/>
      <Route path='/sell' Component={Sell}/>
      <Route path='/product' Component={Product}/>
      <Route path='/*' Component={Home}/>
      </>
     }
     </Routes>
    </>
  )
}

export default App

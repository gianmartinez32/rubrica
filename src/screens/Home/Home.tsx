import React from 'react'
import {Typography, Button} from 'antd'
import {  useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'
import { Roles } from '../../utils/constants'


const Home = () => {
    const navigate = useNavigate()
  const { authState } = useAuth()
  console.log(authState);

  return (
    <div className='card-user'>
        
        <Typography className='title-splash'>
            !Bienvenido! {authState.user.user.rol_id == Roles.ADMINISTRADOR ? 'Administrador ' : 'Asesor '} {authState?.user?.user?.nombre}
        </Typography>
        <Button className='btn-main1' onClick={()=>navigate('/detail')}>Ver información</Button>
       {authState.user.user.rol_id == Roles.ADMINISTRADOR  && <Button className='btn-main1' onClick={()=>navigate('/product')}>Productos</Button>}
        <Button className='btn-main1' onClick={()=>navigate('/sell')}>Ventas</Button>
    </div>
  )
}

export default Home
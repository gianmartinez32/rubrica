import { Typography } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Roles } from '../utils/constants'

const HeaderApp = () => {
  const { authState } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <Header className='header'>
      <div>
        <Typography className='title-header' onClick={()=>navigate('/home')}>Sistema POS</Typography>
      </div>
      <div className='links'>
        <Typography className={`item-navbar${location.pathname=='/sell' ?'-active':''}`} onClick={() => navigate('/sell')}>
          Ventas
        </Typography>
      {authState.user.user.rol_id == Roles.ADMINISTRADOR &&  <Typography  className={`item-navbar${location.pathname=='/product' ?'-active':''}`} onClick={() => navigate('/product')}>
          Productos
        </Typography>}
        <Typography  className={`item-navbar${location.pathname=='/detail' ?'-active':''}`} onClick={() => navigate('/detail')}>
          Información
        </Typography>
      </div>
    </Header>
  )
}

export default HeaderApp
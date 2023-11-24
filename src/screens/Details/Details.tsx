import { useEffect, useState } from "react"
import { Row, Col, notification, Typography, Button, Spin } from 'antd'
import axios from 'axios'
import { UserOutlined } from '@ant-design/icons'
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie';
import server from "../../utils/server"



const Details = () => {
  const { onLogout } = useAuth()
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)

  const [infoUser, setInfoUser] = useState<{
    nombre: string,
    correo: string
  }>({
    correo: '',
    nombre: ''
  })
  useEffect(() => {
    const getDatos = async () => {
      try {
        const token = Cookies.get('token')
        const config = {
            headers: {
              Authorization: `${token}`,
              'content-type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            withCredentials: true,
          };
        if (token) {
          axios.defaults.headers.common['Authorization'] = token
        }
        setloading(true)
        const response = await axios.get(server.HOST+'/user',config)
        setInfoUser(response.data)
        setloading(false)

      } catch (error: any) {
        if (error.response.status === 401) {
          notification.warning({
            message: error.response.data.message
          })
          onLogout()

        }
      }
    }
    getDatos()
  }, [])

  return (
    <Spin spinning={loading}>
      <Row justify={'center'} align={'top'} className="card-user">
        <Col xl={23} xxl={23} lg={23} md={23} sm={23} xs={23}>
          <Row align={'top'} justify={'center'} style={{ width: '100%' }}>
            <Col xl={23} xxl={23} lg={23} md={23} sm={23} xs={23} style={{display:'flex', justifyContent:'center'}}>
              <UserOutlined style={{
                fontSize: '7rem'
              }} />
            </Col>
            <Col xl={23} xxl={23} lg={23} md={23} sm={23} xs={23} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <Typography className="detail">
                Nombre:
              </Typography>
              <Typography className="detail">
                {infoUser.nombre}
              </Typography>
            </Col>
            <Col xl={23} xxl={23} lg={23} md={23} sm={23} xs={23} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <Typography className="detail">
                Correo:
              </Typography>
              <Typography className="detail">
                {infoUser.correo}
              </Typography>
            </Col>
            <Col xl={23} xxl={23} lg={23} md={23} sm={23} xs={23} style={{display:'flex', justifyContent:'center'}}>
              <Button className='btn-main1' onClick={() => navigate('/home')}>Volver</Button>
            </Col>
            <Col xl={23} xxl={23} lg={23} md={23} sm={23} xs={23} style={{display:'flex', justifyContent:'center'}}>
              <Button className='btn-main1' onClick={onLogout}>Cerrar sesión</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Spin>

  )
}

export default Details
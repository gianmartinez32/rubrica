import { Typography, Row, Col, Tabs } from "antd"
import './index.css'
import FormLogin from "./FormLogin"
import FormRegister from "./FormRegister"

const Login = () => {
    const TabsItem = [
        {
            label: <div className='contenedor-label-tab'> <Typography className='text-label-tab'>{'Iniciar sesión'}</Typography></div>,
            key: '2342',
            children: <FormLogin />
        },
        {
            label: <div className='contenedor-label-tab'> <Typography className='text-label-tab'>{'Registrate'}</Typography></div>,
            key: '2332',
            children: <FormRegister />
        },


    ]
  return (
    <Row justify={'center'} align={'top'} className="card-login" >
                <Col xl={23} xxl={23} lg={23} md={23} sm={23} xs={23}>
                    <Row align={'top'} justify={'center'}  style={{width:'100%'}}>
                        <Col xl={23} xxl={23} lg={23} md={23} sm={23} xs={23}>
                                <Tabs size='large'  style={{ width: '100%', alignSelf: 'center' }}rootClassName='tab-login' items={TabsItem} />
                        </Col>
                    </Row>
                </Col>
            </Row>
  )
}

export default Login
import {Form, Input, Button, Alert} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useAuth } from '../../context/AuthContext'
import {useState} from 'react'
import { validateEmail } from '../../utils/validations'
const FormLogin = () => {
    const [form] = useForm()
    const { onLogin } = useAuth()
    const [loading, setloading] = useState(false)
    const [showAlert, setShowAlert] = useState({
        show: false,
        type: 'success' as 'success' | 'warning' | 'error',
        message: ''
    })

    const onLoginFinish = async (fields:any) =>{
        setloading(true)
        const response = await onLogin(fields.correo, fields.contraseña)
        setloading(false)
        if(response?.error){
            setShowAlert({
                show: true,
                message: response.msg,
                type: 'error'
            })
        }
    }
    return (
    <Form
    form={form}
    onFinish={onLoginFinish}>
    <Form.Item  
        name='correo'
        rules={ [
            {
                validator: validateEmail
            }
        ]}
    >
        <Input placeholder='Correo electronico' className='input-login' />
    </Form.Item>
    <Form.Item
        name={'contraseña'}
    >
        <Input placeholder='Contraseña' type='password' className='input-login' />
    </Form.Item>
    {showAlert.show && <Form.Item>
                <Alert
                    type={showAlert.type}
                    message={showAlert.message}
                    closable
                    onClose={() =>{
                        setShowAlert((prev: any) => ({ ...prev, show: false }))
                        form.resetFields()
                    }}
                    showIcon />

            </Form.Item>}
    <Form.Item>
        <Button loading={loading} className='button-login' htmlType='submit' >Iniciar Sesión</Button>
    </Form.Item>
</Form>
  )
}

export default FormLogin
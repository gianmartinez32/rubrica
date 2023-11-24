import { Form, Input, Button, Alert } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { validateEmail } from '../../utils/validations'

const FormRegister = () => {
    const [form] = useForm()
    const { onRegister } = useAuth()
    const [loading, setloading] = useState(false)
    const [showAlert, setShowAlert] = useState({
        show: false,
        type: 'success' as 'success' | 'warning' | 'error',
        message: ''
    })

    const onRegisterFinish = async (fields: any) => {
        setloading(true)
        const response = await onRegister(fields.correo, fields.contraseña, fields.nombre)
        setloading(false)
        if (response?.error) {
            console.log('error', response);
            setShowAlert({
                show: true,
                message: response.msg,
                type: 'error'
            })
        } else {
            setShowAlert({
                show: true,
                message: response.data.message,
                type: 'success'
            })
        }
    }
    return (
        <Form
            form={form}
            onFinish={onRegisterFinish}>
            <Form.Item
                name='nombre'
            >
                <Input placeholder='Ingrese nombre de usuario' className='input-login' />
            </Form.Item>
            <Form.Item
                name={'correo'}
                rules={ [
                    {
                        validator: validateEmail
                    }
                ]}
            >
                <Input placeholder='Ingrese correo electronico' className='input-login' />
            </Form.Item>
            <Form.Item
                name={'contraseña'}
               
            >
                <Input placeholder='Contraseña'  type='password' className='input-login' />
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
                <Button loading={loading} disabled={showAlert.show} className='button-login' htmlType='submit' >Únete</Button>
            </Form.Item>
        </Form>
    )
}

export default FormRegister
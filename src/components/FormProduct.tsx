import { Button, Checkbox, Form, Input,  Typography, notification } from 'antd'
import { useForm } from 'antd/es/form/Form'
import axios from 'axios'
import  { useEffect,useState } from 'react'
import Cookies from 'js-cookie';
import { validateNumber } from '../utils/validations';
import server from '../utils/server';



interface IProps {
    record: any,
    onClose: () => void
}
const FormProduct = ({ record, onClose }: IProps) => {
    const [form] = useForm()
    const [observer, setObserver] = useState(true)
    const [loading, setLoading] = useState(false)

    const onFinish = async (fields: any) => {
        try {
            /*           if(!fields.telefono_cliente) fields.telefono_cliente = '00000000'
                      if(!fields.nombre_cliente) fields.nombre_cliente = 'Consumidor Final' */
            if (record) fields.Codigo = record.Codigo
            const token = Cookies.get('token')
            const config = {
                headers: {
                  Authorization: `${token}`,
                  'content-type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                withCredentials: true,
              };
              setLoading(true)
            const response = record ? await axios.put(server.HOST+'/products', fields,config) : await axios.post(server.HOST+'/products', fields, config)
            if (response.data.success) {
                notification.success({
                    message: response.data.message,
                })
                onClose()
                form.resetFields()
            } else {
                notification.warning({
                    message: response.data.message,
                })
            }
        } catch (error: any) {
            notification.error({
                message: error.response.data.message,
            })
        } finally{
            setLoading(false)
        }
    }



    useEffect(() => {
        if (record) {
            form.setFieldValue('Nombre', record.Nombre)
            form.setFieldValue('Descripcion', record.Descripcion)
            form.setFieldValue('Precio', record.Precio)
            form.setFieldValue('Cantidad_en_stock', record.Cantidad_en_stock)
            form.setFieldValue('permitir_stock_negativo', record.permitir_stock_negativo)
            setObserver(!observer)
        }else{

            form.resetFields()
            setObserver(!observer)

        }
    }, [record])

    return (
        <>
            <Typography className='title-form'>Producto</Typography>
            <Form
                form={form}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}

            >
                <Form.Item
                    name={'Nombre'}
                    label={'Producto'}
                    rules={[{required:true}]}
                >
                    <Input className='fieldForm' />

                </Form.Item>
                <Form.Item
                    name={'Descripcion'}
                    label={'Descripcion'}
                    rules={[{required:true}]}

                >
                    <Input className='fieldForm' />
                </Form.Item>
                <Form.Item
                    name={'Precio'}
                    label={'Precio'}
                    rules={[{required:true},{
                        validator:validateNumber
                    }]}

                >
                    <Input className='fieldForm' />
                </Form.Item>
                <Form.Item

                    name={'Cantidad_en_stock'}
                    label={'Cantidad en stock'}
                    rules={[{required:true},{
                        validator:validateNumber
                    }]}
                >
                    <Input onChange={() => {
                        setObserver(!observer)
                    }} className='fieldForm' />
                </Form.Item>
                <Form.Item
                    name={'permitir_stock_negativo'}
                    label={'Permitir stock negativo'}
                    valuePropName="checked"
                >
                    <Checkbox
                        defaultChecked={false}
                    />
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} className='btn-main1' style={{
                        width:'100%',
                    }} htmlType='submit'>Guardar</Button>
                </Form.Item>

            </Form>
        </>
    )
}

export default FormProduct
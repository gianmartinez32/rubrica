import { Button, Checkbox, Form, Input, Select, Typography, notification } from 'antd'
import { useForm } from 'antd/es/form/Form'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie';



interface IProps {
    record: any,
    onClose: () => void
}
const FormProduct = ({ record, onClose }: IProps) => {
    const [form] = useForm()
    const [observer, setObserver] = useState(true)

    const onFinish = async (fields: any) => {
        try {
            /*           if(!fields.telefono_cliente) fields.telefono_cliente = '00000000'
                      if(!fields.nombre_cliente) fields.nombre_cliente = 'Consumidor Final' */
            if (record) fields.Codigo = record.Codigo
            const token = Cookies.get('token')
            const config = {
                headers: {
                  Authorization: `${token}`,
                },
                withCredentials: true,
              };

            const response = record ? await axios.put('http://localhost:5000/products', fields,config) : await axios.post('http://localhost:5000/products', fields, config)
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
        }
    }



    useEffect(() => {
        /*      const loadProductos = async () => {
                 const response = await axios.get('http://localhost:5000/products')
                 if (response.data.success) {
                     setProductosBD(response.data.data)
                 }
             }
             loadProductos() */
        console.log('recording productos', record);
        if (record) {
            form.setFieldValue('Nombre', record.Nombre)
            form.setFieldValue('Descripcion', record.Descripcion)
            form.setFieldValue('Precio', record.Precio)
            form.setFieldValue('Cantidad_en_stock', record.Cantidad_en_stock)
            form.setFieldValue('permitir_stock_negativo', record.permitir_stock_negativo)
            setObserver(!observer)
        }
    }, [record])

    return (
        <>
            <Typography>Producto</Typography>
            <Form
                form={form}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}

            >
                <Form.Item
                    name={'Nombre'}
                    label={'Producto'}
                >
                    <Input className='fieldForm' />

                </Form.Item>
                <Form.Item
                    name={'Descripcion'}
                    label={'Descripcion'}
                >
                    <Input className='fieldForm' />
                </Form.Item>
                <Form.Item
                    name={'Precio'}
                    label={'Precio'}
                >
                    <Input className='fieldForm' />
                </Form.Item>
                <Form.Item

                    name={'Cantidad_en_stock'}
                    label={'Cantidad en stock'}
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
                    <Button htmlType='submit'>Guardar</Button>
                </Form.Item>

            </Form>
        </>
    )
}

export default FormProduct
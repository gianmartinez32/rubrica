import { Button, Form, Input, Select, Typography, notification } from 'antd'
import { useForm } from 'antd/es/form/Form'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie';


interface IProps{
    record:any,
    onClose:() => void
}
const FormSell = ({record,onClose}:IProps) => {
    const [form] = useForm()
    const [productosBD, setProductosBD] = useState([])
    const [observer, setObserver] = useState(true)

    const onFinish = async (fields: any) => {
        try {
            if(!fields.telefono_cliente) fields.telefono_cliente = '00000000'
            if(!fields.nombre_cliente) fields.nombre_cliente = 'Consumidor Final'
            if(record) fields.codigo_venta = record.Codigo_venta

            const token = Cookies.get('token')
            const config = {
                headers: {
                  Authorization: `${token}`,
                },
                withCredentials: true,
              };

            
            const response = record ?  await  axios.put('http://localhost:5000/update-venta',fields,config) : await  axios.post('http://localhost:5000/create-venta',fields,config)
            if(response.data.success){
                notification.success({
                    message:response.data.message,
                })
                onClose()
                form.resetFields()
            }else{
                notification.warning({
                    message:response.data.message,
                })
            }
        } catch (error:any) {
            notification.error({
                message:error.response.data.message,
            })
        }
    }

    const productoOptions = useMemo(() => productosBD.map((producto: any) => ({
        label: producto.Nombre,
        value: producto.Codigo
    })), [productosBD])
    const total_venta = useMemo(() => {
        const codigo_producto_seleccionado = form.getFieldValue('codigo_producto')
        const cantidad = form.getFieldValue('cantidad_vendida')
        const producto: any = productosBD.find((producto: any) => producto.Codigo === codigo_producto_seleccionado)
        if (producto && cantidad) {
            return producto.Precio * Number(cantidad)
        } else {
            return 0
        }

    }, [observer])
    useEffect(() => {
        const loadProductos = async () => {
            const response = await axios.get('http://localhost:5000/products')
            if (response.data.success) {
                setProductosBD(response.data.data)
            }
        }
        loadProductos()
        console.log('recording productos',record);
        if(record){
            form.setFieldValue('cantidad_vendida',record.Cantidad_vendida)
            form.setFieldValue('codigo_producto',record.Codigo_producto)
            form.setFieldValue('nombre_cliente',record.Nombre_cliente)
            form.setFieldValue('telefono_cliente',record.Telefono_cliente)
            form.setFieldValue('codigo_venta',record.Codigo_venta)
            setObserver(!observer)
        }
    }, [record])

    return (
        <>
            <Typography>Realizar Venta</Typography>
            <Form
                form={form}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}

            >
                <Form.Item
                    name={'codigo_producto'}
                    label={'Producto'}
                >
                    <Select onChange={() => {
                        setObserver(!observer)
                    }} className='select_filter' options={productoOptions} />
                </Form.Item>
                <Form.Item
                    name={'nombre_cliente'}
                    label={'Nombre Cliente'}
                >
                    <Input className='fieldForm' />
                </Form.Item>
                <Form.Item
                    name={'telefono_cliente'}
                    label={'Telefono Cliente'}
                >
                    <Input className='fieldForm' />
                </Form.Item>
                <Form.Item

                    name={'cantidad_vendida'}
                    label={'Cantidad'}
                >
                    <Input onChange={() => {
                        setObserver(!observer)
                    }} className='fieldForm' />
                </Form.Item>
                <Form.Item>
                    <Typography>total : {total_venta}</Typography>
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit'>Guardar</Button>
                </Form.Item>

            </Form>
        </>
    )
}

export default FormSell
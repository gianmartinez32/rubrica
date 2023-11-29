import { Button, Form, Input, Select, Typography, notification } from 'antd'
import { useForm } from 'antd/es/form/Form'
import axios from 'axios'
import  { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie';
import { setearMiles } from '../utils/funcitions';
import { validateNumber } from '../utils/validations';
import server from '../utils/server';


interface IProps{
    record:any,
    onClose:() => void
}
const FormSell = ({record,onClose}:IProps) => {
    const [form] = useForm()
    const [productosBD, setProductosBD] = useState([])
    const [observer, setObserver] = useState(true)
    const [loading, setLoading] = useState(false)


    const onFinish = async (fields: any) => {
        try {
            if(!fields.telefono_cliente) fields.telefono_cliente = '00000000'
            if(!fields.nombre_cliente) fields.nombre_cliente = 'Consumidor Final'
            if(record) fields.codigo_venta = record.Codigo_venta

            const token = Cookies.get('token')
            axios.defaults.headers.common['Authorization'] = token

              setLoading(true)
            const response = record ?  await  axios.put(server.HOST+'/update-venta',fields) : await  axios.post(server.HOST+'/create-venta',fields)
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
        } finally{
            setLoading(false)
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
            const token = Cookies.get('token')
            axios.defaults.headers.common['Authorization'] = token

            const response = await axios.get(server.HOST+'/products')
            console.log(response);
            if (response.data.success) {
                setProductosBD(response.data.data)
            }
        }
        loadProductos()
        if(record){
            form.setFieldValue('cantidad_vendida',record.Cantidad_vendida)
            form.setFieldValue('codigo_producto',record.Codigo_producto)
            form.setFieldValue('nombre_cliente',record.Nombre_cliente)
            form.setFieldValue('telefono_cliente',record.Telefono_cliente)
            form.setFieldValue('codigo_venta',record.Codigo_venta)
            setObserver(!observer)
        }else{
            form.resetFields()
            setObserver(!observer)
        }
    }, [record])

    return (
        <>
            <Typography className='title-form'>Realizar Venta</Typography>
            <Form
                form={form}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}

            >
                <Form.Item
                    name={'codigo_producto'}
                    label={'Producto'}
                    rules={[
                        { 'required':true},
                    ]}
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
                    rules={[
                        { 'required':true},
                        {
                            validator:validateNumber
                        }
                    ]}
                >
                    <Input onChange={() => {
                        setObserver(!observer)
                    }} className='fieldForm' />
                </Form.Item>
                <Form.Item>
                    <Typography className='title-form'>total : ${setearMiles(total_venta)}</Typography>
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

export default FormSell
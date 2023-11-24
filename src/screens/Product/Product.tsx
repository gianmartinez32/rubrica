import { Button, Col, Drawer, Row, Table, Typography, notification } from 'antd'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react'
import axios from 'axios'
import FormProduct from '../../components/FormProduct'
import {  useNavigate } from 'react-router-dom'



const Product = () => {
    const [SellState, setSellState] = useState({
        openDraver: false,
        idToEdit: null,
        sells: []
    })
    const navigate = useNavigate()

    const handlerSellState = (name: string, value: any) => {
        setSellState((prev) => ({ ...prev, [name]: value }))
    }
    const handlerDrawer = () => {
        handlerSellState('openDraver', !SellState.openDraver)
    }
    const loadSell = async () => {
        try {
            const token = Cookies.get('token')
            const config = {
                headers: {
                  Authorization: `${token}`,
                },
                withCredentials: true,
              };
            const response = await axios.get('http://localhost:5000/products', config)
            if (response.data.success) {
                console.log(response.data.data)
                handlerSellState('sells', response.data.data.map((venta) => ({ ...venta })))
            } else {
                notification.warning({
                    message: response.data.message
                })
            }

        } catch (error) {
            console.log(error);
            notification.error({
                message: 'error tecnico'
            })
        }
    }

    const deleteSell = async (id: number) => {
        try {
            const response = await axios.delete(`http://localhost:5000/products/${id}`, { withCredentials: true})
            if (response.data.success) {
                notification.success({
                    message: response.data.message
                })
                loadSell()

            } else {
                notification.warning({
                    message: response.data.message
                })
            }
        } catch (error: any) {
            notification.error({
                message: error.message
            })
        }
    }
    const editSell = (record: any) => {
        handlerSellState('idToEdit', record)
        handlerDrawer()
    }

    useEffect(() => {
        loadSell()
    }, [])

    return (
        <>
            <Row justify={'center'} align={'top'} style={{
                width: '80vw'
            }}>
                <Col xl={24} xs={24} md={24} sm={24} xxl={24} lg={24}>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                        marginBottom: '1rem'
                    }}>
                        <Button onClick={() => navigate('/home')} className='btn-main1' >Volver</Button>
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                    }}>
                        <Typography style={{
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '2rem'
                        }}>Producto</Typography>
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                        marginBottom: '1rem'
                    }}>
                        <Button className='btn-main1' onClick={handlerDrawer}>Crear</Button>

                    </div>
                    <Table pagination={{ pageSize: 5 }} dataSource={SellState.sells} columns={[
                        {
                            dataIndex: 'Codigo',
                            title: 'Codigo de producto',
                            align: 'center',
                        },
                        {
                            dataIndex: 'Nombre',
                            title: 'Nombre',
                            align: 'center',
                        },
                        {
                            dataIndex: 'Descripcion',
                            title: 'Descripcion',
                            align: 'center',
                        },
                        {
                            dataIndex: 'Precio',
                            title: 'Precio',
                            align: 'center',
                        },
                        {
                            dataIndex: 'permitir_stock_negativo',
                            title: 'Permite saldo negativo',
                            align: 'center',
                            render: (value) => value ? 'Si' : 'No'
                        },
                        {
                            title: 'Acciones',
                            align: 'center',
                            render: (value, record: any) => {
                                return <>
                                    <Button onClick={() => editSell(record)}>Editar</Button>
                                    <Button onClick={() => deleteSell(record.Codigo_venta)}>Eliminar</Button>
                                </>
                            }
                        }
                    ]} />
                </Col>
            </Row>
            <Drawer onClose={handlerDrawer} rootClassName='drawer-form' open={SellState.openDraver}>
                <FormProduct record={SellState.idToEdit} onClose={() => {
                    handlerDrawer()
                    loadSell()
                }} />
            </Drawer>
        </>
    )
}

export default Product
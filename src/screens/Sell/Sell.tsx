import axios from 'axios'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react'
import FormSell from '../../components/FormSell'
import { Button, Col, Drawer, Row, Table, Typography, notification } from 'antd'
import { useAuth } from '../../context/AuthContext';
import server from '../../utils/server';



const Sell = () => {
    const { onLogout } = useAuth()

    const [SellState, setSellState] = useState({
        openDraver: false,
        idToEdit: null,
        sells: []
    })
    const handlerSellState = (name: string, value: any) => {
        setSellState((prev) => ({ ...prev, [name]: value }))
    }
    const handlerDrawer = (value: boolean) => {
        handlerSellState('openDraver', value)


    }
    const loadSell = async () => {
        try {
            const token = Cookies.get('token')
            axios.defaults.headers.common['Authorization'] = token
            const response = await axios.get(server.HOST + '/get-ventas')
            if (response.data.success) {
                handlerSellState('sells', response.data.data.map((venta: any) => ({ ...venta, key: venta.Codigo_venta })))
            } else {
                notification.warning({
                    message: response.data.message
                })
                if (response.data.message == '"Acceso no autorizado"') {
                    onLogout()
                }
            }

        } catch (error: any) {
            console.log(error);
            if (error.message == 'Request failed with status code 401') {
                onLogout()
                notification.error({
                    message: 'acceso no autorizado'
                })
            }
        }
    }

    const deleteSell = async (id: number) => {
        try {
            const token = Cookies.get('token')
            axios.defaults.headers.common['Authorization'] = token
            const response = await axios.delete(`${server.HOST}/delete-venta/${id}`)
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
        handlerDrawer(true)
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
                        justifyContent: 'center',
                        marginBottom: '1rem'
                    }}>
                        <Typography style={{
                            fontWeight: 'bold',
                            fontSize: '2rem'
                        }}>Ventas</Typography>
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                        marginBottom: '1rem'
                    }}>
                        <Button className='btn-main1' onClick={() => handlerDrawer(true)}>Crear</Button>

                    </div>
                    <Table
                        rootClassName='table-main'

                        pagination={{ pageSize: 5 }} dataSource={SellState.sells} columns={[
                            {
                                dataIndex: 'Codigo_venta',
                                title: 'Codigo de venta',
                                align: 'center',
                            },
                            {
                                dataIndex: 'Nombre_cliente',
                                title: 'Nombre de cliente',
                                align: 'center',
                            },
                            {
                                dataIndex: 'Telefono_cliente',
                                title: 'Telefono de cliente',
                                align: 'center',
                            },
                            {
                                dataIndex: 'nombre_producto',
                                title: 'Producto',
                                align: 'center',
                            },
                            {
                                dataIndex: 'Fecha_venta',
                                title: 'Fecha',
                                align: 'center',
                            },
                            {
                                dataIndex: 'Cantidad_vendida',
                                title: 'Cantidad vendida',
                                align: 'center',
                            },
                            {
                                dataIndex: 'total_venta',
                                title: 'Total de venta',
                                align: 'center',
                            },
                            {
                                title: 'Acciones',
                                align: 'center',
                                render: (_value, record: any) => {
                                    return <div style={{display:'flex', justifyContent:'center',gap:'1rem'}}>
                                        <Button className='btn-main2' onClick={() => editSell(record)}>Editar</Button>
                                        <Button className='btn-main2' onClick={() => deleteSell(record.Codigo_venta)}>Eliminar</Button>
                                    </div>
                                }
                            }
                        ]} />
                </Col>
            </Row>
            <Drawer onClose={() => {
                editSell(null)
                handlerDrawer(false)
            }}
                forceRender
                rootClassName='drawer-form'
                open={SellState.openDraver}>
                <FormSell record={SellState.idToEdit} onClose={() => {
                    handlerDrawer(false)
                    loadSell()
                }} />
            </Drawer>
        </>
    )
}

export default Sell
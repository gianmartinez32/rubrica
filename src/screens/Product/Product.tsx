import { Button, Col, Drawer, Row, Table, Typography, notification } from 'antd'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react'
import axios from 'axios'
import FormProduct from '../../components/FormProduct'
import { useAuth } from '../../context/AuthContext';
import { setearMiles } from '../../utils/funcitions';
import server from '../../utils/server';



const Product = () => {
    const { onLogout } = useAuth()

    const [SellState, setSellState] = useState({
        openDraver: false,
        idToEdit: null,
        sells: []
    })

    const handlerSellState = (name: string, value: any) => {
        setSellState((prev) => ({ ...prev, [name]: value }))
    }
    const handlerDrawer = (value:boolean) => {
        handlerSellState('openDraver', value)
    }
    const loadSell = async () => {
        try {
            const token = Cookies.get('token')
            axios.defaults.headers.common['Authorization'] = token
            const response = await axios.get(server.HOST+'/products')
            if (response.data.success) {
                handlerSellState('sells', response.data.data.map((venta:any) => ({ ...venta })))
            } else {
                notification.warning({
                    message: response.data.message
                })
                if(response.data.message == '"Acceso no autorizado"'){
                    onLogout()
                }
            }

        } catch (error:any) {
            console.log(error);
            if (error.response.status === 401) {
                notification.warning({
                  message: error.response.data.message
                })
                onLogout()
      
              }
        }
    }

    const deleteSell = async (id: number) => {
        try {
            const token = Cookies.get('token')
            axios.defaults.headers.common['Authorization'] = token
            const response = await axios.delete(`${server.HOST}/products/${id}`)
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
                        }}>Producto</Typography>
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                        marginBottom: '1rem'
                    }}>
                        <Button className='btn-main1' onClick={()=>handlerDrawer(true)}>Crear</Button>

                    </div>
                    <Table rootClassName='table-main' pagination={{ pageSize: 5 }} dataSource={SellState.sells} columns={[
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
                            render:(value)=>setearMiles(value)
                        },
                        {
                            dataIndex: 'permitir_stock_negativo',
                            title: 'Permite saldo negativo',
                            align: 'center',
                            render: (value) => value ? 'Si' : 'No'
                        },
                        {
                            dataIndex: 'Cantidad_en_stock',
                            title: 'Cantidad en stock',
                            align: 'center',
                        },
                        {
                            title: 'Acciones',
                            align: 'center',
                            render: (_value, record: any) => {
                                return <div style={{display:'flex', justifyContent:'center',gap:'1rem'}}>
                                    <Button className='btn-main2' onClick={() => editSell(record)}>Editar</Button>
                                    <Button className='btn-main2' onClick={() => deleteSell(record.Codigo)}>Eliminar</Button>
                                </div>
                            }
                        }
                    ]} />
                </Col>
            </Row>
            <Drawer onClose={()=>{
                editSell(null)
                handlerDrawer(false)}} rootClassName='drawer-form' open={SellState.openDraver}>
                <FormProduct record={SellState.idToEdit} onClose={() => {
                    handlerDrawer(false)
                    loadSell()
                }} />
            </Drawer>
        </>
    )
}

export default Product
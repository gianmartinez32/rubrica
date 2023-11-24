import axios from 'axios'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import FormSell from '../../components/FormSell'
import { Button, Col, Drawer, Row, Table, Typography, notification } from 'antd'



const Sell = () => {
    const [SellState, setSellState] = useState({
        openDraver: false,
        idToEdit: null,
        sells:[]
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
            const response = await axios.get('http://localhost:5000/get-ventas', config)
            if(response.data.success){
                handlerSellState('sells',response.data.data.map((venta)=>({...venta, key:venta.Codigo_venta})))
            }else{
                notification.warning({
                    message:response.data.message
                })
            }

        } catch (error) {
            console.log(error);
            notification.error({
                message:'error tecnico'
            })
        }
    }

    const deleteSell = async ( id:number) =>{
      try {
        const token = Cookies.get('token')
        const config = {
            headers: {
              Authorization: `${token}`,
            },
            withCredentials: true,
          };
        const response = await axios.delete(`http://localhost:5000/delete-venta/${id}`,config)
        if(response.data.success){
            notification.success({
                message: response.data.message
            })
            loadSell()

        }else{
            notification.warning({
                message: response.data.message
            })
        }
      } catch (error:any) {
        notification.error({
            message: error.message
        })
      }
    }
    const editSell = (record:any) =>{
        handlerSellState('idToEdit', record)
        handlerDrawer()
    }

    useEffect(() => {
        loadSell()
    }, [])

    return (
        <>
            <Row justify={'center'} className='card-user' align={'top'} style={{
                width: '80vw'
            }}>
                <Col xl={24} xs={24} md={24} sm={24} xxl={24} lg={24}>
                <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                        marginBottom: '1rem'
                    }}>
                       <Button className='btn-main1' onClick={()=>navigate('/home')} >Volver</Button>
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
                        }}>Ventas</Typography>
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'start',
                        marginBottom: '1rem'
                    }}>
                        <Button className='btn-main1' onClick={handlerDrawer}>Crear</Button>

                    </div>
                    <Table
                    
                    pagination={{pageSize:5}} dataSource={SellState.sells} columns={[
                        {
                            dataIndex:'Codigo_venta',
                            title:'Codigo de venta',
                            align: 'center',
                        },
                        {
                            dataIndex:'Nombre_cliente',
                            title:'Nombre de cliente',
                            align: 'center',
                        },
                        {
                            dataIndex:'Telefono_cliente',
                            title:'Telefono de cliente',
                            align: 'center',
                        },
                        {
                            dataIndex:'nombre_producto',
                            title:'Producto',
                            align: 'center',
                        },
                        {
                            dataIndex:'Fecha_venta',
                            title:'Fecha',
                            align: 'center',
                        },
                        {
                            dataIndex:'Cantidad_vendida',
                            title:'Cantidad vendida',
                            align: 'center',
                        },
                        {
                            dataIndex:'total_venta',
                            title:'Total de venta',
                            align: 'center',
                        },
                        {
                            title:'Acciones',
                            align: 'center',
                            render:(value,record:any)=>{
                                return<>
                                 <Button className='btn-main2' onClick={()=>editSell(record)}>Editar</Button> 
                                 <Button className='btn-main2' onClick={()=>deleteSell(record.Codigo_venta)}>Eliminar</Button>
                                </>
                            }
                        }
                    ]}/>
                </Col>
            </Row>
            <Drawer  onClose={handlerDrawer} rootClassName='drawer-form' open={SellState.openDraver}>
                <FormSell record={SellState.idToEdit} onClose={()=>{
                    handlerDrawer()
                    loadSell()
                    }} />
            </Drawer>
        </>
    )
}

export default Sell
import { Box, Button, Card, FormControl, Grid2, Input, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import Menu from "../../components/Menu";
import { useEffect, useState } from "react";
import axios from "axios";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/user";

export default function Buscador() {

    const navigate = useNavigate()

    const { token } = useUser()
 
    const [getBuscadorText, setBuscadorText] = useState('');
    const [getResult, setResult] = useState([])
    const [getProductSelect, setProductSelect] = useState(null);


    useEffect(() => {
        (async () => {
            try {
                if(getBuscadorText.length > 0) {
                    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/producto/search?query=${getBuscadorText}`)
                    console.log(response.data)
                    setResult(response.data)
                } else {
                    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/producto/search`)
                    console.log(response.data)
                    setResult(response.data)
                }
            }
            catch(err) {

            }
        })()
    }, [getBuscadorText])

    const agregarProducto = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/usuario/agregar_producto`, {
                id: getProductSelect._id,
                cantidad: getProductSelect.cantidad,
                vencimiento: getProductSelect.vencimiento
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setProductSelect(null)
        }
        catch(err) {
            alert("Error al agregar producto")
        }
    }

    const seleccionarProducto = producto => {
        setProductSelect(i => ({
            ...producto,
            cantidad: 0,
            vencimiento: '-'
        }))
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box>
                <Menu />
                <Box sx={{padding:'20px'}}>
                    <Box sx={{display:'flex', justifyContent:'space-between', margin:'20px 0'}}>
                        <Button variant="contained" onClick={() => navigate('/crear-producto')}>Crear producto</Button>
                        <TextField value={getBuscadorText} onChange={(e) => setBuscadorText(e.target.value)} placeholder="Buscar..."/>
                    </Box>

                    <ProductosLista productos={getResult} onProductSelect={seleccionarProducto}/>
                </Box>
                <Modal
                    open={getProductSelect != null}
                    sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
                    onClose={() => setProductSelect(null)}
                >
                    <Box sx={{padding:'20px', background:'#fff', width:{xs:'80%', md:'20%', maxHeight:'80%', overflowY:'auto'}}}>
                        <Box>
                            <Typography fontSize={"30px"}>{getProductSelect?.nombre}</Typography>
                        </Box>
                        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <img src={getProductSelect?.imagen} style={{width:'80%'}}/>
                        </Box>
                        <Box sx={{margin:'10px 0'}}>
                            <DatePicker fullWidth label="Fecha de vencimiento" onChange={(e) => setProductSelect(i => ({...i, vencimiento: e}))}/>
                        </Box>
                        <FormControl fullWidth  sx={{margin:'10px 0'}}>
                            <InputLabel>Cantidad ({getProductSelect?.tipo})</InputLabel>
                            <Input value={getProductSelect?.cantidad} onChange={(e) => setProductSelect(i => ({...i, cantidad: e.target.value}))}/>
                        </FormControl>
                        <Button variant="contained" fullWidth sx={{margin:'10px 0'}} onClick={() => agregarProducto()}>Agregar a la heladera</Button>
                        <Button variant="contained" fullWidth color="error" onClick={() => setProductSelect(null)}>Cerrar</Button>
                    </Box>
                </Modal>
            </Box>
        </LocalizationProvider>
    )
}

const ProductosLista = ({productos = [], onProductSelect}) => {
    if(productos.length == 0) return <Box>
        <Typography>No se encontraron resultados</Typography>
    </Box>

    return (<Grid2 sx={{width:'100%', cursor:'pointer'}} container spacing={2}>
        {productos.map((value, index) => (<Grid2 size={{ xs: 6, md: 3 }} key={`ds${index}`} onClick={() => onProductSelect(value)}>
            <Card>
                <Box sx={{aspectRatio:'4/4', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <img style={{height:'100%'}} src={value.imagen}/>    
                </Box>
                <Box sx={{padding:'10px'}}>
                    <Typography>{value.nombre}</Typography>
                </Box>
            </Card>
        </Grid2>))}
    </Grid2>)
}
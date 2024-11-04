import { Autocomplete, Box, Button, Card, Grid2, Modal, styled, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu';
import useUser from '../../hooks/user';

export default function Home() {

    const navigate = useNavigate()

    const { getUserData } = useUser()

    const [getProductPreview, setProductPreview] = useState(null)

    const eliminarProducto = () => {
        
    }
    return (
        <Box>
            <Menu />
            <Box
                sx={{padding:'20px'}}
            >   
                <Typography fontSize={"24px"}>Hola {getUserData?.nombre}!</Typography>
                <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <Typography fontSize={"24px"}>Mi heladera</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/buscar')}>Producto</Button>
                </Box>
                <ProductosLista productos={getUserData?.productos} onProductSelect={setProductPreview}/>
            </Box>

            <Modal
                open={getProductPreview != null}
                sx={{justifyContent:'center', alignItems:'center', display:'flex'}}
                onClose={() => setProductPreview(null)}
            >
                <Box
                    sx={{
                        width:{xs:'80%', md:'400px'},
                        padding:'20px',
                        background:'#fff',
                        maxHeight:'80%',
                        overflowY:'auto'
                    }}
                >

                    <Box sx={{display:'flex',justifyContent:'center'}}>
                        <Box sx={{aspectRatio:'4/4', maxWidth:{xs:'300px'}}}>
                            <img style={{height:'100%'}} src={getProductPreview?.producto.imagen}/>
                        </Box>
                    </Box>
                    <TextField fullWidth placeholder="Nombre" value={getProductPreview?.producto.nombre}/>
                    <TextField fullWidth placeholder="Cantidad" value={getProductPreview?.cantidad}/>
                    <Button fullWidth variant="contained" sx={{margin:'20px 0'}}>Guardar</Button>
                    <Button fullWidth color="error" variant="contained" onClick={() => eliminarProducto()}>Eliminar</Button>
                </Box>
            </Modal>
        </Box>
    )
}

const ProductosLista = ({productos = [], onProductSelect}) => {
    if(productos.length == 0) return <Box>
        <Typography>No se encontraron resultados</Typography>
    </Box>

    return (<Grid2 sx={{width:'100%', cursor:'pointer'}} container spacing={2}>

        {productos.map((value, index) => {
            
            const fecha = new Date(value.vencimiento)

            const estaVencido = fecha.getTime() - new Date().getTime() <= 0;

            return (<Grid2 size={{ xs: 6, md: 3 }} key={`ds${index}`} onClick={() => onProductSelect(value)}>
            <Card>
                <Box sx={{aspectRatio:'4/4', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <img style={{height:'100%'}} src={value.producto.imagen}/>    
                </Box>
                <Box sx={{padding:'10px'}}>
                    <Typography>{value.producto.nombre}</Typography>
                    <Typography>Cantidad: {value.cantidad}</Typography>
                    <Box sx={{display:'flex', gap:'5px'}}>
                        <Typography>Vencimiento:</Typography><Typography sx={{color: estaVencido == true ? 'red' : '#000'}}>{value.vencimiento == '-' ? 'Sin proporcionar' : fecha.toLocaleDateString()}</Typography>
                    </Box>
                </Box>
            </Card>
        </Grid2>)})}
    </Grid2>)
}
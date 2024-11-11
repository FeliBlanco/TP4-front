import { Autocomplete, Backdrop, Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2, Modal, styled, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditIcon from '@mui/icons-material/Edit';


import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu';
import useUser from '../../hooks/user';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Home() {

    const navigate = useNavigate()

    const { getUserData, setUserData, token } = useUser()

    const [getProductPreview, setProductPreview] = useState(null);
    const [getProductsSelect, setProductsSelect] = useState(null);
    const [isDialogDeleteProductOpen, setDialogDeleteProductOpen] = useState(false);
    const [isDeletingProducts, setDeletingProducts] = useState(false);
    const [isSearchingRecetas, setSearchingRecetas] = useState(false);

    const eliminarProducto = async () => {
        setDeletingProducts(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/usuario/sacar_productos`, {
                ids: [getProductPreview._id]
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserData(i => {
                i.productos = i.productos.filter(producto => getProductPreview._id != producto._id)
                return {...i}
            })
            setProductPreview(null);
            setDeletingProducts(false)
        }
        catch(err) {
            alert("Hubo un error al eliminar el producto")
            setDeletingProducts(false)
        }
    }

    const selectProduct = product => {
        setProductsSelect(i => {
            if(!i) {
                i = []
            }
            const index = i.findIndex(j => j._id == product._id);
            if(index == -1) {
                i.push(product)
            } else {
                i = i.filter(j => j._id != product._id);
                if(i.length == 0) {
                    return null;
                }
            }
            return [...i]
        })
    }

    const selectAll = () => {
        setProductsSelect(i => {
            if(getUserData.productos) {
                i = getUserData.productos;
            } else return null;
            return [...i];
        })
    }

    const unselectAll = () => {
        setProductsSelect(i => [])
    }

    const buscarRecetas = async () => {
        setSearchingRecetas(true);
        try {
            const productos = getProductsSelect.map(value => value._id);

            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/usuario/receta`, {
                productos
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            navigate(`/receta/${response.data}`)
            setSearchingRecetas(false);
        }
        catch(err) {
            setSearchingRecetas(false);
            alert("Hubo un error al buscar recetas")
        }
    }

    const eliminarProductos = async () => {
        setDialogDeleteProductOpen(false)
        setDeletingProducts(true);


        try {
            const ids = getProductsSelect.map(producto => producto._id)
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/usuario/sacar_productos`, {
                ids
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDeletingProducts(false);
            setUserData(i => {
                i.productos = i.productos.filter(producto => ids.findIndex(id => id == producto._id) == -1)
                return {...i}
            })
            setProductsSelect(null)
        }
        catch(err) {
            alert("Hubo un error al eliminar el producto")
            setDeletingProducts(false)
        }
    }

    const isAllSelected = getProductsSelect && getUserData.productos && getProductsSelect.length == getUserData.productos.length;

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
                <ProductosLista productos={getUserData?.productos} onProductSelect={selectProduct} selects={getProductsSelect}/>
            </Box>
            <Dialog
                open={isDialogDeleteProductOpen}
                onClose={() => setDialogDeleteProductOpen(false)}
            >
                <DialogTitle>Eliminar {getProductsSelect?.length} producto{getProductsSelect?.length > 1 ? 's' : ''} de tu heladera</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro/a que quieres eliminar los productos seleccionados?</Typography>
                    <Typography>Puedes volverlos a agregar luego.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setDialogDeleteProductOpen(false)}>Cancelar</Button>
                    <Button onClick={() => eliminarProductos()}>Eliminar</Button>
                </DialogActions>
            </Dialog>
            <Backdrop open={isDeletingProducts || isSearchingRecetas} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <CircularProgress/>
            </Backdrop>
            {
                getProductsSelect != null &&
                <MenuAbajoProductos>
                    <MenuAbajoProductosContent>
                        <MenuAbajoProducto>
                            <Typography>{getProductsSelect.length} seleccionados</Typography>
                        </MenuAbajoProducto>
                        <Divider />
                        {
                            isAllSelected == false ?
                            <MenuAbajoProducto onClick={() => selectAll()}>
                                <CheckBoxOutlinedIcon />
                                <Typography>Seleccionar todo</Typography>
                            </MenuAbajoProducto>
                            :
                            <MenuAbajoProducto onClick={() => unselectAll()}>
                                <CheckBoxOutlineBlankOutlinedIcon />
                                <Typography>Deseleccionar todo</Typography>
                            </MenuAbajoProducto>

                        }
                        {
                            getProductsSelect.length == 1 &&
                            <MenuAbajoProducto onClick={() => setProductPreview(getProductsSelect[0])}>
                                <EditIcon />
                                <Typography>Editar</Typography>
                            </MenuAbajoProducto>
                        }
                        {
                            getProductsSelect.length > 0 &&
                            <MenuAbajoProducto onClick={() => setDialogDeleteProductOpen(true)}>
                                <DeleteOutlineOutlinedIcon />
                                <Typography>Eliminar</Typography>
                            </MenuAbajoProducto>
                        }
                        <MenuAbajoProducto onClick={() => buscarRecetas()}>
                            <SearchOutlinedIcon />
                            <Typography>Buscar recetas</Typography>
                        </MenuAbajoProducto>
                        <Divider />
                        <MenuAbajoProducto onClick={() => setProductsSelect(null)}>
                            <CloseOutlinedIcon />
                            <Typography>Cancelar</Typography>
                        </MenuAbajoProducto>
                    </MenuAbajoProductosContent>
                </MenuAbajoProductos>
            }

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
                        <Box sx={{aspectRatio:'4/4', maxWidth:{xs:'300px', overflow:'hidden', display:'flex', justifyContent:'center', alignItems:'center'}}}>
                            <img style={{maxHeight:'100%', maxWidth:'100%'}} src={getProductPreview?.producto.imagen}/>
                        </Box>
                    </Box>

                    <TextField fullWidth placeholder="Cantidad" value={getProductPreview?.cantidad} label="Cantidad"/>
 
                    <Button fullWidth variant="contained" sx={{margin:'20px 0'}}>Guardar</Button>
                    <Button fullWidth color="error" variant="contained" onClick={() => eliminarProducto()}>Eliminar</Button>
                </Box>
            </Modal>
        </Box>
    )
}

const ProductosLista = ({productos = [], onProductSelect, selects = null}) => {
    if(productos.length == 0) return <Box>
        <Typography>No se encontraron resultados</Typography>
    </Box>

    return (<Grid2 sx={{width:'100%', cursor:'pointer'}} container spacing={2}>

        {productos.map((value, index) => {
            
            const fecha = new Date(value.vencimiento)

            const estaVencido = fecha.getTime() - new Date().getTime() <= 0;
            const isSelected = (selects != null && selects.findIndex(j => j._id == value._id) != -1);

            return (<Grid2 size={{ xs: 6, md: 3 }} key={`ds${index}`} onClick={() => onProductSelect(value)}>
            <Card sx={{position:'relative', overflow:'initial'}}>
                {selects != null &&
                    <Box sx={{display:'flex', justifyContent:'center', alignItems:'center',width:40, height:40, background: isSelected == true ? '#e3a54d' : 'rgba(240, 240, 240, 0.8)', borderRadius:'100%', position:'absolute', right:-10, top:-10}}>
                        {isSelected == true && <CheckIcon sx={{color:'#fff'}}/>}
                    </Box>
                }
                <Box sx={{aspectRatio:'4/4', display:'flex', justifyContent:'center', alignItems:'center', overflow:'hidden'}}>
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

const MenuAbajoProducto = styled(Box)(() => ({
    display:'flex',
    alignItems:'center',
    gap:'10px',
    cursor:'pointer',
    padding:'10px'
}))

const MenuAbajoProductosContent = styled(Box)(() => ({
    display:'flex',
    flexDirection:'column',
    gap:'20px',
}))

const MenuAbajoProductos = styled(Box)(() => ({
    position:'fixed',
    width:'200px',
    padding:'5px',
    background:'#fff',
    bottom:0,
    top:0,
    right:0,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    borderLeft:'1px solid #e1e1e1'
}))
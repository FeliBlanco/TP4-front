import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import Menu from "../../components/Menu";
import styled from "@emotion/styled";
import { useRef, useState } from "react";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from "axios";


export default function CrearProducto() {
    const [getData, setData] = useState({
        nombre: '',
        imagen: null,
        tipo:'Litros'
    })

    const refInputImage = useRef();

    const borrarImagen = () => {
        setData(i => ({...i, imagen: null}))
    }

    const crearProducto = async () => {
        if(getData.nombre.length < 4) return alert("Ingresa un nombre")
        if(getData.imagen == null) return alert("Ingresa una imagen")
        try {
            const form = new FormData();
            form.append("nombre", getData.nombre)
            form.append("imagen", getData.imagen.file)
            form.append("tipo", getData.tipo)
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/producto`, form)
            setData(i => ({nombre: '', imagen: null, tipo:'Litros'}))
            alert("Producto creado!")
        }
        catch(err) {
            alert("Error al crear el producto")
            console.log(err)
        }
    }

    const changeImage = (e) => {
        const file = e.target.files[0]
        if(file) {
            const fileReader = new FileReader();

            fileReader.onload = () => {
                setData(i => ({...i, imagen: {src:fileReader.result, file}}))
            }
            fileReader.readAsDataURL(file)
        }
    }

    return (
        <Box>
            <Menu />
            <Box 
                sx={{
                    width:'100%',
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center'
                }}>
                <Box sx={{
                    padding:'20px'
                }}>
                    <Typography fontSize="24px">Crear nuevo producto</Typography>

                    {
                        getData.imagen == null ?
                        <ImagePickerComponent onClick={() => refInputImage?.current?.click()}>
                            <AddPhotoAlternateIcon fontSize='large'/>
                        </ImagePickerComponent>
                        :
                        <ImageContainer>
                            <BorrarContainer onClick={() => borrarImagen()}>
                                <HighlightOffIcon sx={{width:'100%', height:'100%'}}/>
                            </BorrarContainer>
                            <img src={getData.imagen.src}/>
                        </ImageContainer>
                    }
                    <FormControl fullWidth>
                        <InputLabel>Nombre</InputLabel>
                        <Input value={getData?.nombre} onChange={(e) => setData(i => ({...i, nombre: e.target.value}))} />
                    </FormControl>
                    <input ref={refInputImage} onChange={changeImage} type="file" accept='image/*' style={{display:'none'}}/>
                    <Select sx={{margin:'20px 0'}} value={getData?.tipo} onChange={(e) => setData(i => ({...i, tipo: e.target.value}))}>
                        <MenuItem value="Litros">Litros</MenuItem>
                        <MenuItem value="Gramos">Gramos</MenuItem>
                        <MenuItem value="Unidad">Unidad</MenuItem>
                    </Select>
                    <Button sx={{margin:'20px 0'}} fullWidth variant='contained' onClick={() => crearProducto()}>Crear producto</Button>
                </Box>
            </Box>
        </Box>
    )
}

const BorrarContainer = styled(Box)(() => ({
    position:'absolute',
    width:'50px',
    height:'50px',
    top:-15,
    right:-15,
    zIndex:100
}))

const ImageContainer = styled(Box)(() => ({
    width:'100%',
    aspectRatio:'4/4',
    margin:'10px 0',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    border:'1px solid #e1e1e1',
    img: {
        width:'100%'
    },
    position:'relative',
}))

const ImagePickerComponent = styled(Box)(() => ({
    width:'100%',
    border:'3px dashed #e1e1e1',
    aspectRatio:'4/4',
    margin:'10px 0',
    cursor:'pointer',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
}))
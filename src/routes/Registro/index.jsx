import { Box, Button, Card, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import Menu from '../../components/Menu'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useUser from '../../hooks/user'

export default function Registro() {

    const navigate = useNavigate()
    const { setToken } = useUser()

    const [getData, setData] = useState({
        nombre: '',
        correo: '',
        contra: ''
    })

    const [isLoging, setLoging] = useState(false);


    const submitRegistro = async e => {
        e.preventDefault();
        if(isLoging) return;

        const correo = getData.correo;
        const contra = getData.contra;
        const nombre = getData.nombre;
        console.log(correo)
        if(!correo || !contra || !nombre) return alert("Ingresa un correo y contraseña válidas");
        if(!/\S+@\S+\.\S+/.test(correo)) return alert("Ingresa un correo valido");
        
        setLoging(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/usuario`, {
                correo,
                contra,
                nombre
            })
            console.log(response.data)
            setToken(response.data.token)
        }
        catch(err) {
            setLoging(false)
            alert("ocurrió un error")
        }
    }
    return (
        <Box>
            <Menu />
            <Box sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Box sx={{width:{xs:'80%', md:'400px', marginTop:'20px'}}}>
                    <Card sx={{display:'flex', flexDirection:'column', gap:'20px', padding:'20px'}}>
                        <Typography textAlign={"center"} fontSize={"20px"}>Tu heladera</Typography>
                        <Typography textAlign={"center"} fontSize={"30px"}>Crear cuenta</Typography>
                        <TextField onChange={(e) => setData(i => ({...i, nombre: e.target.value}))} name="nombre" placeholder="Nombre"/>
                        <TextField onChange={(e) => setData(i => ({...i, correo: e.target.value}))} name="correo" placeholder="Correo electrónico"/>
                        <TextField onChange={(e) => setData(i => ({...i, contra: e.target.value}))} name="contra" placeholder="Contraseña"/>
                        <Button type="submit" fullWidth variant="contained" onClick={submitRegistro}>Crear cuenta</Button>
                        <Button fullWidth onClick={() => navigate('/login')}>Iniciar sesión</Button>
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}

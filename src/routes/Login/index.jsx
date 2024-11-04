import { Box, Button, Card, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import Menu from '../../components/Menu'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useUser from '../../hooks/user'

export default function Login() {

    const navigate = useNavigate();
    const { setToken } = useUser()

    const [isLoging, setLoging] = useState(false);
    const [getData, setData] = useState({
        correo: '',
        contra: ''
    })

    const submitLogin = async e => {
        e.preventDefault();
        if(isLoging) return;

        const correo = getData.correo;
        const contra = getData.contra;
        if(!correo || !contra) return alert("Ingresa un correo y contraseña válidas");
        setLoging(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/usuario/login`, {
                correo,
                contra
            })
            setToken(response.data.token)

        }
        catch(err) {
            setLoging(false);
        }
    }
    return (
        <Box>
            <Menu />
            <Box sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Box sx={{width:{xs:'80%', md:'400px', marginTop:'20px'}}}>
                    <Card sx={{display:'flex', flexDirection:'column', gap:'20px', padding:'20px'}}>
                        <Typography textAlign={"center"} fontSize={"20px"}>Tu heladera</Typography>
                        <Typography textAlign={"center"} fontSize={"30px"}>Iniciar sesión</Typography>
                        <TextField value={getData.correo} onChange={(e) => setData(i => ({...i, correo: e.target.value}))} placeholder="Correo electrónico"/>
                        <TextField value={getData.contra} onChange={(e) => setData(i => ({...i, contra: e.target.value}))} placeholder="Contraseña" type="password"/>
                        <Button type="submit" fullWidth variant="contained" onClick={submitLogin}>Iniciar sesión</Button>
                        <Button fullWidth onClick={() => navigate('/registro')}>Crear cuenta</Button>
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}

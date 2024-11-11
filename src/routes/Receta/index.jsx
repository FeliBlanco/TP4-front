import { Backdrop, Box, Card, CircularProgress, List, ListItem, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import Menu from "../../components/Menu";
import { useEffect, useState } from "react";
import axios from "axios";
import useUser from "../../hooks/user";

export default function Receta() {
    const { id } = useParams();
    const { token } = useUser()

    const [getRecetas, setRecetas] = useState(null);
    const [isLoading, setLoading] = useState(false);



    useEffect(() => {
        (async ()=> {
            try {
                setLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/usuario/receta/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setLoading(false)
                console.log(response.data)
                try {
                    setRecetas(JSON.parse(response.data.replaceAll('```','').replaceAll('json', '')));
                }
                catch(err) {
                    alert("Hubo un error al convertir las recetas")
                    console.log(err)
                }
            }
            catch(err) {
                alert("Hubo un error al cargar las recetas")
                setRecetas([])
            }
        })()
    }, [])
    return (
        <Box sx={{width:'100%', display:'flex', flexDirection:'column'}}>
            <Menu />
            <Backdrop open={getRecetas == null}><CircularProgress sx={{color:'#fff'}}/></Backdrop>
            <Box sx={{width:'100%',display:'flex', justifyContent:'center', flex:1}}>
                <Box sx={{width:{xs:'100%', md:'600px'}, padding:'20px'}}>
                    {isLoading == true ? <Typography fontSize="30px">Generando receta...</Typography> : <Typography fontSize="30px">Receta generada</Typography>}
                    <Box sx={{display:'flex', flexDirection:'column', gap:'20px'}}>
                        {
                            getRecetas != null && getRecetas.map((value, index) => {
                                return (
                                    <Card key={`receta-${index}`} sx={{padding:'20px'}}>
                                        <Box>
                                            <Typography fontSize={"30px"}>{value.nombre}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography>Ingredientes</Typography>
                                            <List>
                                                {
                                                    value.ingredientes.map((valueIng, indexIng) => {
                                                        return (
                                                            <ListItem key={`ds${index}-${indexIng}`}>
                                                                <Typography color={valueIng.existe == true ? 'green' : 'red'}>{valueIng.nombre}</Typography>
                                                            </ListItem>
                                                        )
                                                    })
                                                }
                                            </List>
                                        </Box>
                                        <Box>
                                            <Typography fontSize="20px">Instrucciones</Typography>
                                            <Box>
                                                <List>
                                                    {value.instrucciones.map((valueInst, indexInstr) => {
                                                        return (
                                                            <ListItem key={`ins-${index}-${indexInstr}`}>
                                                                <Typography>{valueInst}</Typography>
                                                            </ListItem>
                                                        )
                                                    })}
                                                </List>
                                            </Box>
                                        </Box>
                                    </Card>
                                )
                            })
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
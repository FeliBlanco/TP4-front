import { AccountCircle } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography, Menu as MenuUI, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Menu() {

    const redirect = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null);


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <AppBar position="static">
            <Toolbar sx={{justifyContent:'space-between'}}>
                <Typography fontSize={"20px"} sx={{cursor:'pointer'}} onClick={() => redirect('/')}>Heladera</Typography>
                <div>
                    <IconButton color="inherit" size="large" onClick={handleMenu}>
                        <AccountCircle />
                    </IconButton>
                    <MenuUI anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem>Cerrar sesión</MenuItem>
                    </MenuUI>
                </div>
            </Toolbar>
        </AppBar>
    )
}
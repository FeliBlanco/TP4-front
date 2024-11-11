import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Buscador from "./Buscador";
import CrearProducto from "./CrearProducto";
import Registro from "./Registro";
import IsLogged from "../../IsLogged";
import IsUnlogged from "../../IsUnlogged";
import useUser from "../hooks/user";
import Receta from "./Receta";

const router = createBrowserRouter([
    {
        path: '/',
        element: <IsLogged><Home /></IsLogged>
    },
    {
        path: '/login',
        element: <IsUnlogged><Login /></IsUnlogged>
    },
    {
        path: '/registro',
        element: <IsUnlogged><Registro /></IsUnlogged>
    },
    {
        path: '/buscar',
        element: <IsLogged><Buscador /></IsLogged>
    },
    {
        path: '/crear-producto',
        element: <IsLogged><CrearProducto /></IsLogged>
    },
    {
        path: '/receta/:id',
        element: <IsLogged><Receta /></IsLogged>
    }
])


export default function Routes({children}) {

    const { isLoged} = useUser();

    if(isLoged == null) return <div></div>

    return (
        <RouterProvider router={router}>
            {children}
        </RouterProvider>
    )
}
import { Navigate } from "react-router-dom";
import useUser from "./src/hooks/user"

export default function IsLogged({children}) {

    const { isLoged } = useUser();

    return isLoged == true ? children : <Navigate to="/login"/>
}
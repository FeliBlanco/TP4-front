import { Navigate } from "react-router-dom";
import useUser from "./src/hooks/user"

export default function IsUnlogged({children}) {

    const { isLoged } = useUser();

    return isLoged == false ? children : <Navigate to="/"/>
}
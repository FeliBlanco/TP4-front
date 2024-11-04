import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"

const useUser = () => {
    const { getUserData, setUserData, isLoged, setLoged, token, setToken } = useContext(UserContext)

    return {
        getUserData,
        setUserData,
        isLoged,
        setLoged,
        token,
        setToken
    }
}

export default useUser
import axios from "axios";
import { createContext, useEffect, useState } from "react";


const UserContext = createContext();


export default function UserContextProvider({children}) {

    const [token, setToken] = useState(null);
    const [isLoged, setLoged] = useState(null);
    const [getUserData, setUserData] = useState(null);


    useEffect(() => {
        (async () => {
            const cache_token = await localStorage.getItem('token');
            if(cache_token) {
                setToken(cache_token)

                const cache_user_data = await localStorage.getItem(`user_data`);
                if(cache_user_data) {
                    try {
                        const user_data_decoded = JSON.parse(cache_user_data);
                        setUserData(user_data_decoded)
                    }
                    catch(err) {}
                }
            } else {
                setLoged(false);
            }

        })()
    }, [])


    useEffect(() => {
        (async () => {
            if(token) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/usuario/user_data`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    localStorage.setItem(`token`, token)
                    localStorage.setItem(`user_data`, JSON.stringify(response.data))
                    setUserData(response.data)
                    setLoged(true);
                    console.log(response.data)
                }
                catch(err) {
                    if(err.response?.status == 403) {
                        setLoged(false)
                        localStorage.removeItem('token')
                        localStorage.removeItem('user_data')
                    }
                }
            }
        })()
    }, [token])

    return <UserContext.Provider value={{getUserData, setUserData, isLoged, token, setToken}}>{children}</UserContext.Provider>
}

export {UserContext};
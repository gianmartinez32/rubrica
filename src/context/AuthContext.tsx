import axios from 'axios'
import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from "react";
import server from '../utils/server';

export interface IAuthProps {
    authState: { token: string | null; authenticated: boolean | null, user?:any }
    onRegister: (email: string, password: string, name:string) => Promise<any>,
    onLogin: (email: string, password: string) => Promise<any>,
    onLogout: () => Promise<any>,


}

const AuthContext = createContext<IAuthProps>({} as IAuthProps)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{ token: string | null, authenticated: boolean | null, user?: any | null }>({ token: null, authenticated: null })

    const onRegister = async (email: string, password: string, nombre:string) => {
        try {
            const response = await axios.post(`${server.HOST+'/signin'}`, { correo:email, contraseña:password, nombre })
            return response
        } catch (error) {
            return { error: true, msg: (error as any).response.data.message }
        }
    }
    const onLogin = async (email: string, password: string) => {
        try {
            const result = await axios.post(`${server.HOST+'/login'}`, {
                correo:email,
                contraseña:password
            })
            Cookies.set('token', result.data.token,{
                expires: 1/24,
                sameSite: 'None',
                secure: true
            })
            localStorage.setItem('user', JSON.stringify(result.data))
            axios.defaults.headers.common['Authorization'] = result.data.token
            console.log('RESULT',result);
            if(result.data.token){
                setAuthState({
                    token: result.data.token,
                    authenticated: true,
                    user:result.data
                })
            }
            return result
        } catch (error:any) {
            console.log('error', error);
            return { error: true, msg: error.response.data.message }
        }
    }

    const onLogout = async () => {
        localStorage.removeItem('token')
        Cookies.remove('token')
        axios.defaults.headers.common['Authorization'] = ``
        setAuthState({
            authenticated: null,
            token: null,
            user:null
        })

    }
    const value = {
        authState, onLogin, onLogout, onRegister
    }

    useEffect(() => {
        const loadToken = async () => {
            const userStr = await localStorage.getItem('user') || ''
            const user = JSON.parse(userStr)
            
            if (user) {
                setAuthState({
                    token:user.token,
                    authenticated: true,
                    user: user
                })
            }
        }

        loadToken()


    }, [])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>)
}

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { GOOGLE_CLIENT_ID } = process.env
const { GOOGLE_REDIRECT_URI } = process.env

interface AuthProviderProps {
    children: ReactNode
}

interface User {
    id: string,
    name: string,
    email: string,
    photo?: string
}

interface AuthorizationResponse {
    params: {
        access_token: string
    },
    type: string
}

interface IAuthContextData {
    user: User,
    signInWithGoogle: () => Promise<Error | undefined>,
    signInWithApple: () => Promise<Error | undefined>,
    signOut: () => void,
    userStorageLoading: boolean
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }: AuthProviderProps){
    const [ user, setUser ] = useState<User>({} as User)
    const [ userStorageLoading, setUserStorageLoading] = useState(true)

    const collectionKey = '@gofinances:user'

    async function signInWithGoogle(){
        try {
            const RESPONSE_TYPE = 'token'
            const SCOPE = encodeURI('profile email')

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
            const { params, type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse

            if (type === 'success'){
                console.log(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
                const response  = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
                const userInfo = await response.json()

                const userLogged = {
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    photo: userInfo.picture
                }
                
                setUser(userLogged)
                await AsyncStorage.setItem(collectionKey, JSON.stringify(userLogged));
            }
        }
        catch (error) {
            return new Error(error as string)
        }
    }

    async function signInWithApple(){
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            })

            if(credential){
                const name = credential.fullName!.givenName!

                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo: `https://ui-avatars.com/api/?name=${name}&length=1`
                }
                
                setUser(userLogged)
                await AsyncStorage.setItem(collectionKey, JSON.stringify(userLogged));
            }
        }
        catch (error) {
            return new Error(error as string)
        }
    }

    async function signOut(){
        setUser({} as User)
        await AsyncStorage.removeItem(collectionKey)
    }

    useEffect(() => {
        async function loadUserStorageDate(){
            const userStored = await AsyncStorage.getItem(collectionKey)
            if(userStored){
                const userLogged = JSON.parse(userStored) as User
                setUser(userLogged)
            }
            setUserStorageLoading(false)
        }
        loadUserStorageDate()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithApple,
            signOut,
            userStorageLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext)
    return context
}

export { AuthProvider, useAuth }
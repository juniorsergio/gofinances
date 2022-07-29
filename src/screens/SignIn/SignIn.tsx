import React, { useContext } from "react";
import { RFValue } from "react-native-responsive-fontsize";

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { useAuth } from "../../hooks/auth";
import { SignInSocialButton } from "../../components/SignInSocialButton/SignInSocialButton";

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from "./styles";
import { Alert, Platform } from "react-native";

export function SignIn(){
    const { signInWithGoogle, signInWithApple } = useAuth()

    async function handleSignInWithGoogle(){
        try {
            await signInWithGoogle()
        }
        catch (error) {
            console.log(error)
            Alert.alert('Não foi possível conectar à conta Google')
        }
    }

    async function handleSignInWithApple(){
        try {
            await signInWithApple()
        }
        catch (error) {
            console.log(error)
            Alert.alert('Não foi possível conectar à conta Apple')
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton onPress={handleSignInWithGoogle} title='Entrar com Google' svg={GoogleSvg} />
                    {Platform.OS === 'ios' && <SignInSocialButton onPress={handleSignInWithApple} title='Entrar com Apple' svg={AppleSvg} />}
                </FooterWrapper>
            </Footer>
        </Container>
    )
}
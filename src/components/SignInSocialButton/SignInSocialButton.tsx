import React from "react";
import { TouchableOpacityProps } from "react-native";
import { SvgProps } from "react-native-svg";
import {
    Button,
    ImageContainer,
    Text
} from "./styles";

interface SignInSocialButton extends TouchableOpacityProps {
    title: string,
    svg: React.FC<SvgProps>
}

export function SignInSocialButton({ title, svg: Svg, ...rest }: SignInSocialButton){
    return (
        <Button {...rest}>
            <ImageContainer>
                <Svg />
            </ImageContainer>

            <Text>
                {title}
            </Text>
        </Button>
    )
}
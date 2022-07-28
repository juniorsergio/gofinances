import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import styled, { css } from "styled-components/native";

interface IconProps {
    type: 'positive' | 'negative'
}

interface ContainerProps extends IconProps {
    isActive: boolean
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
    width: 48%;

    flex-direction: row;
    align-items: center;
    justify-content: center;

    border: 1.5px solid ${({ theme }) => theme.colors.text};
    border-radius: 5px;
    padding: 18px 37px;

    ${({ isActive, type }) => isActive && type === 'positive' && css`      
        background-color: ${({ theme }) => theme.colors.success_light};
        border-width: 0;
    `}

    ${({ isActive, type }) => isActive && type === 'negative' && css`      
        background-color: ${({ theme }) => theme.colors.attention_light};
        border-width: 0;
    `}
`

export const Icon = styled(Feather)<IconProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;

    color: ${({ theme, type }) =>
        type === 'positive' ? theme.colors.success : theme.colors.attention
    }
`

export const Title = styled.Text`
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
`

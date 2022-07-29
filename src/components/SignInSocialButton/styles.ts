import { TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Button = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    
    height: ${RFValue(56)}px;
    margin-bottom: 16px;
    border-radius: 5px;

    background-color: ${({ theme }) => theme.colors.shape};
`

export const ImageContainer = styled.View`
    height: 100%;
    padding: ${RFValue(16)}px;

    justify-content: center;
    align-items: center;

    border-color: ${({ theme }) => theme.colors.background};
    border-right-width: 1px;
`

export const Text = styled.Text`
    flex: 1;
    text-align: center;

    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;
`
import { TextInput } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled(TextInput)`
    background-color: ${({ theme }) => theme.colors.shape};
    border-radius: 5px;

    width: 100%;
    padding: 18px 16px;
    margin-bottom: 8px;

    color: ${({ theme }) => theme.colors.text_dark};
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
`
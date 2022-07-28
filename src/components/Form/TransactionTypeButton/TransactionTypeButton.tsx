import React from "react";
import { TouchableOpacityProps } from "react-native";

import {
    Container,
    Title,
    Icon
} from "./styles";

interface TransactionTypeButtonProps extends TouchableOpacityProps {
    title: string,
    type: 'up' | 'down',
    isActive: boolean
}

const icon = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle'
}

export function TransactionTypeButton({ title, type, isActive, ...rest }: TransactionTypeButtonProps) {
    return (
        <Container {...rest} isActive={isActive} type={type}>
            <Icon name={icon[type]} type={type} />
            <Title>{title}</Title>
        </Container>
    )
}
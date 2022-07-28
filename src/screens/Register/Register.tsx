import React, { useState } from "react";
import { Button } from "../../components/Forms/Button/Button";
import { CategorySelect } from "../../components/Forms/CategorySelect/CategorySelect";
import { Input } from "../../components/Forms/Input/Input";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton/TransactionTypeButton";

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
 } from "./styles";

export function Register(){
    const [ transactionType, setTransactionType] = useState('')

    function handleTransactionTypeSelect(type: 'up' | 'down'){
        setTransactionType(type)
    }
    
    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <Input placeholder="Nome" />
                    <Input placeholder="Preço" />

                    <TransactionTypes>
                        <TransactionTypeButton
                            type="up"
                            title="Entrada"
                            onPress={() => handleTransactionTypeSelect('up')}
                            isActive={transactionType === 'up'}
                        />

                        <TransactionTypeButton
                            type="down"
                            title="Saída"
                            onPress={() => handleTransactionTypeSelect('down')}
                            isActive={transactionType === 'down'}
                        />
                    </TransactionTypes>

                    <CategorySelect title='Categoria' />
                </Fields>

                <Button title='Enviar' />
            </Form>
        </Container>
    )
}
import React, { useState } from "react";
import { Modal } from "react-native";
import { Button } from "../../components/Form/Button/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton/CategorySelectButton";
import { Input } from "../../components/Form/Input/Input";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect/CategorySelect";

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
 } from "./styles";

export function Register(){
    const [ category, setCategory ] = useState({
        key: 'category',
        name: 'Categoria'
    })
    const [ transactionType, setTransactionType] = useState('')
    const [ categoryModalOpen, setCategotyModalOpen ] = useState(false)

    function handleTransactionTypeSelect(type: 'up' | 'down'){
        setTransactionType(type)
    }

    function handleCloseSelectCategoryModal(){
        setCategotyModalOpen(false)
    }

    function handleOpenSelectCategoryModal(){
        setCategotyModalOpen(true)
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

                    <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal} />
                </Fields>

                <Button title='Enviar' />
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
        </Container>
    )
}
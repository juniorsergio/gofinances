import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { Button } from "../../components/Form/Button/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton/CategorySelectButton";
import { InputForm } from "../../components/Form/InputForm/InputForm";
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

 interface FormData {
    [name: string]: any,
 }

 const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().typeError('Informe um valor numérico').positive('O valor não pode ser negativo').required('O valor é obrigatório')
 })

export function Register(){
    const [ category, setCategory ] = useState({
        key: 'category',
        name: 'Categoria'
    })
    const [ transactionType, setTransactionType] = useState('')
    const [ categoryModalOpen, setCategotyModalOpen ] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) })

    function handleRegister(form: FormData){
        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação')
        }

        if(category.key === 'category'){
            return Alert.alert('Selecione a categoria')
        }

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }
    }

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name='name'
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="words"
                            autoCorrect={false}
                            error={errors.name && String(errors.name.message)}
                        />

                        <InputForm
                            name='amount'
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && String(errors.amount.message)}
                        />

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

                    <Button title='Enviar' onPress={handleSubmit(handleRegister)} />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}
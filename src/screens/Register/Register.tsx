import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

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
import { useAuth } from "../../hooks/auth";

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

    const { user } = useAuth()
    const { navigate }: NavigationProp<ParamListBase> = useNavigation()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) })

    async function handleRegister(form: FormData){
        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação')
        }

        if(category.key === 'category'){
            return Alert.alert('Selecione a categoria')
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const collectionKey = `@gofinances:transactions_user:${user.id}`

            const data = await AsyncStorage.getItem(collectionKey)
            const currentData = data ? JSON.parse(data) : []
            await AsyncStorage.setItem(collectionKey, JSON.stringify([...currentData, newTransaction]))
            
            reset()
            setTransactionType('')
            setCategory({
                key: 'category',
                name: 'Categoria'
            })
            navigate('Listagem')
        }
        catch (error) {
            console.log(error)
            Alert.alert('Não foi possivel salvar')
        }
    }

    function handleTransactionTypeSelect(type: 'positive' | 'negative'){
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
                                type="positive"
                                title="Entrada"
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive={transactionType === 'positive'}
                            />

                            <TransactionTypeButton
                                type="negative"
                                title="Saída"
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={transactionType === 'negative'}
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
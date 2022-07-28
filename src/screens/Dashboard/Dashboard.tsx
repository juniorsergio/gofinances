import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HighlightCard } from "../../components/HighlightCard/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard/TransactionCard";

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";

export interface DataListProps extends TransactionCardProps {
    id: string
}

export function Dashboard(){
    const [ data, setData ] = useState<DataListProps[]>([])
    const collectionKey = '@gofinances:transactions'

    async function loadTransactions(){

        const response = await AsyncStorage.getItem(collectionKey)
        const transactions = response ? JSON.parse(response) : []

        const transactionsFormatted: DataListProps[] = transactions.map((transaction: DataListProps) => {
            const amount = Number(transaction.amount)
                            .toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(transaction.date))

            return {
                id: transaction.id,
                name: transaction.name,
                amount,
                type: transaction.type,
                category: transaction.category,
                date
            }
        })

        setData(transactionsFormatted)
    }

    useEffect(() => {
        /* async function clearStorage(){         
            await AsyncStorage.removeItem(collectionKey)
        }
        clearStorage() */
        
        loadTransactions()
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: 'https://github.com/juniorsergio.png' }} />

                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Junior</UserName>
                        </User>
                    </UserInfo>

                    <Icon name="power" />
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard title='Entradas' amount='R$ 17.400,00' lastTransaction='Última entrada dia 13 de abril' type='up' />
                <HighlightCard title='Saídas' amount='R$ 1.259,00' lastTransaction='Última saída dia 03 de abril' type='down' />
                <HighlightCard title='Total' amount='R$ 16.141,00' lastTransaction='01 à 16 de abril' type='total' />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>
                <TransactionList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
                
            </Transactions>
        </Container>
    )
}
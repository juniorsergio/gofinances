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
    TransactionList,
    LoadContainer
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

export interface DataListProps extends TransactionCardProps {
    id: string
}

interface HighlightProps {
    amount: string
}

interface HighlightData {
    entries: HighlightProps,
    expenses: HighlightProps,
    total: HighlightProps
}

export function Dashboard(){
    const [ isLoading, setIsLoading] = useState(true)
    const [ data, setData ] = useState<DataListProps[]>([])
    const [ highlightData, setHighlightData ] = useState<HighlightData>({} as HighlightData)

    const collectionKey = '@gofinances:transactions'

    async function loadTransactions(){
        const response = await AsyncStorage.getItem(collectionKey)
        const transactions = response ? JSON.parse(response) : []

        let entriesTotal = 0
        let expensesTotal = 0

        const transactionsFormatted: DataListProps[] = transactions.map((transaction: DataListProps) => {
            const amountNumber = Number(transaction.amount)
            
            if (transaction.type === 'positive'){
                entriesTotal += amountNumber
            }
            else if (transaction.type === 'negative'){
                expensesTotal += amountNumber
            }
            
            const amount = amountNumber
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

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })
            },
            expenses: {
                amount: expensesTotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })
            },
            total: {
                amount: (entriesTotal - expensesTotal).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }
        })

        setData(transactionsFormatted)
        setIsLoading(false)
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
            { isLoading ? <LoadContainer size='large' /> :
                <>
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
                        <HighlightCard
                            title='Entradas'
                            amount={highlightData.entries.amount}
                            lastTransaction='Última entrada dia 13 de abril'
                            type='up'
                        />

                        <HighlightCard
                            title='Saídas'
                            amount={highlightData.expenses.amount}
                            lastTransaction='Última saída dia 03 de abril'
                            type='down'
                        />

                        <HighlightCard
                            title='Total'
                            amount={highlightData.total.amount}
                            lastTransaction='01 à 16 de abril'
                            type='total'
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>
                        <TransactionList
                            data={data}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}
                        />            
                    </Transactions>
                </>
            }
        </Container>
    )
}
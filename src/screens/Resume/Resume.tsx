import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import { HistoryCard } from '../../components/HistoryCard/HistoryCard';
import { categories } from '../../utils/categories';
import {
    Container,
    Header,
    Title,
    Content
} from "./styles";

interface TransactionData {
    type: 'positive' | 'negative'
    name: string,
    amount: string,
    category: string,
    date: string
}

interface CategoryData {
    name: string,
    total: string,
    color: string
}

export function Resume(){
    const [ categoryResume, setCategoryResume ] = useState<CategoryData[]>([])

    async function loadData(){
        const collectionKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(collectionKey)
        const responseFormatted = response ? JSON.parse(response) : []

        const totalByCategory: CategoryData[] = []

        const expenses = responseFormatted.filter((expense: TransactionData) => expense.type === 'negative')
        categories.forEach(category => {
            let categorySum = 0

            expenses.forEach((expense: TransactionData) => {
                if (expense.category === category.key){
                    categorySum += Number(expense.amount)
                }
            })

            if(categorySum > 0){
                const total = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })

                totalByCategory.push({
                    name: category.name,
                    total: total,
                    color: category.color
                })
            }
        })

        setCategoryResume(totalByCategory)
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            <Content>
                {categoryResume.map(category => (
                    <HistoryCard
                        key={category.name}
                        title={category.name}
                        amount={category.total}
                        color={category.color}
                    />
                ))}
            </Content>
        </Container>
    )
}
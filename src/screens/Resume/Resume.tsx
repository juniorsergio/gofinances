import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native'
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { HistoryCard } from '../../components/HistoryCard/HistoryCard';
import { categories } from '../../utils/categories';

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month
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
    total: number,
    totalFormatted: string,
    color: string,
    percent: string
}

export function Resume(){
    const [ selectedDate, setSelectedDate ] = useState(new Date())
    const [ categoryResume, setCategoryResume ] = useState<CategoryData[]>([])
    const theme = useTheme()
    
    function handleDateChange(action: 'next' | 'previous'){
        (action === 'next')
            ? setSelectedDate(addMonths(selectedDate, 1))
            : setSelectedDate(subMonths(selectedDate, 1))
    }

    async function loadData(){
        const collectionKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(collectionKey)
        const responseFormatted = response ? JSON.parse(response) : []

        const totalByCategory: CategoryData[] = []

        const expenses = responseFormatted.filter((expense: TransactionData) =>
            expense.type === 'negative' &&
            new Date(expense.date).getMonth() === selectedDate.getMonth() &&
            new Date(expense.date).getFullYear() === selectedDate.getFullYear()
        )
        
        const expensesTotal = expenses.reduce((accumulator: number, expense: TransactionData) => {
            return accumulator + Number(expense.amount)
        }, 0)

        categories.forEach(category => {
            let categorySum = 0

            expenses.forEach((expense: TransactionData) => {
                if (expense.category === category.key){
                    categorySum += Number(expense.amount)
                }
            })

            if(categorySum > 0){
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = `${(categorySum * 100 / expensesTotal).toFixed(0)}%`

                totalByCategory.push({
                    name: category.name,
                    total: categorySum,
                    totalFormatted,
                    color: category.color,
                    percent
                })
            }
        })

        setCategoryResume(totalByCategory)
    }

    useEffect(() => {
        loadData()
    }, [selectedDate])

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flex: 1,
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight()
                }}
            >
                <MonthSelect>
                    <MonthSelectButton onPress={() => handleDateChange('previous')}>
                        <MonthSelectIcon name='chevron-left' />
                    </MonthSelectButton>

                    <Month>{ format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }</Month>

                    <MonthSelectButton onPress={() => handleDateChange('next')}>
                        <MonthSelectIcon name='chevron-right' />
                    </MonthSelectButton>
                </MonthSelect>

                <ChartContainer>
                    <VictoryPie
                        data={categoryResume}
                        colorScale={categoryResume.map(category => category.color)}
                        style={{
                            labels: { fontSize: 18, fontWeight: 'bold', fill: theme.colors.shape }
                        }}
                        labelRadius={50}
                        x='percent'
                        y='total'
                    />
                </ChartContainer>

                {categoryResume.map(category => (
                    <HistoryCard
                        key={category.name}
                        title={category.name}
                        amount={category.totalFormatted}
                        color={category.color}
                    />
                ))}
            </Content>
        </Container>
    )
}
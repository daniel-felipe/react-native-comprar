import { useEffect, useState } from 'react'
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { Button } from '@/components/Button'
import { Filter } from '@/components/Filter'
import { Input } from '@/components/Input'
import { Item } from '@/components/Item'
import { type ItemStorage, itemsStorage } from '@/storage/itemsStorage'
import { FilterStatus } from '@/types/filter-status'
import { styles } from './styles'

const FILTER_STATUSES: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]

export default function Home() {
	const [filter, setFilter] = useState(FilterStatus.PENDING)
	const [description, setDescription] = useState('')
	const [items, setItems] = useState<ItemStorage[]>([])

	async function handleAddItem() {
		if (!description.trim()) {
			return Alert.alert('Adicionar', 'Informa a descrição para adicionar.')
		}

		if (items.some((i) => i.description.toLowerCase() === description.trim().toLowerCase())) {
			return Alert.alert('Adicionar', 'Esse ítem já está na lista.')
		}

		const newItem = {
			id: Math.random().toString(36).substring(2),
			description: description.trim(),
			status: FilterStatus.PENDING,
		}

		await itemsStorage.add(newItem)
		await getItems()
	}

	async function getItems() {
		try {
			const response = await itemsStorage.get()
			setItems(response)
		} catch (error) {
			console.log(error)
			Alert.alert('Erro', 'Não foi possível filtrar os ítens.')
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: ...
	useEffect(() => {
		getItems()
	}, [])

	return (
		<View style={styles.container}>
			<Image source={require('@/assets/logo.png')} style={styles.logo} />

			<View style={styles.form}>
				<Input placeholder="O que você precisa comprar" onChangeText={setDescription} />
				<Button title="Entrar" onPress={handleAddItem} />
			</View>

			<View style={styles.content}>
				<View style={styles.header}>
					{FILTER_STATUSES.map((status) => (
						<Filter
							key={status}
							status={status}
							isActive={filter === status}
							onPress={() => setFilter(status)}
						/>
					))}

					<TouchableOpacity style={styles.clearButton}>
						<Text style={styles.clearText}>Limpar</Text>
					</TouchableOpacity>
				</View>

				<FlatList
					data={items}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<Item
							data={item}
							onStatus={() => console.log('Troca Status')}
							onRemove={() => console.log('Remover')}
						/>
					)}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContent}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
					ListEmptyComponent={() => <Text style={styles.empty}>Nenhum ítem aqui.</Text>}
				/>
			</View>
		</View>
	)
}

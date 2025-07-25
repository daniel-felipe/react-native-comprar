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
		filter === FilterStatus.PENDING ? await getItemsByStatus() : setFilter(FilterStatus.PENDING)

		Alert.alert('Adicionado', `Adicionado ${description}`)
		setDescription('')
	}

	async function handleRemoveItem(id: string) {
		try {
			await itemsStorage.remove(id)
			await getItemsByStatus()
		} catch (error) {
			console.error(error)
			Alert.alert('Remover', 'Não foi possível remover o item.')
		}
	}

	async function handleClearList() {
		Alert.alert('Limpar', 'Deseja remover todos os ítems da lista?', [
			{ text: 'Não', style: 'cancel' },
			{ text: 'Sim', onPress: () => onClear() },
		])
	}

	async function onClear() {
		try {
			await itemsStorage.clear()
			setItems([])
		} catch (error) {
			console.error(error)
			Alert.alert('Erro', 'Não foi possível remover todos os ítems.')
		}
	}

	async function getItemsByStatus() {
		try {
			const response = await itemsStorage.getByStatus(filter)
			setItems(response)
		} catch (error) {
			console.log(error)
			Alert.alert('Erro', 'Não foi possível filtrar os ítens.')
		}
	}

	async function handleToggleItemStatus(id: string) {
		try {
			await itemsStorage.toggleStatus(id)
			await getItemsByStatus()
		} catch (error) {
			console.error(error)
			Alert.alert('Erro', 'Não foi possível atualizar o status.')
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: ...
	useEffect(() => {
		getItemsByStatus()
	}, [filter])

	return (
		<View style={styles.container}>
			<Image source={require('@/assets/logo.png')} style={styles.logo} />

			<View style={styles.form}>
				<Input
					placeholder="O que você precisa comprar"
					onChangeText={setDescription}
					value={description}
				/>
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

					<TouchableOpacity style={styles.clearButton} onPress={handleClearList}>
						<Text style={styles.clearText}>Limpar</Text>
					</TouchableOpacity>
				</View>

				<FlatList
					data={items}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<Item
							data={item}
							onStatus={() => handleToggleItemStatus(item.id)}
							onRemove={() => handleRemoveItem(item.id)}
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

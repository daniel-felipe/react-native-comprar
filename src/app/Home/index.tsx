import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { Button } from '@/components/Button'
import { Filter } from '@/components/Filter'
import { Input } from '@/components/Input'
import { Item } from '@/components/Item'
import { FilterStatus } from '@/types/filter-status'
import { styles } from './styles'

const FILTER_STATUSES: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]
const ITEMS = [
	{
		id: '1',
		status: FilterStatus.PENDING,
		description: 'Comprar pão',
	},
	{
		id: '2',
		status: FilterStatus.PENDING,
		description: 'Comprar leite',
	},
	{
		id: '3',
		status: FilterStatus.DONE,
		description: 'Comprar ovos',
	},
]

export default function Home() {
	return (
		<View style={styles.container}>
			<Image source={require('@/assets/logo.png')} style={styles.logo} />

			<View style={styles.form}>
				<Input placeholder="O que você precisa comprar" />
				<Button title="Entrar" />
			</View>

			<View style={styles.content}>
				<View style={styles.header}>
					{FILTER_STATUSES.map((filterStatus) => (
						<Filter key={filterStatus} status={filterStatus} isActive />
					))}

					<TouchableOpacity style={styles.clearButton}>
						<Text style={styles.clearText}>Limpar</Text>
					</TouchableOpacity>
				</View>

				<FlatList
					data={ITEMS}
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

import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Button } from '@/components/Button'
import { Filter } from '@/components/Filter'
import { Input } from '@/components/Input'
import { FilterStatus } from '@/types/filter-status'
import { styles } from './styles'

const FILTER_STATUSES: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]

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
			</View>
		</View>
	)
}

import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native'
import { FilterStatus } from '@/types/filter-status'
import { styles } from './styles'

type FilterProps = TouchableOpacityProps & {
	status: FilterStatus
	isActive: boolean
}

export function Filter({ status, isActive, ...rest }: FilterProps) {
	return (
		<TouchableOpacity
			style={[styles.container, { opacity: isActive ? 1 : 0.5 }]}
			activeOpacity={0.8}
			{...rest}
		>
			<Text style={styles.title}>{status === FilterStatus.DONE ? 'Comprados' : 'Pendentes'}</Text>
		</TouchableOpacity>
	)
}

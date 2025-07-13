import { Image, View } from 'react-native'
import { Button } from '@/components/Button'
import { styles } from './styles'

export default function Home() {
	return (
		<View style={styles.container}>
			<Image source={require('@/assets/logo.png')} style={styles.logo} />

			<Button title="Entrar" />
		</View>
	)
}

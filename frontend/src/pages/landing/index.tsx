import { useMetadata } from '@/utils/helmet'

export default function Landing() {
	useMetadata({
		title: 'Minecraft Servers',
		description: 'Minecraft Servers',
		keywords: 'Minecraft, Servers, Minecraft Servers',
	})
	return <div>Landing</div>
}

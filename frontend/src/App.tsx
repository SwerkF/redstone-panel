import { BrowserRouter } from 'react-router-dom'

import { AppContent, AuthProvider } from './router'

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<AppContent />
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App

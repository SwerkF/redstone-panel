/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| Le fichier de routes sert à définir les routes HTTP.
|
*/

import '#auth/routes'
import '#offers/routes'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
	return {
		message: 'Hello World',
	}
})

router.get('/health', async () => {
	return {
		status: 'ok',
	}
})

import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'

const AuthController = () => import('./controller.js')

router
    .group(() => {
        router.post('/register', [AuthController, 'register'])
        router.post('/login', [AuthController, 'login'])
        router.post('/refresh', [AuthController, 'refresh'])
        router.post('/logout', [AuthController, 'logout'])
        router.get('/me', [AuthController, 'me']).middleware([middleware.auth()])
        router.delete('/cleanup-tokens', [AuthController, 'cleanupTokens'])
    })
    .prefix('/auth')

/**
 * Service d'authentification JWT
 * Gère l'authentification avec access token et refresh token
 */

import { AuthTokens, JwtPayload, UserResponse } from '#auth/types'
import prisma from '#config/prisma'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'

export default class AuthService {
	private readonly JWT_ACCESS_SECRET = env.get('JWT_ACCESS_SECRET')
	private readonly JWT_REFRESH_SECRET = env.get('JWT_REFRESH_SECRET')
	private readonly ACCESS_TOKEN_EXPIRES_IN = '1d'
	private readonly REFRESH_TOKEN_EXPIRES_IN = '30d'

	async register(userData: {
		email: string
		username: string
		password: string
	}) {
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ email: userData.email },
					{ username: userData.username },
				],
			},
		})

		if (existingUser) {
			throw new Error(
				"Un utilisateur avec cet email ou nom d'utilisateur existe déjà",
			)
		}

		const hashedPassword = await hash.make(userData.password)

		const user = await prisma.user.create({
			data: {
				email: userData.email,
				username: userData.username,
				password: hashedPassword,
			},
		})

		const tokens = await this.generateTokens(user)

		return {
			user: this.formatUserResponse(user),
			tokens,
		}
	}

	async login(email: string, password: string) {
		const user = await prisma.user.findUnique({
			where: { email },
		})

		if (!user) {
			return null
		}

		const isPasswordValid = await hash.verify(user.password, password)

		if (!isPasswordValid) {
			return null
		}

		const tokens = await this.generateTokens(user)

		return {
			user: this.formatUserResponse(user),
			tokens,
		}
	}

	async refreshTokens(refreshToken: string) {
		try {
			const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET)

			if (typeof decoded === 'string') {
				throw new Error('Token invalide')
			}

			const storedToken = await prisma.refreshToken.findUnique({
				where: { token: refreshToken },
				include: { user: true },
			})

			if (!storedToken || storedToken.expiresAt < new Date()) {
				throw new Error('Token invalide ou expiré')
			}

			await prisma.refreshToken.delete({
				where: { id: storedToken.id },
			})

			const tokens = await this.generateTokens(storedToken.user)

			return {
				user: this.formatUserResponse(storedToken.user),
				tokens,
			}
		} catch (error) {
			throw new Error('Token de rafraîchissement invalide')
		}
	}

	async logout(refreshToken?: string) {
		if (refreshToken) {
			await prisma.refreshToken.deleteMany({
				where: { token: refreshToken },
			})
		}
		return { message: 'Déconnexion réussie' }
	}

	async verifyAccessToken(token: string): Promise<JwtPayload> {
		try {
			const decoded = jwt.verify(token, this.JWT_ACCESS_SECRET)

			if (typeof decoded === 'string') {
				throw new Error('Token invalide')
			}

			return decoded as JwtPayload
		} catch (error) {
			throw new Error("Token d'accès invalide")
		}
	}

	async getCurrentUser(email: string) {
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				username: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		return user
	}

	private async generateTokens(user: {
		id: number
		email: string
		username: string
	}): Promise<AuthTokens> {
		const payload: JwtPayload = {
			sub: user.id.toString(),
			email: user.email,
			username: user.username,
		}

		const accessToken = jwt.sign(payload, this.JWT_ACCESS_SECRET, {
			expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
		})

		const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, {
			expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
		})

		const expiresAt = new Date()
		expiresAt.setDate(expiresAt.getDate() + 30)

		await prisma.refreshToken.create({
			data: {
				userId: user.id,
				token: refreshToken,
				expiresAt,
			},
		})

		return {
			accessToken,
			refreshToken,
			expiresIn: 86400,
		}
	}

	private formatUserResponse(user: {
		id: number
		email: string
		username: string
		createdAt: Date
	}): UserResponse {
		return {
			id: user.id,
			email: user.email,
			username: user.username,
			createdAt: user.createdAt,
		}
	}

	async cleanupExpiredTokens() {
		const result = await prisma.refreshToken.deleteMany({
			where: {
				expiresAt: {
					lt: new Date(),
				},
			},
		})
		return result.count
	}
}

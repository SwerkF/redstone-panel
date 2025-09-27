import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
	vine.object({
		email: vine.string().email().normalizeEmail(),
		username: vine.string().minLength(3).maxLength(50),
		password: vine
			.string()
			.minLength(8)
			.maxLength(100)
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/,
			),
	}),
)

export const loginValidator = vine.compile(
	vine.object({
		email: vine.string().email().normalizeEmail(),
		password: vine.string().minLength(1),
	}),
)

export const refreshTokenValidator = vine.compile(
	vine.object({
		refreshToken: vine.string().minLength(1),
	}),
)

export const forgotPasswordValidator = vine.compile(
	vine.object({
		email: vine.string().email().normalizeEmail(),
	}),
)

export const resetPasswordValidator = vine.compile(
	vine.object({
		token: vine.string().minLength(1),
		password: vine.string().minLength(6).maxLength(100),
		passwordConfirmation: vine
			.string()
			.confirmed({ confirmationField: 'password' }),
	}),
)

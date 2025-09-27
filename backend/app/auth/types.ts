export interface JwtPayload {
    sub: string
    email: string
    username: string
    iat?: number
    exp?: number
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
    expiresIn: number
}

export interface UserResponse {
    id: number
    email: string
    username: string
    createdAt: Date
}

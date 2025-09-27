import { Eye, EyeOff } from 'lucide-react'

import React, { useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
}

export const Input: React.FC<InputProps> = ({
	label,
	type = 'text',
	error,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false)

	const isPassword = type === 'password'
	const inputType = isPassword && showPassword ? 'text' : type

	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label className="mb-1 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}
			<div className="relative">
				<input
					type={inputType}
					className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
						error
							? 'border-red-500 focus:ring-red-200'
							: 'border-gray-300 focus:ring-blue-200'
					}`}
					{...props}
				/>
				{isPassword && (
					<button
						type="button"
						tabIndex={-1}
						className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
						onClick={() => setShowPassword(prev => !prev)}
						aria-label={
							showPassword
								? 'Masquer le mot de passe'
								: 'Afficher le mot de passe'
						}
					>
						{showPassword ? (
							<EyeOff size={18} />
						) : (
							<Eye size={18} />
						)}
					</button>
				)}
			</div>
			{error && (
				<span className="text-xs text-red-600 mt-1">{error}</span>
			)}
		</div>
	)
}

export default Input

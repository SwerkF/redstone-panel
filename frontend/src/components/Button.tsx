import React from 'react'

interface ButtonProps {
	children: React.ReactNode
	onClick?: () => void
	variant?: 'primary' | 'secondary'
	disabled?: boolean
}

export default function Button({
	children,
	onClick,
	variant = 'primary',
	disabled = false,
}: ButtonProps) {
	const baseClasses = 'px-4 py-2 rounded font-medium transition-colors'
	const variantClasses = {
		primary:
			'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
		secondary:
			'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
	}

	return (
		<button
			className={`${baseClasses} ${variantClasses[variant]}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	)
}

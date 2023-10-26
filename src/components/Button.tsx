import { ReactNode } from "react"

interface ButtonProps {
	icon: ReactNode
	onClick: () => void
}

const Button = (props: ButtonProps) => {
	return (
		<button
			onClick={props.onClick}
			className="font-bold bg-black text-white px-4 py-2 rounded text-2xl"
		>
			{props.icon}
		</button>
	)
}

export default Button

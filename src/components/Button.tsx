interface ButtonProps {
	text: string
	onClick: () => void
}

const Button = (props: ButtonProps) => {
	return (
		<button
			onClick={props.onClick}
			className="font-bold bg-black text-white px-10 py-3 rounded text-lg"
		>
			{props.text}
		</button>
	)
}

export default Button

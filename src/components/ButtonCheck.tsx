interface ButtonCheckProps {
	text: string
	onClick: () => void
	active: boolean
}
const ButtonCheck = (props: ButtonCheckProps) => {
	const className = props.active
		? "bg-black text-white border"
		: "bg-white text-black border"
	return (
		<button className={`px-4 py-2 ${className}`} onClick={props.onClick}>
			{props.text}
		</button>
	)
}

export default ButtonCheck

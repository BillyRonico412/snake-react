interface BoxProps {
	active: boolean
}

const Box = (props: BoxProps) => {
	const className = (() => {
		if (props.active) {
			return "bg-black"
		}
		return "bg-white"
	})()
	return <div className={`w-4 aspect-square ${className}`} />
}

export default Box

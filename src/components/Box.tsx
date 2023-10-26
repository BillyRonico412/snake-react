import { SizeValue } from "../state"

interface BoxProps {
	active: boolean
	size: SizeValue
}

const Box = (props: BoxProps) => {
	const classNameBg = (() => {
		if (props.active) {
			return "bg-black"
		}
		return "bg-white"
	})()
	const classNameSize = (() => {
		switch (props.size) {
			case 10:
				return "w-8"
			case 20:
				return "w-4"
			case 30:
				return "w-2"
		}
	})()
	return <div className={`w-4 aspect-square ${classNameBg} ${classNameSize}`} />
}

export default Box

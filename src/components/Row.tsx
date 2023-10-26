import { SizeValue } from "../state"
import Box from "./Box"

interface RowProps {
	indexRow: number
	row: boolean[]
	size: SizeValue
}

const Row = (props: RowProps) => {
	return (
		<div className="flex">
			{props.row.map((active, index) => (
				<Box
					key={props.row.length * props.indexRow + index}
					active={active}
					size={props.size}
				/>
			))}
		</div>
	)
}

export default Row

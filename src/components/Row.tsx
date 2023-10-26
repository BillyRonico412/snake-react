import Box from "./Box"

interface RowProps {
	indexRow: number
	row: boolean[]
}

const Row = (props: RowProps) => {
	return (
		<div className="flex">
			{props.row.map((active, index) => (
				<Box key={props.row.length * props.indexRow + index} active={active} />
			))}
		</div>
	)
}

export default Row

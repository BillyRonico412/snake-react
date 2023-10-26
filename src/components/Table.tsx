import { SizeValue } from "../state"
import Row from "./Row"

interface TableProps {
	table: boolean[][]
	size: SizeValue
}

const Table = (props: TableProps) => {
	return (
		<div className="border-2 border-black/50">
			{props.table.map((row, index) => (
				<Row key={index} indexRow={index} row={row} size={props.size} />
			))}
		</div>
	)
}

export default Table

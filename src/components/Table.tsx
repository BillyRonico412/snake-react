import Row from "./Row"

interface TableProps {
	table: boolean[][]
}

const Table = (props: TableProps) => {
	return (
		<div className="border-2 border-black/50">
			{props.table.map((row, index) => (
				<Row key={index} indexRow={index} row={row} />
			))}
		</div>
	)
}

export default Table

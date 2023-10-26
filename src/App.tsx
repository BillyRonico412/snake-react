import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import Table from "./components/Table"
import { machine } from "./state"
import { useSwipeable } from "react-swipeable"

const App = () => {
	const [state, send] = useMachine(machine)

	const handlers = useSwipeable({
		onSwipedLeft: () =>
			send({
				type: "CHANGE_DIRECTION",
				direction: "left",
			}),
		onSwipedRight: () =>
			send({
				type: "CHANGE_DIRECTION",
				direction: "right",
			}),
		onSwipedUp: () =>
			send({
				type: "CHANGE_DIRECTION",
				direction: "up",
			}),
		onSwipedDown: () =>
			send({
				type: "CHANGE_DIRECTION",
				direction: "down",
			}),
	})

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowUp":
					send({
						type: "CHANGE_DIRECTION",
						direction: "up",
					})
					break
				case "ArrowDown":
					send({
						type: "CHANGE_DIRECTION",
						direction: "down",
					})
					break
				case "ArrowLeft":
					send({
						type: "CHANGE_DIRECTION",
						direction: "left",
					})
					break

				case "ArrowRight":
					send({
						type: "CHANGE_DIRECTION",
						direction: "right",
					})
					break
			}
		}
		window.addEventListener("keydown", handler)
		return () => {
			window.removeEventListener("keydown", handler)
		}
	}, [send])

	if (state.matches("idle")) {
		return (
			<div className="w-screen h-screen flex flex-col gap-y-8 justify-center items-center">
				<h1 className="text-8xl font-bold">Snake</h1>
				<button
					onClick={() => {
						send("PLAY")
					}}
					className="font-bold bg-black text-white px-12 py-6 rounded text-4xl shadow"
				>
					Play
				</button>
			</div>
		)
	}
	if (state.matches("gameover")) {
		return (
			<div className="w-screen h-screen flex flex-col gap-y-8 justify-center items-center">
				<h1 className="text-6xl font-bold">Game Over</h1>
				<button
					onClick={() => {
						send("RESET")
					}}
					className="font-bold bg-black text-white px-8 py-4 rounded text-xl"
				>
					Reset
				</button>
			</div>
		)
	}

	const table = ((): boolean[][] => {
		const table: boolean[][] = []
		for (let i = 0; i < state.context.size; i++) {
			table[i] = []
			for (let j = 0; j < state.context.size; j++) {
				table[i][j] = false
			}
		}
		for (const posSnake of state.context.snake) {
			table[posSnake.x][posSnake.y] = true
		}
		table[state.context.food.x][state.context.food.y] = true
		return table
	})()

	return (
		<div
			className="flex justify-center items-center w-screen h-screen"
			{...handlers}
		>
			<Table table={table} />
		</div>
	)
}

export default App

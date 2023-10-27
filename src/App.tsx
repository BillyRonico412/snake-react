import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import { useSwipeable } from "react-swipeable"
import Button from "./components/Button"
import ButtonCheck from "./components/ButtonCheck"
import Table from "./components/Table"
import { SizeValue, SpeedValue, machine } from "./state"
import { GiSnakeBite } from "react-icons/gi"
import { LuArrowLeftCircle, LuCog, LuPlay } from "react-icons/lu"
import { MdOutlineLoop, MdSpeed } from "react-icons/md"
import { BsTextareaResize } from "react-icons/bs"

const speedInfos: [SpeedValue, string][] = [
	[200, "Slow"],
	[100, "Medium"],
	[50, "Fast"],
]

const sizeInfos: [SizeValue, string][] = [
	[10, "Small"],
	[20, "Medium"],
	[30, "Large"],
]

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
			<div className="w-screen h-screen flex flex-col gap-y-16 justify-center items-center">
				<h1 className="text-9xl font-bold">
					<GiSnakeBite />
				</h1>
				<div className="flex gap-x-4 items-center">
					<Button
						onClick={() => {
							send("PLAY")
						}}
						icon={<LuPlay />}
					/>
					<Button
						onClick={() => {
							send("SETTINGS")
						}}
						icon={<LuCog />}
					/>
				</div>
			</div>
		)
	}
	if (state.matches("gameover")) {
		return (
			<div className="w-screen h-screen flex flex-col gap-y-8 justify-center items-center">
				<h1 className="text-2xl font-bold">Game Over</h1>
				<p className="text-lg">Score: {state.context.score}</p>
				<div className="flex gap-x-4">
					<Button
						onClick={() => {
							send("PLAY_AGAIN")
						}}
						icon={<MdOutlineLoop />}
					/>
					<Button
						onClick={() => {
							send("BACK")
						}}
						icon={<LuArrowLeftCircle />}
					/>
				</div>
			</div>
		)
	}

	if (state.matches("settings")) {
		return (
			<div className="w-screen h-screen flex flex-col gap-y-8 justify-center items-center">
				<div className="flex flex-col gap-y-4">
					<div className="flex justify-center font-bold text-5xl">
						<MdSpeed />
					</div>
					<div>
						{speedInfos.map(([speed, text]) => (
							<ButtonCheck
								key={speed}
								text={text}
								active={state.context.speed === Number(speed)}
								onClick={() => {
									send({
										type: "CHANGE_SETTINGS",
										payload: {
											speed,
										},
									})
								}}
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-y-2">
					<div className="flex justify-center font-bold text-4xl">
						<BsTextareaResize />
					</div>
					<div>
						{sizeInfos.map(([size, text]) => (
							<ButtonCheck
								key={size}
								text={text}
								active={state.context.size === Number(size)}
								onClick={() => {
									send({
										type: "CHANGE_SETTINGS",
										payload: {
											size,
										},
									})
								}}
							/>
						))}
					</div>
				</div>
				<Button icon={<LuArrowLeftCircle />} onClick={() => send("BACK")} />
			</div>
		)
	}

	if (state.matches("playing")) {
		const table = ((): boolean[][] => {
			const table: boolean[][] = []
			for (let i = 0; i < state.context.size; i++) {
				table[i] = []
				for (let j = 0; j < state.context.size; j++) {
					table[i][j] = false
				}
			}
			for (const posSnake of state.context.snake) {
				if (
					posSnake.x < 0 ||
					posSnake.y < 0 ||
					posSnake.x >= state.context.size ||
					posSnake.y >= state.context.size
				) {
					continue
				}
				table[posSnake.x][posSnake.y] = true
			}
			table[state.context.food.x][state.context.food.y] = true
			return table
		})()

		return (
			<div
				className="flex flex-col gap-y-4 justify-center items-center w-screen h-screen font-bold"
				{...handlers}
			>
				<p>Score: {state.context.score}</p>
				<Table table={table} size={state.context.size} />
				<p>
					Level:{" "}
					{speedInfos.find(([speed]) => speed === state.context.speed)?.[1]} -{" "}
					Size: {sizeInfos.find(([size]) => size === state.context.size)?.[1]}
				</p>
			</div>
		)
	}
	return <></>
}

export default App

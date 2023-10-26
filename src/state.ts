import { assign, createMachine } from "xstate"

export type SpeedValue = 200 | 100 | 50
export type SizeValue = 10 | 20 | 30

type Direction = "left" | "right" | "up" | "down"
interface Position {
	x: number
	y: number
}

interface Context {
	speed: SpeedValue
	currentDirection: Direction
	newDirection: Direction
	size: SizeValue
	snake: Position[]
	food: Position
	score: number
}

type Event =
	| {
			type: "PLAY"
	  }
	| {
			type: "CHANGE_DIRECTION"
			direction: Direction
	  }
	| {
			type: "MOVE"
	  }
	| {
			type: "RESET"
	  }
	| {
			type: "SETTINGS"
	  }
	| {
			type: "CHANGE_SETTINGS"
			payload: {
				speed?: SpeedValue
				size?: SizeValue
			}
	  }
	| {
			type: "BACK"
	  }

export const machine = createMachine<Context, Event>({
	predictableActionArguments: true,
	context: {
		speed: 100,
		currentDirection: "right",
		newDirection: "right",
		size: 20,
		snake: [{ x: 0, y: 0 }],
		food: { x: 5, y: 5 },
		score: 0,
	},
	initial: "idle",
	states: {
		idle: {
			on: {
				PLAY: "playing",
				SETTINGS: "settings",
			},
		},
		playing: {
			invoke: {
				src: (context) => (callback) => {
					const interval = setInterval(() => {
						callback("MOVE")
					}, context.speed)
					return () => clearInterval(interval)
				},
			},
			on: {
				CHANGE_DIRECTION: {
					actions: assign({
						newDirection: (context, event) => {
							switch (event.direction) {
								case "up":
									if (context.currentDirection === "down") {
										return "down"
									}
									return "up"
								case "down":
									if (context.currentDirection === "up") {
										return "up"
									}
									return "down"
								case "left":
									if (context.currentDirection === "right") {
										return "right"
									}
									return "left"
								case "right":
									if (context.currentDirection === "left") {
										return "left"
									}
									return "right"
							}
						},
					}),
				},
				MOVE: [
					{
						cond: (context) =>
							(context.currentDirection === "up" && context.snake[0].x === 0) ||
							(context.currentDirection === "down" &&
								context.snake[0].x === context.size - 1) ||
							(context.currentDirection === "left" &&
								context.snake[0].y === 0) ||
							(context.currentDirection === "right" &&
								context.snake[0].y === context.size - 1) ||
							context.snake
								.slice(1)
								.some(
									(posSnake) =>
										posSnake.x === context.snake[0].x &&
										posSnake.y === context.snake[0].y,
								),
						target: "gameover",
					},
					{
						actions: assign((context) => {
							const [head] = context.snake
							const newHead = ((): Position => {
								switch (context.newDirection) {
									case "up":
										return { x: head.x - 1, y: head.y }
									case "down":
										return { x: head.x + 1, y: head.y }
									case "left":
										return { x: head.x, y: head.y - 1 }
									case "right":
										return { x: head.x, y: head.y + 1 }
								}
							})()
							if (
								newHead.x === context.food.x &&
								newHead.y === context.food.y
							) {
								const allPositionFree = ((): Position[] => {
									const allPositionFree: Position[] = []
									for (let i = 0; i < context.size; i++) {
										for (let j = 0; j < context.size; j++) {
											if (
												context.snake.every(
													(posSnake) => posSnake.x !== i && posSnake.y !== j,
												) &&
												context.food.x !== i &&
												context.food.y !== j
											) {
												allPositionFree.push({
													x: i,
													y: j,
												})
											}
										}
									}
									return allPositionFree
								})()
								return {
									snake: [newHead, ...context.snake],
									food: allPositionFree[
										Math.floor(Math.random() * allPositionFree.length)
									],
									currentDirection: context.newDirection,
									score: context.score + 1,
								}
							}
							return {
								snake: [newHead, ...context.snake.slice(0, -1)],
								currentDirection: context.newDirection,
							}
						}),
					},
				],
			},
		},
		gameover: {
			on: {
				RESET: {
					target: "idle",
					actions: assign({
						currentDirection: "right",
						newDirection: "right",
						snake: [{ x: 0, y: 0 }],
						food: { x: 5, y: 5 },
						score: 0,
					}),
				},
			},
		},
		settings: {
			on: {
				CHANGE_SETTINGS: {
					actions: assign((context, event) => {
						return {
							speed: event.payload.speed ?? context.speed,
							size: event.payload.size ?? context.size,
						}
					}),
				},
				BACK: "idle",
			},
		},
	},
})

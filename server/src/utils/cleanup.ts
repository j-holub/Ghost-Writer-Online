import { writeFileSync } from "fs";
import { Game } from "../objects/Game";
import { games, conf, log } from "../main";

export function processExit() {
	/**
	 * This is the cleanup code that runs when the server has been exited for
	 * any reason. We check all games if they have any active connection(s),
	 * then if they do, we save the game to disk, if not we just delete it
	 * completely from the system.
	 */
	log.info(`Cleaning up games`)
	for (var gc in games) {
		let game = games[gc];
		if (activeGame(game)) {
			game.log.debug(`Saving to datastore`);
			writeFileSync(
				`${conf.datastores.directory}/${game.id}.game`,
				JSON.stringify(game.toJSON())
			);
		} else {
			game.log.debug(`Deleting game`);
			delete games[gc];
		};
	};
	log.info(`Done cleaning up games`);
};


export async function checkSocketConnections() {
	/**
	 * This is the cleanup that occurs whenever a new game has been started
	 */
	log.info(`[checkSocketConnections] Checking for games to clean up`)
	for (var gc in games) {
		let game = games[gc];
		if (!activeGame(game)) {
			game.log.debug(`[checkSocketConnections] Deleting game`);
			delete games[gc];
		};
	};
	log.info(`[checkSocketConnections] Done cleaning up games`);
};


function activeGame(game: Game): boolean {
	/**
	 * This checks if a game is still active by checking that is at least one
	 * socket client still connected. If not then the game is considered
	 * stagnant and will be deleted by the cleanup code.
	 */
	for (var player of game.players) {
		if (player.socket.connected) {
			return true;
		};
	};
	return false;
};
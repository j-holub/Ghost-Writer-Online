import { Socket } from "socket.io";

export class Player {
	readonly name: string;
	public team: team|null = null;
	public role: role|null = null;
	public socket: Socket|null;
	readonly isHost: boolean;

	constructor(name: string, socket: Socket|null=null, isHost=false) {
		this.name = name;
		this.socket = socket;
		this.isHost = isHost;
	};

	public toJSON(): datastorePlayer {
		return {
			name: this.name,
			host: this.isHost,
			team: this.team,
			role: this.role,
		};
	};

	public static fromJSON(data: datastorePlayer): Player {
		let player = new this(data.name, null, data.host);
		player.role = data.role;
		player.team = data.team;
		return player;
	};
};
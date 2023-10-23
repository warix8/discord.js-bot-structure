import { DataSource, Repository } from "typeorm";
import Client from "../../main";
import { GuildModel } from "../database/models/Guild";

class DatabaseManager {
	private _client: typeof Client;
	dataSource: DataSource;
    guilds: Repository<GuildModel>;

	constructor(client: typeof Client) {
		this._client = client;
		this.dataSource = new DataSource({
			type: "mysql",
			host: "localhost",
			port: 3306,
			username: "root",
			password: "",
			database: "bot",
			synchronize: true,
			logging: true,
			entities: [GuildModel],
			subscribers: [],
			migrations: []
		});
	}

	async loadDatabase() {
		await this.dataSource.initialize(); //Do not catch here - the catch is in main in order to crash the bot if database isn't working

        this.guilds = this.dataSource.getRepository(GuildModel);
	}
}

export default DatabaseManager;

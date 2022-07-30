export interface ConfigFile {
	bot: {
		token: string;
		ownersIDs: string[];
	};
	mainLang: string;
	testGuild: string;
}

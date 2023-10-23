import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class GuildModel {
	@PrimaryColumn()
	id: string;
	lang: string;
}

export const defaultGuildSettings = {
	lang: "en-GB"
};

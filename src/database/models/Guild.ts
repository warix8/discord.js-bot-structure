import { Column, Entity, PrimaryColumn } from "typeorm";

// https://typeorm.io/

@Entity()
export class GuildModel {
	@PrimaryColumn()
	id: string;

	@Column()
	lang: string;
}

export const defaultGuildSettings = {
	lang: "gb"
};

/* eslint-disable no-undef */
"use strict";

import { readdir, readFile } from "fs/promises";
import { resolve } from "path";
import OrionI18n, { bundles } from "../managers/Bot-I18n";

class I18n {
	i18n: typeof OrionI18n;
	availableLangs: string[];

	constructor() {
		this.i18n = OrionI18n;
		this.availableLangs = [];
	}

	async loader() {
		const translationsPath = resolve(__dirname, "translations");
		const files = await readdir(translationsPath);
		const bundles: bundles = {};

		for (const file of files) {
			if (file.endsWith(".json")) {
				const data = await readFile(resolve(translationsPath, file));
				const lang = file.split(".")[0];
				this.availableLangs.push(lang);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				bundles[lang] = JSON.parse(data);
			}
		}

		if (this.availableLangs.length > 0) {
			this.i18n.init(bundles, "EUR");
			this.i18n.use("gb");
		}
	}

	use(lang: string) {
		this.i18n.use(lang);
		return this;
	}

	translate(text: TemplateStringsArray | string[], ...values: unknown[]) {
		return this.i18n.translate(text, ...values);
	}

	bundleSelectKeys(str: string) {
		return this.i18n.bundleSelectKeys(str);
	}

	translateCommand(str: string) {
		return this.i18n.bundleSelectKeys(`strings._note0_list.${str}`);
	}
}

export default I18n;

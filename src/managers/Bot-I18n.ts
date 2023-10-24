/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// If someone can remove them without problems you can try
"use strict";

const typeInfoRegex = /^:([a-z])(\((.+)\))?/;

export interface bundle {
    locale: string;
    currency: string;
    strings: {
        [key: string]: string
    };
}

export interface bundles {
    [key: string]: bundle;
}

class BotI18n {
    static bundles: bundles;
    static defaultCurrency: string;
    static lang: string;
    static locale: string;
    static currency: string;

    public static init(bundles: bundles, defaultCurrency: string) {
        this.bundles = bundles;
        this.defaultCurrency = defaultCurrency;
    }

    public static use(lang: string) {
        this.lang = lang;
        this.locale = this.bundles[lang].locale;
        this.currency = this.bundles[lang].currency;
    }

    static translate(literals: any, ...values: any[]) {
        const key = this._buildKey(literals);
        const str = this.bundles[this.lang].strings[key];
        if (str) {
            const iValues = literals.slice(1).map(this._extractTypeInfo);
            const lvalues = values.map((v, i) => this._localize(v, iValues[i]));
            return this._buildMessage(str, ...lvalues);
        } else {
            console.error(`Translation key is not present in ${this.locale}.json for " \n${key} "`);
            return this._buildMessage(key, values);
        }
    }

    static bundleFormLocale(locale: string) {
        for (const key of Object.keys(this.bundles)) {
            const bundle = this.bundles[key];
            if (bundle.locale === locale) return key;
        }
        return null;
    }

    static _extractTypeInfo(literals: string) {
        const match = typeInfoRegex.exec(literals);
        if (match) return {type: match[1], options: match[3]};
        else return {type: "s", options: ""};
    }

    static _localize(value: any, {type, options}: { type: string; options: string; }) {
        const _localizers: { [key: string]: any } = {
            "s": (e: { toLocaleString: (arg0: any) => any; }) => e.toLocaleString(this.locale),
            "c": (e: { toLocaleString: (arg0: any, arg1: { style: string; currency: any; }) => void; }) => {
                e.toLocaleString(this.locale, {
                    style: "currency",
                    currency: this.currency || this.defaultCurrency
                });
            },
            "n": (e: { toLocaleString: (arg0: any, arg1: { min: any; max: any; }) => void; }, f: any) => {
                e.toLocaleString(this.locale, {
                    min: f,
                    max: f
                });
            },
        };
        return _localizers[type](value, options);
    }

    static _buildKey(literals: any[]) {
        const strip = (s: string) => s.replace(typeInfoRegex, "");
        const last = strip(literals[literals.length - 1]);
        const prepend = (memo: any, curr: any, i: any) => `${strip(curr)}{${i}}${memo}`;

        return literals.slice(0, -1).reduceRight(prepend, last);
    }

    static _buildMessage(str: string, ...values: any[]) {
        return str.replace(/{(\d)}/g, (_, i) => values[Number(i)]);
    }

    static bundleSelectKeys(str: string) {
        const keys = str.split(".");
        let current: any = this.bundles[this.lang];
        keys.forEach((key: string) => {
            current = current[key];
        });
        return current;
    }

}

export default BotI18n;
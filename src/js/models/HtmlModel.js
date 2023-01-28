import { JSDOM } from "jsdom";

class HtmlModel {
    constructor(rawHtml) {
        const doc = new JSDOM(rawHtml).window.document;
        this.doc = doc;
        
        this.validate(doc);
        this.parse(doc);
    }

    validate(doc) {
        throw new Error('validate() must be implemented.');
    }

    parse(doc) {
        throw new Error('parse() must be implemented.');
    }
}

export default HtmlModel;
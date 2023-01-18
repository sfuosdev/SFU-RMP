class HtmlModel {
    constructor(rawHtml) {
        const jsdom = require("jsdom");
        const doc = new jsdom.JSDOM(rawHtml).window.document;
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
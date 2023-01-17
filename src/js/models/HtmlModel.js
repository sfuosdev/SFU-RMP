class HtmlModel {
    constructor(rawHtml) {
        this.validate(rawHtml);
    }

    validate(rawHtml) {
        throw new Error('validate() must be implemented.');
    } 
}

export default HtmlModel;
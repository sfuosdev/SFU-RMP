class HtmlValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "HtmlValidationError";
    }
}

class HtmlParserError extends Error {
    constructor(message) {
        super(message);
        this.name = "HtmlParserError";
    }
}

export {
    HtmlValidationError,
    HtmlParserError
}

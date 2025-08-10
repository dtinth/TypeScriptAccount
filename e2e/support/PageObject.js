export class PageObject {
    context;
    constructor(context) {
        this.context = context;
    }
    get page() {
        return this.context.page;
    }
}

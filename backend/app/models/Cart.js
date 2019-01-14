export default class Cart {
    constructor(id, items = [], total = 0) {
        this.id = id;
        this.items = items;
        this.total = total;
    }
}

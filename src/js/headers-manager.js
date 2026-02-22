export default class HeadersManager {
    #apiLab;
    #containerId = 'at-headers-container';
    #listId = 'at-headers-list';

    constructor(apiLab) {
        this.#apiLab = apiLab;
    }

    getHtml() {
        return `
            <div id="${this.#containerId}" class="${this.#apiLab.style("panelContainer")}">
                <div id="${this.#listId}"></div>
                <button type="button" id="at-add-header-btn" class="${this.#apiLab.style("addRowBtn")}">
                    + Adicionar Header
                </button>
            </div>
        `;
    }

    addRow(key = '', value = '') {
        const list = document.querySelector(`#${this.#listId}`);
        if (!list) return;

        const rowHtml = document.createElement('div');
        rowHtml.className = this.#apiLab.style("dynamicRow");
        
        rowHtml.innerHTML = `
            <input type="text" class="${this.#apiLab.style("input")}" placeholder="Key" value="${key}" style="flex:1">
            <input type="text" class="${this.#apiLab.style("input")}" placeholder="Value" value="${value}" style="flex:1">
            <button type="button" class="${this.#apiLab.style("removeRowBtn")}">×</button>
        `;

        rowHtml.querySelector('button').addEventListener('click', () => rowHtml.remove());
        list.appendChild(rowHtml);
    }

    clear() {
        const list = document.querySelector(`#${this.#listId}`);
        if(list) list.innerHTML = '';
        this.addRow(); 
    }

    getData() {
        const list = document.querySelector(`#${this.#listId}`);
        if (!list) return {};

        const headers = {};
        const rows = list.querySelectorAll(`.${this.#apiLab.style("dynamicRow")}`);
        
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            const key = inputs[0].value.trim();
            const value = inputs[1].value.trim();
            if (key) headers[key] = value;
        });

        return headers;
    }

    fillData(headersObj) {
        const list = document.querySelector(`#${this.#listId}`);
        if (!list) return;
        list.innerHTML = '';

        if (!headersObj || Object.keys(headersObj).length === 0) {
            this.addRow();
            return;
        }

        Object.entries(headersObj).forEach(([key, value]) => {
            this.addRow(key, value);
        });
    }
}
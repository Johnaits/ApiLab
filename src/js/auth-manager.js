export default class AuthManager {
    #apiLab;
    #containerId = 'at-auth-container';

    constructor(apiLab) {
        this.#apiLab = apiLab;
    }

    getHtml() {
        return `
            <div id="${this.#containerId}" class="${this.#apiLab.style("panelContainer")}">
                <div class="${this.#apiLab.style("inputGroup")}" style="margin-bottom: 10px">
                    <select id="at-auth-type" class="${this.#apiLab.style("select")}" style="border-right: 1px solid #444">
                        <option value="none">No Auth</option>
                        <option value="bearer">Bearer Token</option>
                    </select>
                </div>

                <div id="at-auth-params" style="display:none;">
                    <label class="${this.#apiLab.style("label")}">Token:</label>
                    <input type="text" id="at-auth-token" 
                        class="${this.#apiLab.style("input")}" 
                        style="border: 1px solid #444; borderRadius: 4px; width: 100%"
                        placeholder="ey..." autocomplete="off">
                </div>
            </div>
        `;
    }

    getData() {
        const type = document.querySelector('#at-auth-type').value;
        const token = document.querySelector('#at-auth-token').value.trim();

        if (type === 'bearer' && token) {
            return { 'Authorization': `Bearer ${token}` };
        }
        return {}; 
    }
    
    getState() {
        return {
            type: document.querySelector('#at-auth-type').value,
            token: document.querySelector('#at-auth-token').value
        };
    }

    fillData(authData) {
        const typeSelect = document.querySelector('#at-auth-type');
        const tokenInput = document.querySelector('#at-auth-token');
        const paramsDiv = document.querySelector('#at-auth-params');

        if (!authData) {
            typeSelect.value = 'none';
            paramsDiv.style.display = 'none';
            tokenInput.value = '';
            return;
        }

        typeSelect.value = authData.type || 'none';
        tokenInput.value = authData.token || '';
        paramsDiv.style.display = (authData.type === 'bearer') ? 'block' : 'none';
    }
}
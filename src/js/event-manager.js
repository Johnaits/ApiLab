export default class EventManager {
    #apiLab;

    constructor(apiLab) {
        this.#apiLab = apiLab;
    }

    attachAll() {
        this.#attachSendEvent();
        this.#attachThemeToggle();
        this.#attachSaveFlow();
        this.#attachSavedListChange();
        this.#attachDeleteFlow();
        this.#attachMethodChange();
        this.#attachFormatBody();
        this.#attachFullscreenToggle();
        this.#attachTabs();
        this.#attachHeaderControls();
        this.#attachAuthControls();
    }

    #attachTabs() {
        const tabs = document.querySelectorAll(`.${this.#apiLab.style("tabBtn")}`);
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll(`.${this.#apiLab.style("tabBtn")}`).forEach(t => t.classList.remove('active'));
                document.querySelectorAll(`.${this.#apiLab.style("tabContent")}`).forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                const targetId = e.target.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    #attachHeaderControls() {
        const addBtn = document.querySelector('#at-add-header-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.#apiLab.headersManager.addRow();
            });
        }
    }

    #attachAuthControls() {
        const authSelect = document.querySelector('#at-auth-type');
        if (authSelect) {
            authSelect.addEventListener('change', (e) => {
                const paramsDiv = document.querySelector('#at-auth-params');
                if (e.target.value === 'bearer') {
                    paramsDiv.style.display = 'block';
                } else {
                    paramsDiv.style.display = 'none';
                }
            });
        }
    }

    #attachSendEvent() {
        const btn = document.querySelector('#at-send');
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', async () => {
            const url = document.querySelector('#at-url').value;
            const method = document.querySelector('#at-method').value;
            const body = document.querySelector('#at-body').value; 

            // Coleta dados dos Managers
            const headers = this.#apiLab.headersManager.getData();
            const authHeader = this.#apiLab.authManager.getData();
            const finalHeaders = { ...headers, ...authHeader };

            if (!url) return;

            this.#apiLab.uiRenderer.setLoading(true);

            const result = await this.#apiLab.requestHandler.execute(
                url, 
                method, 
                body, 
                finalHeaders, 
                this.#apiLab.options.proxyUrl
            );

            if (result.success) {
                this.#apiLab.uiRenderer.setResponse(result.data);
            } else {
                this.#apiLab.uiRenderer.setResponse(result.error, true);
            }

            this.#apiLab.uiRenderer.setLoading(false);
        });
    }

    #attachThemeToggle() {
        const toggleBtn = document.querySelector('#at-theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.#apiLab.toggleMode();
            });
        }
    }

    #attachSaveFlow() {
        const saveBtn = document.querySelector('#at-save-btn');
        
        saveBtn.addEventListener('click', () => {
            const titleInput = document.querySelector('#at-req-title');
            const urlInput = document.querySelector('#at-url');
            const methodInput = document.querySelector('#at-method');
            const bodyInput = document.querySelector('#at-body');
            const title = titleInput.value.trim();
            
            if (!title) { alert("Nome da Requisição obrigatório."); return; }
            if (!urlInput.value) { alert("URL obrigatória."); return; }

            this.#apiLab.saveCurrentRequest(title, urlInput.value, methodInput.value, bodyInput.value);
        });
    }

    #attachSavedListChange() {
        const select = document.querySelector('#at-saved-list');
        select.addEventListener('change', (e) => {
            const id = e.target.value;
            this.#apiLab.loadRequest(id);
        });
    }

    #attachDeleteFlow() {
        const deleteBtn = document.querySelector('#at-delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm("Excluir esta requisição?")) {
                this.#apiLab.deleteCurrentRequest();
            }
        });
    }

    #attachMethodChange() {
        const select = document.querySelector('#at-method');
        select.addEventListener('change', (e) => {
            this.#apiLab.uiRenderer.updateBodyVisibility(e.target.value);
        });
    }

    #attachFormatBody() {
        const formatBtn = document.querySelector('#at-format-body');
        if(formatBtn) {
            formatBtn.addEventListener('click', () => {
                this.#apiLab.uiRenderer.formatBody();
            });
        }
    }

    #attachFullscreenToggle() {
        const btn = document.querySelector('#at-fullscreen-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                this.#apiLab.toggleFullscreen();
            });
        }
    }
}
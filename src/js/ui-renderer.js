export default class UiRenderer {
    #apiLab;

    constructor(apiLab) {
        this.#apiLab = apiLab;
    }

    render(targetElement) {
        const toggleIcon = this.#apiLab.currentMode === 'dark' ? '☀️' : '🌙';
        const saveIcon = '💾';
        const deleteIcon = '🗑️';
        const expandIcon = '⛶';

        const html = `
            <div id="at-container" class="${this.#apiLab.style("container")}">
                
                <div class="${this.#apiLab.style("headGroup")}">
                    <div class="${this.#apiLab.style("brand")}">ApiLab</div>
                    <div class="${this.#apiLab.style("headTools")}">
                        <select id="at-saved-list" class="${this.#apiLab.style("savedReqSelect")}">
                            <option value="">📂 Nova Requisição...</option>
                        </select>
                        <button id="at-delete-btn" type="button" class="${this.#apiLab.style("deleteBtn")}" title="Excluir Salvo" style="display:none">
                            ${deleteIcon}
                        </button>
                        <button id="at-fullscreen-btn" type="button" class="${this.#apiLab.style("fullscreenBtn")}" title="Tela Cheia">
                            ${expandIcon}
                        </button>
                        <button id="at-save-btn" type="button" class="${this.#apiLab.style("headBtn")}" title="Salvar">
                            ${saveIcon}
                        </button>
                        ${this.#apiLab.options.theme === 'vanilla' ? 
                            `<button id="at-theme-toggle" type="button" class="${this.#apiLab.style("headBtn")}" title="Alternar Tema">${toggleIcon}</button>` 
                            : ''}
                    </div>
                </div>

                <div class="${this.#apiLab.style("titleGroup")}">
                    <input type="text" id="at-req-title" 
                        class="${this.#apiLab.style("titleInput")}" 
                        placeholder="Nome da Requisição (ex: Criar Usuário)" 
                        autocomplete="off">
                </div>

                <div class="${this.#apiLab.style("inputGroup")}">
                    <select id="at-method" class="${this.#apiLab.style("select")}">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>

                    <input type="text" id="at-url"
                        name="api_url_${Math.random().toString(36).substring(7)}"
                        class="${this.#apiLab.style("input")}" 
                        placeholder="https://api.exemplo.com/endpoint"
                        autocomplete="off" 
                        spellcheck="false">

                    <button id="at-send" class="${this.#apiLab.style("button")}">
                        Enviar
                    </button>
                </div>

                <div class="${this.#apiLab.style("tabGroup")}">
                    <button type="button" class="${this.#apiLab.style("tabBtn")} active" data-target="tab-body">Body</button>
                    <button type="button" class="${this.#apiLab.style("tabBtn")}" data-target="tab-auth">Auth</button>
                    <button type="button" class="${this.#apiLab.style("tabBtn")}" data-target="tab-headers">Headers</button>
                </div>

                <div id="tab-body" class="${this.#apiLab.style("tabContent")} active">
                    <div id="at-body-group" class="${this.#apiLab.style("bodyGroup")}" style="display:none">
                        <div style="display:flex; justify-content:flex-end; margin-bottom:5px">
                            <button id="at-format-body" type="button" class="${this.#apiLab.style("headBtn")}" 
                                    style="padding: 2px 8px; font-size: 11px; height: auto;">{ } Format</button>
                        </div>
                        <textarea id="at-body" 
                            class="${this.#apiLab.style("bodyInput")}" 
                            placeholder='{ "key": "value" }'
                            spellcheck="false"></textarea>
                    </div>
                    <div id="at-body-msg" style="padding:20px; text-align:center; color:#666; font-size:13px">
                        O método selecionado não possui corpo.
                    </div>
                </div>

                <div id="tab-auth" class="${this.#apiLab.style("tabContent")}">
                    ${this.#apiLab.authManager.getHtml()}
                </div>

                <div id="tab-headers" class="${this.#apiLab.style("tabContent")}">
                    ${this.#apiLab.headersManager.getHtml()}
                </div>

                <div style="margin-top: 15px; display: flex; flex-direction: column; flex: 1;">
                    <label class="${this.#apiLab.style("label")}">Resposta:</label>
                    <div id="at-response" class="${this.#apiLab.style("responseArea")}">Aguardando...</div>
                </div>

                <div id="at-resize-handle" class="${this.#apiLab.style("resizeHandle")}"></div>
            </div>
        `;

        targetElement.innerHTML = html;
        this.updateSavedList();
        this.updateBodyVisibility('GET');
        
        // Inicializa uma linha vazia de header
        this.#apiLab.headersManager.addRow();
    }

    setResponse(data, isError = false) {
        const output = document.querySelector('#at-response');
        
        if (isError) {
            output.classList.remove('preview-mode');
            output.innerText = data;
            return;
        }

        // Verifica se parece HTML (<...>) e não é JSON
        const isHtmlLike = typeof data === 'string' && data.trim().startsWith('<') && (data.includes('>') || data.includes('html'));
        
        if (isHtmlLike) {
            // MODO IFRAME (HTML Preview)
            output.classList.add('preview-mode');
            output.innerHTML = ''; 
            
            const iframe = document.createElement('iframe');
            iframe.className = 'pm-ui-iframe-preview';
            output.appendChild(iframe);

            // Injeta o HTML no iframe
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(data);
            doc.close();
        } else {
            // MODO TEXTO/JSON
            output.classList.remove('preview-mode');
            output.innerText = data;
            if (window.Prism) window.Prism.highlightElement(output);
        }
    }

    setLoading(isLoading) {
        const btn = document.querySelector('#at-send');
        const output = document.querySelector('#at-response');
        if (isLoading) {
            btn.disabled = true;
            btn.innerText = "Carregando...";
            output.innerHTML = "Processando...";
            output.classList.remove('preview-mode');
        } else {
            btn.disabled = false;
            btn.innerText = "Enviar";
        }
    }

    updateBodyVisibility(method) {
        const group = document.querySelector('#at-body-group');
        const msg = document.querySelector('#at-body-msg');
        if(!group) return;

        const methodsWithBody = ['POST', 'PUT', 'DELETE', 'PATCH'];
        if (methodsWithBody.includes(method)) {
            group.style.display = 'flex';
            msg.style.display = 'none';
        } else {
            group.style.display = 'none';
            msg.style.display = 'block';
        }
    }

    formatBody() {
        const input = document.querySelector('#at-body');
        if (!input.value.trim()) return;
        try {
            const val = JSON.parse(input.value);
            input.value = JSON.stringify(val, null, 4);
        } catch(e) {
            alert("JSON Inválido: Verifique a sintaxe.");
        }
    }

    fillFields(req) {
        document.querySelector('#at-url').value = req.url;
        document.querySelector('#at-method').value = req.method;
        document.querySelector('#at-req-title').value = req.name;
        document.querySelector('#at-body').value = req.body || '';
        
        // Preenche Auth e Headers
        this.#apiLab.headersManager.fillData(req.headersState); 
        this.#apiLab.authManager.fillData(req.authState);

        this.updateBodyVisibility(req.method);
        this.toggleDeleteButton(true);
    }

    clearFields() {
        document.querySelector('#at-url').value = "";
        document.querySelector('#at-method').value = "GET";
        document.querySelector('#at-req-title').value = "";
        document.querySelector('#at-body').value = "";
        document.querySelector('#at-saved-list').value = "";
        document.querySelector('#at-response').innerText = "Aguardando...";
        
        this.#apiLab.headersManager.clear();
        this.#apiLab.authManager.fillData(null);

        this.updateBodyVisibility('GET');
        this.toggleDeleteButton(false);
    }
    
    updateSavedList() {
        const savedList = this.#apiLab.store.getItem('saved_requests') || [];
        const selectEl = document.querySelector('#at-saved-list');
        if (!selectEl) return;
        const currentVal = selectEl.value;
        selectEl.innerHTML = '<option value="">📂 Nova Requisição...</option>';
        savedList.forEach(req => {
            const option = document.createElement('option');
            option.value = req.id;
            option.textContent = `${req.method} - ${req.name}`;
            selectEl.appendChild(option);
        });
        if (currentVal && savedList.find(r => r.id == currentVal)) {
            selectEl.value = currentVal;
        } else {
            selectEl.value = "";
        }
        this.toggleDeleteButton(selectEl.value !== "");
    }

    toggleDeleteButton(show) {
        const btn = document.querySelector('#at-delete-btn');
        if(btn) btn.style.display = show ? 'flex' : 'none';
    }

    showSaveFeedback(isUpdate) {
        const saveBtn = document.querySelector('#at-save-btn');
        const originalHTML = saveBtn.innerHTML;
        saveBtn.innerHTML = isUpdate ? "✅ Atualizado" : "✅ Salvo";
        setTimeout(() => saveBtn.innerHTML = originalHTML, 2000);
    }

    updateFullscreenIcon(isFullscreen) {
        const btn = document.querySelector('#at-fullscreen-btn');
        if (!btn) return;
        btn.innerHTML = isFullscreen ? '↙' : '⛶';
        btn.title = isFullscreen ? "Restaurar Tamanho" : "Tela Cheia (F11)";
    }

    updateThemeClasses(container) {
        if (this.#apiLab.options.theme === 'vanilla') {
            if (this.#apiLab.currentMode === 'light') {
                container.classList.add('pm-theme-light');
            } else {
                container.classList.remove('pm-theme-light');
            }
            const toggleBtn = document.querySelector('#at-theme-toggle');
            if(toggleBtn) toggleBtn.innerText = this.#apiLab.currentMode === 'dark' ? '☀️' : '🌙';
        }
    }
}
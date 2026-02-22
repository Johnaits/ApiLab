import { presets } from './themes.js';
import Store from './store.js';
import UiRenderer from './ui-renderer.js';
import RequestHandler from './request-handler.js';
import EventManager from './event-manager.js';
import ResizeManager from './resize-manager.js';
import HeadersManager from './headers-manager.js';
import AuthManager from './auth-manager.js';

export class ApiLab {
    #targetElement;
    #options;
    #themeClasses;
    
    // Sub-modules
    store;
    uiRenderer;
    requestHandler;
    eventManager;
    resizeManager;
    headersManager;
    authManager;
    
    // State
    currentMode;
    currentRequestId = null;
    isFullscreen = false;

    constructor(targetSelector, options = {}) {
        this.#targetElement = typeof targetSelector === 'string' 
            ? document.querySelector(targetSelector) 
            : targetSelector;

        if (!this.#targetElement) throw new Error(`ApiLab: Elemento "${targetSelector}" não encontrado.`);

        this.#options = Object.assign(this.#defaultParams(), options);
        this.currentMode = this.#options.defaultMode || 'light';

        const themeName = this.#options.theme || 'vanilla';
        const selectedPreset = presets[themeName] || presets.vanilla;
        this.#themeClasses = selectedPreset.classes;

        // Injections
        this.store = new Store('apilab_');
        
        this.headersManager = new HeadersManager(this); // Restaurado
        this.authManager = new AuthManager(this);       // Restaurado
        
        this.uiRenderer = new UiRenderer(this); 
        this.requestHandler = new RequestHandler();
        this.eventManager = new EventManager(this);
        this.resizeManager = new ResizeManager(); 

        this.init();
    }

    #defaultParams() {
        return { theme: 'vanilla', defaultMode: 'light', proxyUrl: '' };
    }

    get options() { return this.#options; }

    style(key) {
        return this.#themeClasses[key] || '';
    }

    init() {
        this.uiRenderer.render(this.#targetElement);
        this.applyThemeMode();
        this.eventManager.attachAll();
        this.resizeManager.attach('#at-container', '#at-resize-handle');
    }

    toggleMode() {
        this.currentMode = this.currentMode === 'dark' ? 'light' : 'dark';
        this.applyThemeMode();
    }

    applyThemeMode() {
        const container = this.#targetElement.querySelector(`.${this.style("container").split(' ')[0]}`);
        if(container) this.uiRenderer.updateThemeClasses(container);
    }

    toggleFullscreen() {
        const container = document.querySelector('#at-container');
        if (!container) return;

        this.isFullscreen = !this.isFullscreen;
        
        if (this.isFullscreen) {
            container.classList.add('pm-fullscreen');
        } else {
            container.classList.remove('pm-fullscreen');
        }

        this.uiRenderer.updateFullscreenIcon(this.isFullscreen);
    }
    
    loadRequest(id) {
        if (!id) {
            this.currentRequestId = null;
            this.uiRenderer.clearFields();
            return;
        }
        const savedList = this.store.getItem('saved_requests') || [];
        const found = savedList.find(req => req.id == id);
        if (found) {
            this.currentRequestId = found.id;
            this.uiRenderer.fillFields(found);
        }
    }

    saveCurrentRequest(title, url, method, body) {
        const savedRequests = this.store.getItem('saved_requests') || [];
        
        // Coleta estados extras
        const headersState = this.headersManager.getData(); 
        const authState = this.authManager.getState();      

        let isUpdate = false;

        const reqData = {
            name: title,
            url: url,
            method: method,
            body: body,
            headersState: headersState,
            authState: authState,
            date: new Date().toISOString()
        };

        if (this.currentRequestId) {
            const index = savedRequests.findIndex(r => r.id == this.currentRequestId);
            if (index !== -1) {
                savedRequests[index] = { ...savedRequests[index], ...reqData };
                isUpdate = true;
            } else {
                this.createNewRequest(savedRequests, reqData);
            }
        } else {
            this.createNewRequest(savedRequests, reqData);
        }

        this.store.setItem('saved_requests', savedRequests);
        this.uiRenderer.showSaveFeedback(isUpdate);
        this.uiRenderer.updateSavedList();
        
        if(!isUpdate) {
            const selectEl = document.querySelector('#at-saved-list');
            selectEl.value = this.currentRequestId;
            this.uiRenderer.toggleDeleteButton(true);
        }
    }

    createNewRequest(list, data) {
        const newId = Date.now();
        const newRequest = { id: newId, ...data };
        list.push(newRequest);
        this.currentRequestId = newId;
    }

    deleteCurrentRequest() {
        if (!this.currentRequestId) return;
        let savedRequests = this.store.getItem('saved_requests') || [];
        savedRequests = savedRequests.filter(req => req.id != this.currentRequestId);
        this.store.setItem('saved_requests', savedRequests);
        this.currentRequestId = null;
        this.uiRenderer.updateSavedList();
        this.uiRenderer.clearFields();
    }
}
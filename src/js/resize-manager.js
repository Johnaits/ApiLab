export default class ResizeManager {
    #container;
    #handle;
    #isResizing = false;
    #startX;
    #startY;
    #startWidth;
    #startHeight;

    constructor() {}

    attach(containerSelector, handleSelector) {
        this.#container = document.querySelector(containerSelector);
        this.#handle = document.querySelector(handleSelector);

        if (!this.#container || !this.#handle) return;

        // Inicia o redimensionamento ao clicar no handle
        this.#handle.addEventListener('mousedown', (e) => this.#startResize(e));
        
        // Eventos globais para continuar arrastando mesmo se o mouse sair do handle
        document.addEventListener('mousemove', (e) => this.#onResize(e));
        document.addEventListener('mouseup', () => this.#stopResize());
    }

    #startResize(e) {
        e.preventDefault(); // Evita selecionar texto
        this.#isResizing = true;
        
        this.#startX = e.clientX;
        this.#startY = e.clientY;
        
        // Pega as dimensões atuais computadas
        const rect = this.#container.getBoundingClientRect();
        this.#startWidth = rect.width;
        this.#startHeight = rect.height;

        // Feedback visual
        document.body.style.cursor = 'nwse-resize';
    }

    #onResize(e) {
        if (!this.#isResizing) return;

        // Calcula quanto o mouse andou
        const dx = e.clientX - this.#startX;
        const dy = e.clientY - this.#startY;

        // Nova largura = Largura Inicial + Diferença
        this.#container.style.width = `${this.#startWidth + dx}px`;
        this.#container.style.height = `${this.#startHeight + dy}px`;
    }

    #stopResize() {
        if (!this.#isResizing) return;
        this.#isResizing = false;
        document.body.style.cursor = 'default';
    }
}
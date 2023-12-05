import { createApp } from 'petite-vue'

class VueCodeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this._title = '';
        this._size = 1;
        
        this.app = createApp({
            title: this._title,
            size: this._size
        });
    }

    set hass(hass) {
        console.log(hass)
    }

    setConfig(config) {
        if (config && config.template) {
            const style = config.style ? config.style : '';
            this._title = config.title ? config.title : '';

            this._createCard(config.template, style);
        }else{
            throw new Error('Invalid configuration. Missing template')
        }
    }

    getCardSize() {
        return _size;
    }

    _createCard(mTemplate, mStyle) {
        this.shadowRoot.innerHTML = '';
        // 'ha-card' content
        const card = document.createElement('ha-card');
        card.header = "test";
        const content = document.createElement('div');
        content.setAttribute('class', 'card-content');
        content.innerHTML = mTemplate;
        card.appendChild(content);

        // card style
        const style = document.createElement('style');
        style.textContent = mStyle

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(card);
        this.app.mount(card);
    }
}

customElements.define('vue-code-card', VueCodeCard);
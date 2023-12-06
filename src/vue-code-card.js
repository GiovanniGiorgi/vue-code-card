import { createApp, reactive } from 'petite-vue'

class VueCodeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this._hass = null;
        this.scope = {
            title: '',
            hass: null,
            getHass: () => {
                return this._hass;
            },
            update(){
                this.hass = this.getHass();
                //variables to update in scope...
            }
        }
        
        this.app = createApp(this.scope);
    }

    set hass(hass) {
        this._hass = hass;
        this.scope.update();
    }

    setConfig(config) {
        if (config && config.template) {
            const style = config.style ? config.style : '';
            this.scope.title = config.title ? config.title : '';
            if (config.default != false){
                this._createCard(config.template, style);
            } else {
                this._createCustomCard(config.template, style);
            }
        } else {
            throw new Error('Invalid configuration. Missing template')
        }
    }

    getCardSize() {
        // A height of 1 is equivalent to 50 pixels
        return this.shadowRoot.element.clientHeight / 50;
    }

    _createCard(mTemplate, mStyle) {
        this.shadowRoot.innerHTML = '';
        // 'ha-card' content
        const card = document.createElement('ha-card');
        card.header = this.scope.title;
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

    _createCustomCard(mTemplate, mStyle) {
        // card content
        this.shadowRoot.innerHTML = '';
        const content = document.createElement('div');
        content.innerHTML = mTemplate;

        // card style
        const style = document.createElement('style');
        style.textContent = mStyle

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(content);
        this.app.mount(content);
    }
}

customElements.define('vue-code-card', VueCodeCard);
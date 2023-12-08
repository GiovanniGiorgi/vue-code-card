import { createApp } from 'petite-vue'
import { subCartdDirective, entityDirective } from './directives'

class VueCodeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this._config = null;
        this._hass = null;
        this._hassSubscriber = [];
        this.scope = {
            config: null,
            hass: null,
            data: {},
            state(EntityId){
                return this.hass.states[EntityId] ? this.hass.states[EntityId].state : 'undefined';
            },
            getConfig: () => {
                return this._config;
            },
            getHass: () => {
                return this._hass;
            },
            update(){
                this.hass = this.getHass();
                this.config = this.getConfig();
                //variables to update in scope...
            }
        }
        
        this.app = createApp(this.scope).directive('entity', entityDirective);
    }

    set hass(hass) {
        if (this.shadowRoot.childElementCount > 0) {
            this._updateHass(hass);
        } else {
            this._updateHass(hass);
            this._render();
        }
    }
    _updateHass(hass){
        this._hass = hass;
        this.scope.update();
        this._hassSubscriber.forEach((el) => {
            el.hass = hass;
        })
    }

    setConfig(config) {
        if (config && config.template) {
            this._config = config;
            this.scope.update();
            // new config, update view
            if (this.shadowRoot.childElementCount > 0) {
                this._render();
            }
        } else {
            throw new Error('Invalid configuration. Missing template')
        }
    }

    _render(){
        const style = this._config.style ? this._config.style : '';
        this.scope.title = this._config.title ? this._config.title : '';
        this.app = this.app.directive('card', subCartdDirective(this._config.cards, this._hass, (card) => {
            this._hassSubscriber.push(card);
        }));
        if (this._config.default != false){
            this._createCard(this._config.template, style);
        } else {
            this._createCustomCard(this._config.template, style);
        }
    }

    getCardSize() {
        // A height of 1 is equivalent to 50 pixels
        return this.shadowRoot.lastElementChild.offsetHeight / 50;
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
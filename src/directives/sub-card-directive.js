/**
 * USAGE:
 * this.app.directive('card', subCardDirective(cards)).mount();
 * <div v-card:<n> ></div> with n as index in cards array
 * 
 * 
 * Copyright (c) 2023 Giovanni Giorgi.
 * MIT License.
 * 
 * This file contains portions of code from the project `Vertical Stack In Card`
 * https://github.com/ofekashery/vertical-stack-in-card
 * Copyright (c) 2021 Ofek Ashery.
 * MIT License.
 *
 * The full text of the MIT License is provided in the accompanying
 * LICENSE file at https://github.com/GiovanniGiorgi/vue-code-card/blob/master/LICENSE
 */

export function subCartdDirective(cards, hass, subscribeHass) {
    return ({el, arg, modifiers, get, effect}) => {
        effect(() => {
            let card = get();
            if (typeof card === 'object'){
                if (!'type' in card){
                    throw new Error('Directive Error: v-card, wrong object declaration');
                }
            } else if (typeof card === 'number'){
                if (!cards || cards.length < 1){
                    throw new Error('Directive Error: v-card card not found');
                }
                if (card >= cards.length) {
                    throw new Error('Directive Error: v-card, array out of bounds');
                }
                card = cards[card];
            } else {
                if (!cards || cards.length < 1){
                    throw new Error('Directive Error: v-card card not found');
                }
                if (!arg || arg >= cards.length) {
                    throw new Error('Directive Error: v-card, array out of bounds');
                }
                card = arg ? cards[arg] : cards[0];
            }
            if ('type' in card){
                if (window.loadCardHelpers) {
                    window.loadCardHelpers().then(helpers => {
                        const cardElement = createCardElement(card, hass, helpers);
                        if (modifiers && modifiers.embedded) {
                            if (cardElement.updateComplete) {
                                cardElement.updateComplete.then(() => styleCard(cardElement));
                            } else {
                                styleCard(cardElement);
                            }
                        }
                        subscribeHass(cardElement);
                        el.appendChild(cardElement);
                    });
                }
            }
        });
    }
}

function createCardElement(cardConfig, hass, helpers) {
    const createError = (error, origConfig) => {
        return createThing('hui-error-card', {
            type: 'error',
            error,
            origConfig
        });
    };

    const createThing = (tag, config) => {
        if (helpers) {
            if (config.type === 'divider') {
                return helpers.createRowElement(config);
            } else {
                return helpers.createCardElement(config);
            }
        }

        const element = document.createElement(tag);
        try {
            element.setConfig(config);
        } catch (err) {
            console.error(tag, err);
            return createError(err.message, config);
        }
        return element;
    };

    let tag = cardConfig.type;
    if (tag.startsWith('divider')) {
        tag = `hui-divider-row`;
    } else if (tag.startsWith('custom:')) {
        tag = tag.substr('custom:'.length);
    } else {
        tag = `hui-${tag}-card`;
    }

    const element = createThing(tag, cardConfig);
    element.hass = hass;
    element.addEventListener(
        'll-rebuild',
        (ev) => {
            ev.stopPropagation();
            this.createCardElement(cardConfig).then(() => {
                this.renderCard();
            });
        },
        { once: true }
    );
    return element;
  }

function styleCard(element) {
    if (element.shadowRoot) {
        if (element.shadowRoot.querySelector('ha-card')) {
            let ele = element.shadowRoot.querySelector('ha-card');
            ele.style.boxShadow = 'none';
            ele.style.borderRadius = '0';
            ele.style.border = "none";
            ele.style.backgroundColor = 'transparent';
        } else {
            let searchEles = element.shadowRoot.getElementById('root');
            if (!searchEles) {
                searchEles = element.shadowRoot.getElementById('card');
            }
            if (!searchEles) return;
            searchEles = searchEles.childNodes;
            for (let i = 0; i < searchEles.length; i++) {
                if (searchEles[i].style) {
                    searchEles[i].style.margin = '0px';
                }
                this.styleCard(searchEles[i]);
            }
        }
    } else {
        if (typeof element.querySelector === 'function' && element.querySelector('ha-card')) {
            let ele = element.querySelector('ha-card');
            ele.style.boxShadow = 'none';
            ele.style.borderRadius = '0';
            ele.style.border = "none";
            ele.style.backgroundColor = 'transparent';
        }
        let searchEles = element.childNodes;
        for (let i = 0; i < searchEles.length; i++) {
            if (searchEles[i] && searchEles[i].style) {
                searchEles[i].style.margin = '0px';
            }
            this.styleCard(searchEles[i]);
        }
    }
  }
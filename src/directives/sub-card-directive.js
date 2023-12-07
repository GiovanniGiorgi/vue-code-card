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
    return ({el, arg, effect}) => {
        effect(() => {
            if (!cards || !(arg && cards[arg]) || !cards[0]){
                throw new Error('Directive Error: v-card card not found');
            }
            if (window.loadCardHelpers) {
                window.loadCardHelpers().then(helpers => {
                    let card = arg ? cards[arg] : cards[0];
                    const cardElement = createCardElement(card, hass, helpers);
                    subscribeHass(card);
                    el.appendChild(cardElement);
                });
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
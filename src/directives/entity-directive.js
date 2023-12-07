/**
 * USAGE:
 * this.app.directive('entity', entityDirective).mount();
 * <div v-entity:<type> = "<entyty>" ></div> with n as index in cards array
 * 
 * 
 * Copyright (c) 2023 Giovanni Giorgi.
 * MIT License.
 *
 * The full text of the MIT License is provided in the accompanying
 * LICENSE file at https://github.com/GiovanniGiorgi/vue-code-card/blob/master/LICENSE
 */

export const entityDirective = ({el, exp, modifiers, arg, effect}) => {
    effect(() => {
        if (!(exp && exp != '')) {
            throw new Error('Directive Error: v-entity value not valid');
        }
        const entityElement = document.createElement('ha-'+arg);
        entityElement.entityId = exp;

        el.appendChild(entityElement);
    })
}
/**
 * USAGE:
 * this.app.directive('entity', entityDirective).mount();
 * <div v-entity:<type> = "<entyty>" ></div> with n as index in cards array
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
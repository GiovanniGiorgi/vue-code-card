/**
 * USAGE:
 * this.app.directive('card', subCardDirective(cards)).mount();
 * <div v-card:<n> ></div> with n as index in cards array
 */

export function subCartdDirective(cards) {
    return ({el, arg, effect}) => {
        effect(() => {
            if (!cards || !(arg && cards[arg]) || !cards[0]){
                throw new Error('Directive Error: v-card card not found');
            }
            let card = arg ? cards[arg] : cards[0];
            const cardElement = document.createElement(card.type);
            if (cardElement.setConfig) {
                cardElement.setConfig(card);
            }
            el.appendChild(cardElement);
        })
    }
}
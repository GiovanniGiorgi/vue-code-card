const path = require('path');

module.exports = {
    //mode: 'production',
    mode: 'development',
    entry: './src/vue-code-card.js',
    output: {
        filename: 'vue-code-card.js',
        path: path.resolve(__dirname, 'dist')
    }
}
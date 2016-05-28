module.exports = {
    dev: {
        src: ['client/app/**/*.js', 'client/app/**/*.html'],
        lang: ['en_US', 'fr_FR'],
        dest: 'client/assets/locales',
        prefix: 'locale-',
        nullEmpty: true,
        stringifyOptions: true,
    }
};
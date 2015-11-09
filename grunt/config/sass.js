module.exports = {
    dev: {
        files : {
            'www/assets/css/main.css': 'client/assets/stylesheets/main.scss'
        }
    },
    prod: {
        options: {
            style: 'compressed'
        },
        files : {
            'www/assets/css/main.css': 'client/assets/stylesheets/main.scss'
        }
    }

};
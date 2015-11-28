module.exports = {
        html: ['www/index.html','www/app/**/*.html'],
        css: ['www/assets/css/warcraftlfg.min.*.css'],
        js: ['www/app/warcraftlfg.min.*.js'],
        options: {
                assetsDirs: ['www','www/assets/images','www/app'],
                patterns: {
                        css: [
                                [/["']([^:"']+\.(?:png|gif|jpe?g))["']/img, 'Image replacement in css files'],
                                [/["']([^:"']+\.html)["']/img, 'HTML replacement in css files']
                        ],
                        js: [
                                [/["']([^:"']+\.(?:png|gif|jpe?g))["']/img, 'Image replacement in js files'],
                                [/["']([^:"']+\.html)["']/img, '>HTML replacement in js files']
                        ],
                        html:[
                                [/["']([^:"']+\.(?:png|gif|jpe?g))["']/img, 'Image replacement in html files'],
                                [/["']([^:"']+\.html)["']/img, 'HTML replacement in html files']
                        ]
                }
        }
};
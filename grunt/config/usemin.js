module.exports = {
        html: ['www/index.html','www/app/**/*.html'],
        css: ['www/assets/css/warcraftlfg.min.*.css', 'www/assets/css/warcraftlfg.vendor.min.*.css'],
        js: ['www/app/warcraftlfg.min.*.js', 'www/app/warcraftlfg.vendor.min.*.js', 'www/templates.*.js'],
        options: {
                keepSpecialComments: 0,
                assetsDirs: ['www','www/assets/images','www/app'],
                patterns: {
                        css: [
                                [/["']([^:"']+\.(?:png|gif|jpe?g))["']/img, 'Image replacement in css files'],
                                [/["']([^:"']+\.html)["']/img, 'HTML replacement in css files']
                        ],
                        js: [
                                [/["']([^:"']+\.(?:png|gif|jpe?g))["']/img, 'Image replacement in js files'],
                                [/["']([^:"']+\.html)["']/img, '>HTML replacement in js files'],
                                [/["']([^:"']+\.json)["']/img, '>JSON replacement in js files']
                        ],
                        html:[
                                [/["']([^:"']+\.(?:png|gif|jpe?g))["']/img, 'Image replacement in html files'],
                                [/["']([^:"']+\.html)["']/img, 'HTML replacement in html files']
                        ]
                }
        }
};
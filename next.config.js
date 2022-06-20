module.exports = {
    ...( process.env.NODE_ENV === 'production' ? {
        basePath: '/mit-fullstack-restaurant-application',
        assetPrefix: '/mit-fullstack-restaurant-application/'
    } : {} )
}
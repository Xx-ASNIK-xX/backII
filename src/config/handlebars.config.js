import handlebars from 'express-handlebars';

export const handlebarsConfig = {
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        multiply: function(a, b) {
            if (!a || !b) return 0;
            return a * b;
        },
        cartTotal: function(products) {
            if (!Array.isArray(products)) return 0;
            return products.reduce((total, item) => {
                if (!item || !item.product || !item.product.price || !item.quantity) return total;
                return total + (item.product.price * item.quantity);
            }, 0);
        },
        formatPrice: function(price) {
            return new Intl.NumberFormat('es-CO', { 
                style: 'currency', 
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
        },
        json: function(context) {
            return JSON.stringify(context);
        }
    }
};

export const configureHandlebars = (app) => {
    app.engine('handlebars', handlebars.engine({
        helpers: {
            eq: (a, b) => a === b,
            gt: (a, b) => a > b,
            lt: (a, b) => a < b,
            and: (a, b) => a && b,
            multiply: (a, b) => a * b,
            cartTotal: (products) => {
                return products.reduce((total, item) => {
                    if (item.product) {
                        return total + (item.product.price * item.quantity);
                    }
                    return total;
                }, 0);
            },
            json: (context) => JSON.stringify(context)
        }
    }));
    app.set('view engine', 'handlebars');
    app.set('views', './src/views');
}; 
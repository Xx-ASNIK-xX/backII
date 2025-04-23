import ProductManagerClass from '../managers/ProductManager.js';
import CartModel from '../models/cart.model.js';
import Logger from '../utils/logger.js';

const productManager = new ProductManagerClass();

const getHomeView = async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        Logger.error('Error al cargar la vista home:', error);
        res.status(500).render('error', { error: 'Error al cargar la página principal' });
    }
};

const getRealTimeProductsView = async (req, res) => {
    // Asegurar autenticación
    if (!req.session.user) return res.redirect('/login');
    try {
        const products = await productManager.getProducts({ limit: 100 });
        res.render('realTimeProducts', { products: products.docs });
    } catch (error) {
        Logger.error('Error al cargar la vista de productos en tiempo real:', error);
        res.status(500).render('error', { error: 'Error al cargar los productos en tiempo real' });
    }
};

const getProducts = async (req, res) => {
    // Asegurar autenticación
    if (!req.session.user) return res.redirect('/login');
    try {
        const { limit = 10, page = 1, sort, category, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            category,
            query
        };

        const result = await productManager.getProducts(options);
        
        // Obtener todas las categorías únicas
        const allProducts = await productManager.getProducts({ limit: 1000 });
        const categories = [...new Set(allProducts.docs.map(product => product.category))];
        
        // Construir la base de los parámetros de consulta
        const queryParams = new URLSearchParams();
        if (limit) queryParams.set('limit', limit);
        if (sort) queryParams.set('sort', sort);
        if (category) queryParams.set('category', category);
        if (query) queryParams.set('query', query);

        // Función para construir enlaces de paginación
        const buildPageLink = (pageNum) => {
            const params = new URLSearchParams(queryParams);
            params.set('page', pageNum);
            return `/products?${params.toString()}`;
        };
        
        res.render('products', {
            user: req.session.user,
            products: result.docs,
            categories,
            selectedCategory: category,
            searchQuery: query,
            sort,
            limit,
            pagination: {
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? buildPageLink(result.prevPage) : null,
                nextLink: result.hasNextPage ? buildPageLink(result.nextPage) : null
            }
        });
    } catch (error) {
        Logger.error('Error al cargar la vista de productos:', error);
        res.status(500).render('error', { error: 'Error al cargar los productos' });
    }
};

const getProductDetail = async (req, res) => {
    try {
        const { pid } = req.params;
        Logger.info(`Buscando producto con ID: ${pid}`);
        
        const product = await productManager.getProductById(pid);
        if (!product) {
            Logger.warn(`Producto no encontrado con ID: ${pid}`);
            return res.status(404).render('error', { error: 'Producto no encontrado' });
        }

        Logger.info(`Producto encontrado: ${product.title}`);
        res.render('product-detail', { product });
    } catch (error) {
        Logger.error('Error al cargar el detalle del producto:', error);
        res.status(500).render('error', { error: 'Error al cargar el detalle del producto' });
    }
};

const getCart = async (req, res) => {
    try {
        const { cid } = req.params;
        Logger.info('Buscando carrito con ID:', cid);

        const cart = await CartModel.findById(cid).populate('products.product');
        if (!cart) {
            Logger.warn('Carrito no encontrado');
            return res.status(404).render('error', { error: 'Carrito no encontrado' });
        }
        Logger.info('Carrito encontrado:', cart);

        // Asegurarse de que cart.products existe y es un array
        if (!cart.products) {
            cart.products = [];
        }

        // Convertir el documento Mongoose a un objeto plano
        const cartData = {
            _id: cart._id,
            products: cart.products.map(item => ({
                product: item.product ? {
                    _id: item.product._id,
                    title: item.product.title,
                    price: item.product.price,
                    code: item.product.code,
                    stock: item.product.stock,
                    thumbnails: item.product.thumbnails
                } : null,
                quantity: item.quantity
            }))
        };

        Logger.info('Datos del carrito procesados:', cartData);
        
        res.render('cart', { 
            cart: cartData,
            helpers: {
                multiply: function(a, b) { return a * b; },
                cartTotal: function(products) {
                    return products.reduce((total, item) => {
                        if (item.product) {
                            return total + (item.product.price * item.quantity);
                        }
                        return total;
                    }, 0);
                },
                add: function(a, b) { return a + b; }
            }
        });
    } catch (error) {
        Logger.error('Error al obtener el carrito:', error);
        res.status(500).render('error', { error: 'Error al obtener el carrito' });
    }
};

export default {
    getHomeView,
    getRealTimeProductsView,
    getProducts,
    getProductDetail,
    getCart
};

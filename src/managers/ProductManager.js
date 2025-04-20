import ProductModel from '../models/product.model.js';

class ProductManager {
    async getProducts(options = {}) {
        try {
            const { limit = 10, page = 1, sort, category, status, query } = options;
            
            // Construir el filtro
            const filter = {};
            
            // Si hay una query de búsqueda
            if (query) {
                filter.$or = [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ];
            }
            
            // Aplicar filtros adicionales
            if (category) filter.category = category;
            if (status !== undefined) filter.status = status;

            // Construir las opciones de ordenamiento
            const sortOptions = {};
            if (sort === 'asc') {
                sortOptions.price = 1;
            } else if (sort === 'desc') {
                sortOptions.price = -1;
            }

            const result = await ProductModel.paginate(filter, { 
                limit, 
                page,
                sort: sortOptions,
                lean: true 
            });
            return result;
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id).lean();
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            this.validateProductData(productData);
            const newProduct = await ProductModel.create(productData);
            return newProduct.toObject();
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    async updateProduct(id, data) {
        try {
            this.validateProductData(data);
            const product = await ProductModel.findByIdAndUpdate(
                id, 
                data, 
                { new: true, runValidators: true }
            ).lean();
            
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await ProductModel.findByIdAndDelete(id).lean();
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    validateProductData(data) {
        if (data.price && data.price <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }
        if (data.stock && data.stock < 0) {
            throw new Error('El stock no puede ser negativo');
        }
        if (data.code && typeof data.code !== 'string') {
            throw new Error('El código debe ser una cadena de texto');
        }
        if (data.title && typeof data.title !== 'string') {
            throw new Error('El título debe ser una cadena de texto');
        }
        if (data.description && typeof data.description !== 'string') {
            throw new Error('La descripción debe ser una cadena de texto');
        }
        if (data.category && typeof data.category !== 'string') {
            throw new Error('La categoría debe ser una cadena de texto');
        }
    }

    async getProductsByCategory(category) {
        try {
            return await ProductModel.find({ category }).lean();
        } catch (error) {
            throw new Error(`Error al obtener productos por categoría: ${error.message}`);
        }
    }

    async searchProducts(query) {
        try {
            return await ProductModel.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            }).lean();
        } catch (error) {
            throw new Error(`Error al buscar productos: ${error.message}`);
        }
    }

    async updateStock(id, newStock) {
        try {
            if (newStock < 0) {
                throw new Error('El stock no puede ser negativo');
            }

            const product = await ProductModel.findByIdAndUpdate(
                id,
                { stock: newStock },
                { new: true, runValidators: true }
            ).lean();

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            throw new Error(`Error al actualizar stock: ${error.message}`);
        }
    }
}

export default ProductManager;
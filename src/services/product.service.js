import ProductManager from '../managers/ProductManager.js';
import ProductDTO from '../dto/product.dto.js';
import ProductModel from '../models/product.model.js';
import ImageModel from '../models/image.model.js';
import Logger from '../utils/logger.js';

class ProductService {
    constructor() {
        this.productManager = new ProductManager();
    }

    async getProducts(options = {}) {
        const result = await this.productManager.getProducts(options);
        return {
            ...result,
            docs: result.docs.map(product => ProductDTO.toResponse(product))
        };
    }

    async getProductById(id) {
        const product = await this.productManager.getProductById(id);
        return ProductDTO.toResponse(product);
    }

    async createProduct(productData, files = []) {
        try {
            // Verificar si el código ya existe
            const existingProduct = await ProductModel.findOne({ code: productData.code });
            if (existingProduct) {
                throw new Error('Ya existe un producto con ese código');
            }

            // Subir imágenes a GridFS
            const imageIds = [];
            if (files && files.length > 0) {
                for (const file of files) {
                    try {
                        const imageId = await ImageModel.uploadImage(file);
                        imageIds.push(imageId.toString());
                    } catch (error) {
                        throw new Error(`Error al subir imagen: ${error.message}`);
                    }
                }
            }

            // Crear el producto con las referencias a las imágenes
            const newProduct = await ProductModel.create({
                ...productData,
                thumbnails: imageIds
            });

            Logger.info('Producto creado exitosamente', { 
                productId: newProduct._id,
                imageIds: imageIds 
            });

            return newProduct;
        } catch (error) {
            Logger.error('Error en ProductService.createProduct:', {
                error: error.message,
                stack: error.stack,
                productData,
                filesCount: files?.length || 0
            });
            throw error; // Re-lanzamos el error para que el controlador lo maneje
        }
    }

    async updateProduct(id, productData) {
        try {
            Logger.info('Actualizando producto:', { id, productData });

            // Asegurarnos de que el estado sea booleano
            const dataToUpdate = {
                ...productData,
                status: typeof productData.status === 'boolean' ? productData.status : productData.status === 'true',
                price: Number(productData.price),
                stock: Number(productData.stock)
            };

            const updatedProduct = await ProductModel.findByIdAndUpdate(
                id,
                dataToUpdate,
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                throw new Error('Producto no encontrado');
            }

            Logger.info('Producto actualizado exitosamente:', {
                productId: updatedProduct._id,
                status: updatedProduct.status
            });

            return updatedProduct;
        } catch (error) {
            Logger.error('Error en ProductService.updateProduct:', {
                error: error.message,
                stack: error.stack,
                id,
                productData
            });
            throw error;
        }
    }

    async deleteProduct(id) {
        const deletedProduct = await this.productManager.deleteProduct(id);
        return ProductDTO.toResponse(deletedProduct);
    }

    async getProductsByCategory(category) {
        const products = await this.productManager.getProductsByCategory(category);
        return products.map(product => ProductDTO.toResponse(product));
    }

    async searchProducts(query) {
        const products = await this.productManager.searchProducts(query);
        return products.map(product => ProductDTO.toResponse(product));
    }

    async updateStock(id, stock) {
        const updatedProduct = await this.productManager.updateStock(id, stock);
        return ProductDTO.toResponse(updatedProduct);
    }
}

export default ProductService; 
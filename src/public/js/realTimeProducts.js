const socket = io();

// Escucha el evento "updateProducts" para actualizar la lista
socket.on("updateProducts", (products) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = products
        .map(
            (product) => `
            <li>
                ${product.title} - $${product.price}
                <button onclick="deleteProduct('${product.id}')">Eliminar</button>
            </li>
        `
        )
        .join("");
});

// Envía el formulario para crear un producto
document.getElementById("createProductForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener los datos del formulario
    const title = e.target.title.value;
    const description = e.target.description.value;
    const code = e.target.code.value;
    const price = parseFloat(e.target.price.value);
    const status = e.target.status.checked;
    const stock = parseInt(e.target.stock.value);
    const category = e.target.category.value;
    const thumbnails = e.target.thumbnails.value
        ? e.target.thumbnails.value.split(",").map((url) => url.trim())
        : [];

    // Crear el objeto del producto
    const productData = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    };

    // Enviar el producto al servidor
    socket.emit("createProduct", productData);

    // Limpiar el formulario
    e.target.reset();
});

// Función para eliminar un producto
window.deleteProduct = (productId) => {
    socket.emit("deleteProduct", productId);
};
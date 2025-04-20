// Inicializar Socket.IO
const socket = io();
console.log('Socket.IO inicializado');

// Variables globales para las imágenes
let uploadedImages = [];
let editUploadedImages = [];

// Elementos del DOM
const createProductForm = document.getElementById('createProductForm');
const editProductForm = document.getElementById('editProductForm');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
console.log('Elementos del DOM cargados:', { createProductForm, editProductForm, editModal });

// Función para manejar la selección de imágenes
document.getElementById('imageUpload').addEventListener('change', async function(e) {
    const files = Array.from(e.target.files);
    
    // Validar número máximo de imágenes
    if (files.length + uploadedImages.length > 2) {
        await Swal.fire({
            title: 'Error',
            text: 'Solo puedes subir un máximo de 2 imágenes',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
        e.target.value = '';
        return;
    }

    // Validar tamaño y tipo de archivos
    for (let file of files) {
        if (file.size > 5 * 1024 * 1024) {
            await Swal.fire({
                title: 'Error',
                text: `La imagen ${file.name} excede el tamaño máximo de 5MB`,
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
            e.target.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            await Swal.fire({
                title: 'Error',
                text: `El archivo ${file.name} no es una imagen válida`,
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
            e.target.value = '';
            return;
        }
    }

    // Subir las imágenes
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
        const response = await fetch('/api/images/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            uploadedImages = [...uploadedImages, ...result.urls];
            updateImagePreview();
            
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Imágenes subidas correctamente',
                icon: 'success',
                confirmButtonColor: '#28a745',
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            throw new Error('Error al subir las imágenes');
        }
    } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
            title: 'Error',
            text: 'Error al subir las imágenes',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    }

    e.target.value = ''; // Limpiar el input
});

// Función para actualizar la vista previa de imágenes
function updateImagePreview() {
    const container = document.getElementById('imagePreviewContainer');
    container.innerHTML = '';
    
    // Agregar imágenes existentes
    uploadedImages.forEach((url, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Vista previa';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.onclick = () => {
            uploadedImages = uploadedImages.filter((_, i) => i !== index);
            updateImagePreview();
        };
        
        previewItem.appendChild(img);
        previewItem.appendChild(deleteBtn);
        container.appendChild(previewItem);
    });

    // Agregar placeholder si hay espacio para más imágenes
    if (uploadedImages.length < 2) {
        const placeholder = document.createElement('div');
        placeholder.className = 'upload-placeholder d-flex justify-content-center align-items-center border rounded mb-2';
        placeholder.style.width = '200px';
        placeholder.style.height = '200px';
        placeholder.style.cursor = 'pointer';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-plus fa-2x text-muted';
        placeholder.appendChild(icon);
        
        placeholder.onclick = function() {
            document.getElementById('imageUpload').click();
        };
        
        container.appendChild(placeholder);
    }

    // Actualizar el campo oculto
    document.getElementById('thumbnails').value = uploadedImages.join(',');
}

// Función para crear un nuevo producto
createProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Formulario de creación enviado');
    
    const formData = new FormData(createProductForm);
    const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category'),
        status: formData.get('status') === 'on',
        thumbnails: uploadedImages
    };
    console.log('Datos del producto a crear:', productData);

    try {
        // Enviar solo por HTTP
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear el producto');
        }

        // Limpiar el formulario después de una creación exitosa
        createProductForm.reset();
        uploadedImages = [];
        updateImagePreview();

    } catch (error) {
        console.error('Error al crear producto:', error);
        await Swal.fire({
            title: 'Error',
            text: error.message || 'Error al crear el producto',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    }
});

// Función para editar un producto
function editProduct(id, product) {
    console.log('Editando producto:', id, product);
    
    // Llenar el formulario con los datos del producto
    document.getElementById('editProductId').value = id;
    document.getElementById('editTitle').value = product.title;
    document.getElementById('editDescription').value = product.description;
    document.getElementById('editCode').value = product.code;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editStock').value = product.stock;
    document.getElementById('editCategory').value = product.category;
    document.getElementById('editStatus').checked = product.status;
    
    // Actualizar las imágenes
    editUploadedImages = product.thumbnails || [];
    updateEditImagePreview();
    
    // Mostrar el modal
    editModal.show();
}

// Función para actualizar la vista previa de imágenes en el modal de edición
function updateEditImagePreview() {
    const container = document.getElementById('editImagePreviewContainer');
    container.innerHTML = '';
    
    // Agregar imágenes existentes
    editUploadedImages.forEach((url, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Vista previa';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.onclick = () => {
            editUploadedImages = editUploadedImages.filter((_, i) => i !== index);
            updateEditImagePreview();
        };
        
        previewItem.appendChild(img);
        previewItem.appendChild(deleteBtn);
        container.appendChild(previewItem);
    });

    // Agregar placeholder si hay espacio para más imágenes
    if (editUploadedImages.length < 2) {
        const placeholder = document.createElement('div');
        placeholder.className = 'upload-placeholder d-flex justify-content-center align-items-center border rounded mb-2';
        placeholder.style.width = '200px';
        placeholder.style.height = '200px';
        placeholder.style.cursor = 'pointer';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-plus fa-2x text-muted';
        placeholder.appendChild(icon);
        
        placeholder.onclick = function() {
            document.getElementById('editImageUpload').click();
        };
        
        container.appendChild(placeholder);
    }

    // Actualizar el campo oculto
    document.getElementById('editThumbnails').value = editUploadedImages.join(',');
}

// Manejar la subida de imágenes en el modal de edición
document.getElementById('editImageUpload').addEventListener('change', async function(e) {
    const files = Array.from(e.target.files);
    
    // Validar número máximo de imágenes
    if (files.length + editUploadedImages.length > 2) {
        await Swal.fire({
            title: 'Error',
            text: 'Solo puedes subir un máximo de 2 imágenes',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
        e.target.value = '';
        return;
    }

    // Validar tamaño y tipo de archivos
    for (let file of files) {
        if (file.size > 5 * 1024 * 1024) {
            await Swal.fire({
                title: 'Error',
                text: `La imagen ${file.name} excede el tamaño máximo de 5MB`,
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
            e.target.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            await Swal.fire({
                title: 'Error',
                text: `El archivo ${file.name} no es una imagen válida`,
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
            e.target.value = '';
            return;
        }
    }

    // Subir las imágenes
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
        const response = await fetch('/api/images/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            editUploadedImages = [...editUploadedImages, ...result.urls];
            updateEditImagePreview();
            
            await Swal.fire({
                title: '¡Éxito!',
                text: 'Imágenes subidas correctamente',
                icon: 'success',
                confirmButtonColor: '#28a745',
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            throw new Error('Error al subir las imágenes');
        }
    } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
            title: 'Error',
            text: 'Error al subir las imágenes',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    }

    e.target.value = ''; // Limpiar el input
});

// Función para actualizar un producto
async function updateProduct() {
    const id = document.getElementById('editProductId').value;
    console.log('Actualizando producto:', id);
    
    // Obtener el estado del checkbox directamente como booleano
    const statusCheckbox = document.getElementById('editStatus');
    console.log('Estado del checkbox:', statusCheckbox.checked);

    const productData = {
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value,
        code: document.getElementById('editCode').value,
        price: parseFloat(document.getElementById('editPrice').value),
        stock: parseInt(document.getElementById('editStock').value),
        category: document.getElementById('editCategory').value,
        status: statusCheckbox.checked, // Usar directamente el estado del checkbox
        thumbnails: editUploadedImages
    };
    
    console.log('Datos a enviar:', productData);

    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);

        if (!response.ok) {
            throw new Error(responseData.error || 'Error al actualizar el producto');
        }

        // Cerrar el modal después de una actualización exitosa
        editModal.hide();
        
        await Swal.fire({
            title: '¡Éxito!',
            text: 'Producto actualizado correctamente',
            icon: 'success',
            confirmButtonColor: '#28a745',
            timer: 2000,
            timerProgressBar: true
        });

        // Recargar la página para mostrar los cambios
        window.location.reload();

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        await Swal.fire({
            title: 'Error',
            text: error.message || 'Error al actualizar el producto',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    }
}

// Función para eliminar un producto
async function deleteProduct(id) {
    console.log('Eliminando producto:', id);
    
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este producto? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
    });

    if (result.isConfirmed) {
        try {
            // Enviar evento a Socket.IO y esperar la respuesta HTTP
            socket.emit('delete-product', id);
            await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al eliminar el producto',
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
        }
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    console.log('Mostrando notificación:', message, type);
    
    if (type === 'success') {
        Swal.fire({
            title: '¡Éxito!',
            text: message,
            icon: 'success',
            confirmButtonColor: '#28a745',
            timer: 2000,
            timerProgressBar: true
        });
    } else if (type === 'error') {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    } else if (type === 'warning') {
        Swal.fire({
            title: 'Advertencia',
            text: message,
            icon: 'warning',
            confirmButtonColor: '#ffc107'
        });
    }
}

// Escuchar eventos de Socket.IO
socket.on('productCreated', (product) => {
    console.log('Evento productCreated recibido:', product);
    Swal.fire({
        title: '¡Producto creado!',
        text: 'El producto ha sido creado exitosamente',
        icon: 'success',
        confirmButtonColor: '#28a745',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then(() => {
        location.reload();
    });
});

socket.on('productUpdated', (product) => {
    console.log('Evento productUpdated recibido:', product);
    Swal.fire({
        title: '¡Actualizado!',
        text: 'El producto ha sido actualizado exitosamente',
        icon: 'success',
        confirmButtonColor: '#28a745',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then(() => {
        location.reload();
    });
});

socket.on('productDeleted', (productId) => {
    console.log('Evento productDeleted recibido:', productId);
    Swal.fire({
        title: '¡Eliminado!',
        text: 'El producto ha sido eliminado exitosamente',
        icon: 'success',
        confirmButtonColor: '#28a745',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then(() => {
        location.reload();
    });
});

// Escuchar errores del servidor
socket.on('error', (error) => {
    console.error('Error del servidor:', error);
    Swal.fire({
        title: 'Error',
        text: error.message || 'Error del servidor',
        icon: 'error',
        confirmButtonColor: '#dc3545'
    });
});

function createImagePreview(file, index) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container position-relative mb-2';
        
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'preview-image img-thumbnail';
        img.style.maxWidth = '200px';
        img.style.maxHeight = '200px';
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm position-absolute top-0 end-0 m-1';
        deleteButton.innerHTML = '<i class="fas fa-times"></i>';
        deleteButton.onclick = function() {
            const dt = new DataTransfer();
            const input = document.getElementById('imageInput');
            const { files } = input;
            
            for(let i = 0; i < files.length; i++) {
                if(i !== index) dt.items.add(files[i]);
            }
            
            input.files = dt.files;
            previewContainer.remove();
            updateImageCounter();
            checkAndUpdatePlaceholder();
        };
        
        previewContainer.appendChild(img);
        previewContainer.appendChild(deleteButton);
        document.getElementById('imagePreviewContainer').appendChild(previewContainer);
    };
    reader.readAsDataURL(file);
}

function createUploadPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'upload-placeholder d-flex justify-content-center align-items-center border rounded mb-2';
    placeholder.style.width = '200px';
    placeholder.style.height = '200px';
    placeholder.style.cursor = 'pointer';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-plus fa-2x text-muted';
    placeholder.appendChild(icon);
    
    placeholder.onclick = function() {
        document.getElementById('imageInput').click();
    };
    
    return placeholder;
} 
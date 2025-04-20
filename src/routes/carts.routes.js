import { Router } from "express";
import { 
    getCarts, 
    getCartById, 
    createCart, 
    addProductToCart, 
    removeProductFromCart, 
    updateProductQuantity,
    updateCart, 
    clearCart,
    deleteCart
} from "../controllers/carts.controller.js";

const router = Router();

router.get("/", getCarts);
router.get("/:cid", getCartById);
router.post("/", createCart);
router.post("/:cid/products/:pid", addProductToCart);
router.delete("/:cid/products/:pid", removeProductFromCart);
router.put("/:cid/products/:pid", updateProductQuantity);
router.put("/:cid", updateCart);
router.delete("/:cid", clearCart);
router.delete("/:cid/delete", deleteCart);

export default router;
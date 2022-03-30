import { AnyAction } from "redux";
import { CartItemType, CartType, ProductType } from "../../helper/types";

export const ADD_ALL_PRODUCTS = "ADD_ALL_PRODUCTS";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const ADD_CART = "ADD_CART";
export const UPDATE_CART = "UPDATE_CART";


export default {
    addAllProducts: (products: ProductType[]): AnyAction => {
        return {
            type: ADD_ALL_PRODUCTS,
            products
        }
    },
    addProduct: (product: ProductType): AnyAction => {
        return {
            type: ADD_PRODUCT,
            product
        }
    },
    updateProduct: (updatedProduct: ProductType): AnyAction => {
        return {
            type: UPDATE_PRODUCT,
            updatedProduct
        }
    },
    deleteProduct: (productId: string): AnyAction => {
        return {
            type: DELETE_PRODUCT,
            productId
        }
    },
    updateCart: (updatedCartItem: CartItemType): AnyAction => {
        return {
            type: UPDATE_CART,
            updatedCartItem
        }
    }
}
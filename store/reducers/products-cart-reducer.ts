import { Reducer } from "react";
import { AnyAction } from "redux";
import { ProductCartReducerType } from "../../helper/types";
import { ADD_ALL_PRODUCTS, ADD_CART, ADD_PRODUCT, DELETE_PRODUCT, UPDATE_CART, UPDATE_PRODUCT } from "../actions/products-cart-actions";

const initState: ProductCartReducerType = {
    products: [],
    cart: {
        cartId: '',
        cartItems: [],
        finalAmount: 0
    }
}

const productsCartReducer: Reducer<ProductCartReducerType, AnyAction> = (state= initState, action): ProductCartReducerType => {
    switch(action.type) {
        case ADD_ALL_PRODUCTS:
            return {
                ...state,
                products: action.products
            }
        case ADD_PRODUCT:
            return {
                ...state,
                products: state.products.concat(action.product)
            }
        case UPDATE_PRODUCT:
            const updatedProductsCopy = [...state.products];
            const productIndex = updatedProductsCopy.findIndex((product)=>product.productId == action.updatedProductId);
            updatedProductsCopy[productIndex] = action.updatedProduct;
            return {
                ...state,
                products: updatedProductsCopy
            }
        case DELETE_PRODUCT:
            let deleteProuctsCopy = [...state.products];
            deleteProuctsCopy = deleteProuctsCopy.filter((product)=> product.productId != action.productId);
            return {
                ...state,
                products: deleteProuctsCopy
            }
        case UPDATE_CART:
            const updatedCartCopy = {...state.cart};
            if(updatedCartCopy.cartId == "") {
                updatedCartCopy.cartId = Math.ceil(Math.random() * 1000000000).toString(20);
            }
            updatedCartCopy.cartItems.concat(action.updatedCartItem);
            for(let i=0; i < updatedCartCopy.cartItems.length; i++) {
                updatedCartCopy.finalAmount = updatedCartCopy.cartItems[i].finalProductPrice
            }
            return {
                ...state,
                cart: updatedCartCopy
            }
        default:
            return state
    }
} 


export default productsCartReducer;
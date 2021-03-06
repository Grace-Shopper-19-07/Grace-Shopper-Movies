import axios from 'axios'
import {me} from './user'

const initialState = {
  userCart: {id: 0, movies: []}
}

const GET_LOGGED_IN_SHOPPING_CART = 'GET_LOGGED_IN_SHOPPING_CART'
const UPDATE_CART = 'UPDATE_CART'
const DELETE_CART = 'DELETE_CART'
const ADD_GUEST_CART = 'ADD_GUEST_CART'
const CHECK_CART_OUT = 'CHECK_CART_OUT'
const ADD_MOVIE = 'ADD_MOVIE'
const REMOVE_MOVIE = 'REMOVE_MOVIE'

const removeMovie = movie => {
  return {
    type: REMOVE_MOVIE,
    movie
  }
}

const cartCheckedOut = () => {
  return {
    type: CHECK_CART_OUT
  }
}

const addMovie = movie => {
  return {
    type: ADD_MOVIE,
    movie
  }
}

const gotLoggedInUserCart = cart => {
  return {
    type: GET_LOGGED_IN_SHOPPING_CART,
    cart
  }
}

const gotUpdatedCart = quantity => {
  return {
    type: UPDATE_CART,
    quantity
  }
}

const addGuestCart = cart => {
  return {
    type: ADD_GUEST_CART,
    cart
  }
}

const deletedCart = () => {
  return {
    type: DELETE_CART
  }
}

export const checkOutThunk = userId => {
  return async dispatch => {
    await axios.put(`/api/cart/checkout`, {userId: userId})
    dispatch(cartCheckedOut())
    const {data} = await axios.get(`/api/cart`)
    dispatch(gotLoggedInUserCart(data))
  }
}

export const getUserCartById = () => {
  return async dispatch => {
    // const user = await axios.get('/auth/me')
    const {data} = await axios.get(`/api/cart`)
    dispatch(gotLoggedInUserCart(data))
  }
}

export const updateCartThunk = updatedQuantity => {
  return async dispatch => {
    const {data} = await axios.put('/api/cart', updatedQuantity)
    dispatch(gotUpdatedCart(updatedQuantity))
  }
}

//do we need this?
export const deleteCart = () => {
  return dispatch => {
    dispatch(deletedCart())
  }
}

export const addGuestCartThunk = cart => {
  return dispatch => {
    dispatch(addGuestCart(cart))
  }
}

export const addMovieThunk = movie => {
  return async dispatch => {
    await axios.post(`/api/cart/`, movie)
    dispatch(addMovie(movie))
  }
}

export const removeMovieThunk = movie => {
  return async dispatch => {
    if (movie.ProductOrder) {
      await axios.delete(`/api/cart/`, {
        data: {
          orderId: movie.ProductOrder.orderId,
          movieId: movie.id
        }
      })
    }
    dispatch(removeMovie(movie))
  }
}

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case REMOVE_MOVIE:
      return {
        ...state,
        userCart: {
          ...state.userCart,
          movies: [
            ...state.userCart.movies.filter(
              movie => movie.id !== action.movie.id
            )
          ]
        }
      }
    case ADD_MOVIE:
      return {
        ...state,
        userCart: {
          ...state.userCart,
          movies: [...state.userCart.movies, action.movie]
        }
      }
    case DELETE_CART:
      return {...state, userCart: {id: 0, movies: []}}
    case CHECK_CART_OUT:
      return {...state, userCart: {id: 0, movies: []}}
    case UPDATE_CART:
      return {
        ...state,
        userCart: {...state.userCart, quantity: action.quantity}
      }
    case GET_LOGGED_IN_SHOPPING_CART:
      if (action.cart === null) {
        return {...state}
      } else if (action.cart.movies === undefined) {
        return {
          ...state,
          userCart: {...action.cart, movies: state.userCart.movies}
        }
      }
      return {...state, userCart: action.cart}
    case ADD_GUEST_CART:
      return {
        ...state,
        userCart: {
          ...state.userCart,
          movies: [...state.userCart.movies, action.cart]
        }
      }
    default:
      return {...state}
  }
}

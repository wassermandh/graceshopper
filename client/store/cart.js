import axios from 'axios'
import history from '../history'

const GOT_CART = 'GOT_CART'
const ADD_ITEM = 'ADD_ITEM'
const GUEST_ADD = 'GUEST_ADD'
const EDIT_ITEM = 'EDIT_ITEM'
// const TRANSFER_GUEST_CART = 'TRANSFER_GUEST_CART'

const defaultCart = []

const gotCart = cart => ({type: GOT_CART, cart})
const addItem = (item, quantity) => ({type: ADD_ITEM, item, quantity})
const editItem = (item, quantity) => ({type: EDIT_ITEM, item, quantity})
export const guestAdd = cart => ({type: GUEST_ADD, cart})
// export const transferGuestCart = cart => ({type: TRANSFER_GUEST_CART, cart})

export const getCart = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get('/api/cart')
      console.log(data)
      dispatch(gotCart(data))
    } catch (err) {
      console.error(err)
    }
  }
}

// export const trasnferringGuestCart = cart => {
//   return async dispatch => {
//     try {
//       await axios.put('/api/cart/transferGuestCart', cart)
//     } catch (err) {
//       console.error(err)
//     }
//   }
// }

export const addingItem = (item, quantity) => {
  return async dispatch => {
    try {
      await axios.put(`/api/cart/add`, {item, quantity})
      if (item.cartQuantity) {
        item.cartQuantity = item.cartQuantity + quantity
      } else {
        item.cartQuantity = quantity
      }
      dispatch(addItem(item, quantity))
    } catch (err) {
      console.error(err)
    }
  }
}

export const editingItem = (item, quantity) => {
  return async dispatch => {
    try {
      await axios.put('/api/cart/edit', {item, quantity})
      dispatch(editItem(item, quantity))
    } catch (err) {
      console.error(err)
    }
  }
}

export default function(state = defaultCart, action) {
  switch (action.type) {
    case GOT_CART:
      return action.cart
    case ADD_ITEM:
      let added = false
      console.log(action.quantity)
      state.forEach((item, idx) => {
        if (item.id === action.item.id) {
          action.item.quantity = action.item.quantity - action.quantity
          action.item.cartQuantity = action.item.cartQuantity + action.quantity
          state[idx] = action.item
          added = true
        }
      })
      if (!added) {
        action.item.quantity = action.item.quantity - action.quantity
        action.item.cartQuantity = action.item.cartQuantity + action.quantity

        let item = action.item
        return [...state, item]
      } else {
        return [...state]
      }
    case GUEST_ADD:
      return action.cart
    case EDIT_ITEM:
      state.forEach((item, idx) => {
        if (item.id === action.item.id) {
          let oldQuant = item.cartQuantity
          let newQuant = action.quantity
          let diff = oldQuant - newQuant
          item.quantity = item.quantity + diff
          state[idx] = action.item
          state[idx].cartQuantity = action.quantity
        }
      })
      state = state.filter(item => {
        return item.cartQuantity !== 0
      })
      return [...state]
    default:
      return state
  }
}

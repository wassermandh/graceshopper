import React from 'react'
import {connect} from 'react-redux'
import {getProducts} from '../store/products'
import {NavLink} from 'react-router-dom'
import {guestAdd, addingItem} from '../store/cart'

class AllProducts extends React.Component {
  constructor() {
    super()
    this.addToCart = this.addToCart.bind(this)
  }
  componentDidMount() {
    this.props.getProducts()
    localStorage.setItem('cart', [])
  }
  addToCart(event) {
    if (!this.props.user.id) {
      if (localStorage.getItem('cart')) {
        let cart = JSON.parse(localStorage.getItem('cart'))
        let found = false
        // check if it exists
        // let stringifiedEvent = JSON.stringify(event)
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === event.id) {
            // if item is in cart
            cart[i].cartQuantity = cart[i].cartQuantity + 1
            found = true
          }
        }
        if (!found) {
          event.cartQuantity = 1
          cart.push(event)
        }
        found = false
        // if (cart.includes(stringifiedEvent)) cart.push(event)
        cart = JSON.stringify(cart)
        localStorage.setItem('cart', cart)
      } else {
        let cart = []
        event.cartQuantity = 1
        cart.push(event)
        cart = JSON.stringify(cart)
        localStorage.setItem('cart', cart)
      }
    }
    let parsedCart = JSON.parse(localStorage.getItem('cart'))
    this.props.guestAdd(parsedCart)
  }
  render() {
    return (
      <div
        className="ui center aligned one column grid"
        style={{'padding-top': '4%'}}
      >
        <h1 className="header item">Available Planets</h1>
        <div className="ui center aligned three column grid">
          {this.props.products.map(product => {
            return (
              <div key={product.id} className="column">
                <NavLink to={`/products/${product.id}`}>
                  <h2>{product.name}</h2>
                  <img src={product.imageUrl} />
                  {/* <p>Quantity: {product.quantity}</p> */}
                  <p>Price: $ {product.price / 100.0}</p>
                  {/* <button
                onClick={
                  !this.props.user.id
                    ? () => this.addToCart(product)
                    : () => this.props.userAdd(product)
                }
              >
                Add to cart
              </button> */}
                </NavLink>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    products: state.products,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProducts: () => {
      return dispatch(getProducts())
    },
    guestAdd: cart => {
      return dispatch(guestAdd(cart))
    },
    userAdd: item => {
      return dispatch(addingItem(item))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllProducts)

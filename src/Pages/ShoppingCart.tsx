
import React from 'react'
import CartSummary from '../Components/Page/Cart/CartSummary'
import CartPickUpDetails from '../Components/Page/Cart/CartPickUpDetails'

function ShoppingCart() {
  return (
    <div className='row w-100 mt-2'>
        <div className='col-lg-6 col-12' >
            <CartSummary></CartSummary>  
        </div>
        <div className='col-lg-6 col-12 fw-normal'>
            <CartPickUpDetails></CartPickUpDetails>
        </div>
    </div>
  )
}

export default ShoppingCart
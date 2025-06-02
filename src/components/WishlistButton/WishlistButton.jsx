import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../../slice/wishlistSlice'
import './WishlistButton.css'

const WishlistButton = ({ item, className = "" }) => {
  const dispatch = useDispatch()
  const isInWishlist = useSelector(state => selectIsInWishlist(state, item.id))
  
  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(item.id))
    } else {
      dispatch(addToWishlist(item))
    }
  }
  
  return (
    <button
      onClick={handleToggle}
      className={`wishlist-btn ${isInWishlist ? 'active' : ''} ${className}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill={isInWishlist ? '#ff4757' : 'none'} 
        stroke={isInWishlist ? '#ff4757' : '#666'}
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  )
}

export default WishlistButton
export const wishlistMiddleware = (store) => (next) => (action) => {
  const result = next(action)
  
  // Save wishlist to localStorage after certain actions
  if (action.type?.startsWith('wishlist/')) {
    const wishlistState = store.getState().wishlist
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistState.items))
  }
  
  return result
}
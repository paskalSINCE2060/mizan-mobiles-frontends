import { useDispatch, useSelector } from 'react-redux';
import { 
  addToWishlist, 
  removeFromWishlist, 
  selectIsInWishlist,
  selectWishlistCount,
  selectWishlistItems 
} from '../slice/wishlistSlice';

export const useWishlist = () => {
  const dispatch = useDispatch();
  
  // Use selectors if available, otherwise fallback to direct state access
  const wishlistItems = useSelector(state => 
    selectWishlistItems ? selectWishlistItems(state) : state.wishlist?.items || []
  );
  
  const wishlistCount = useSelector(state => 
    selectWishlistCount ? selectWishlistCount(state) : state.wishlist?.items?.length || 0
  );
  
  const addItem = (item) => {
    dispatch(addToWishlist(item));
  };
  
  const removeItem = (itemId) => {
    dispatch(removeFromWishlist(itemId));
  };
  
  // Fixed: Create a function that returns a boolean instead of calling useSelector inside
  const isInWishlist = (itemId) => {
    // Use selector logic if available, otherwise check the items array
    if (selectIsInWishlist) {
      // We can't call useSelector here, so we'll check against the wishlistItems we already have
      return wishlistItems.some(item => item.id === itemId);
    }
    return wishlistItems.some(item => item.id === itemId);
  };
  
  const toggleWishlist = (item) => {
    const inWishlist = isInWishlist(item.id);
    if (inWishlist) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };
  
  return {
    wishlistItems,
    wishlistCount,
    addItem,
    removeItem,
    isInWishlist,
    toggleWishlist
  };
};
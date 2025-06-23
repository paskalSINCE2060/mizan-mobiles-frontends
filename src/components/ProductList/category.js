// Base64 placeholder image to avoid 404 errors
export const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMTI1SDc1VjE3NUgxMjVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTc1IDEyNUwyMjVWMTc1SDE3NVYxMjVaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzE2MS4wNDYgMTAwIDE3MCA5MS4wNDU3IDE3MCA4MEMxNzAgNjguOTU0MyAxNjEuMDQ2IDYwIDE1MCA2MEM1MC45NTQzIDYwIDUwIDY4Ljk1NDMgNTAgODBDNTAgOTEuMDQ1NyA1MC45NTQzIDEwMCAxNTAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";

export const validCategories = ['smartphone', 'tablet', 'watch', 'earphones', 'premiumsmartphones', 'galaxyproducts'];

export const getCategoryDisplayName = (category) => {
  const categoryMap = {
    'smartphone': 'Smartphones',
    'tablet': 'Tablets',
    'watch': 'Watches',
    'earphones': 'Earphones',
    'premiumsmartphones': 'Premium Smartphones',
    'galaxyproducts': 'Galaxy Products'
  };
  return categoryMap[category] || (typeof category === 'string' && category.length > 0
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : '');
};
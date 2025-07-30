// frontend/src/slice/checkoutOrdersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching checkout orders
export const fetchCheckoutOrders = createAsyncThunk(
  'checkoutOrders/fetchCheckoutOrders',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const { page = 1, limit = 20, status = 'all', search = '' } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
        search,
      });

      const response = await fetch(`/api/checkout-orders/admin/orders?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch checkout orders');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating order status
export const updateOrderStatus = createAsyncThunk(
  'checkoutOrders/updateOrderStatus',
  async ({ orderId, orderStatus, adminNotes, paymentStatus  }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      // Build the request body - include paymentStatus if provided
      const requestBody = { orderStatus, adminNotes };
      
      // Only include paymentStatus if it's provided
      if (paymentStatus !== undefined && paymentStatus !== null) {
        requestBody.paymentStatus = paymentStatus;
      }

      const response = await fetch(`/api/checkout-orders/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'checkoutOrders/fetchDashboardStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const response = await fetch('/api/checkout-orders/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const checkoutOrdersSlice = createSlice({
  name: 'checkoutOrders',
  initialState: {
    orders: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      hasNext: false,
      hasPrev: false,
    },
    dashboardStats: {
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      totalRevenue: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch checkout orders
      .addCase(fetchCheckoutOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckoutOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCheckoutOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific order in the orders array
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setOrders } = checkoutOrdersSlice.actions;

// Selectors
export const selectCheckoutOrders = (state) => state.checkoutOrders.orders;
export const selectCheckoutOrdersPagination = (state) => state.checkoutOrders.pagination;
export const selectCheckoutOrdersLoading = (state) => state.checkoutOrders.loading;
export const selectCheckoutOrdersError = (state) => state.checkoutOrders.error;
export const selectDashboardStats = (state) => state.checkoutOrders.dashboardStats;

export default checkoutOrdersSlice.reducer;
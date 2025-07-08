import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Helper function to create headers with auth from Redux state
const getAuthHeaders = (getState) => {
  const { auth } = getState();
  const token = auth?.token;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Async thunk for fetching phone orders
export const fetchPhoneOrders = createAsyncThunk(
  'phoneOrders/fetchPhoneOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/phone-orders', {
        method: 'GET',
        headers: getAuthHeaders(getState)
      })
      if (!response.ok) {
        throw new Error('Failed to fetch phone orders')
      }
      const data = await response.json()
      
      // Return the data array from the response
      return data.data || data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for creating a new phone order
export const createPhoneOrder = createAsyncThunk(
  'phoneOrders/createPhoneOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      // Add default status if not provided
      const orderWithStatus = {
        ...orderData,
        status: orderData.status || 'pending'
      };

      const response = await fetch('http://localhost:5000/api/admin/phone-orders', {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: JSON.stringify(orderWithStatus),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create phone order')
      }
      const data = await response.json()
      
      // Return the data from the response (could be data.data or just data)
      return data.data || data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for updating phone order status
export const updatePhoneOrderStatus = createAsyncThunk(
  'phoneOrders/updatePhoneOrderStatus',
  async ({ orderId, status }, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/phone-orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeaders(getState),
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        throw new Error('Failed to update phone order status')
      }
      const data = await response.json()
      return { orderId, status, updatedOrder: data.data || data }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const phoneOrderSlice = createSlice({
  name: 'phoneOrders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
    submitLoading: false,
    submitError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
      state.submitError = null
    },
    clearSubmitStatus: (state) => {
      state.submitLoading = false
      state.submitError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch phone orders
      .addCase(fetchPhoneOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPhoneOrders.fulfilled, (state, action) => {
        state.loading = false
        // Handle both direct array and wrapped response
        const ordersData = action.payload
        state.orders = Array.isArray(ordersData) ? ordersData : []
      })
      .addCase(fetchPhoneOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.orders = [] // Ensure orders is always an array
      })
      // Create phone order
      .addCase(createPhoneOrder.pending, (state) => {
        state.submitLoading = true
        state.submitError = null
      })
      .addCase(createPhoneOrder.fulfilled, (state, action) => {
        state.submitLoading = false
        // Ensure orders is an array before adding
        if (Array.isArray(state.orders)) {
          state.orders.unshift(action.payload)
        } else {
          state.orders = [action.payload]
        }
      })
      .addCase(createPhoneOrder.rejected, (state, action) => {
        state.submitLoading = false
        state.submitError = action.payload
      })
      // Update phone order status
      .addCase(updatePhoneOrderStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(updatePhoneOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        const { orderId, status } = action.payload
        if (Array.isArray(state.orders)) {
          const orderIndex = state.orders.findIndex(order => order._id === orderId)
          if (orderIndex !== -1) {
            state.orders[orderIndex].status = status
          }
        }
      })
      .addCase(updatePhoneOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearSubmitStatus } = phoneOrderSlice.actions
export default phoneOrderSlice.reducer
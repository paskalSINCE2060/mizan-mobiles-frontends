// slice/sellPhoneSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for submitting sell phone request
export const submitSellPhoneRequest = createAsyncThunk(
  'sellPhone/submitRequest',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://mizan-mobile-backend-mizan.up.railway.app/api/sell-phone/request', {
        method: 'POST',
        body: formData, // FormData object
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to submit request');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching sell phone requests (admin)
export const fetchSellPhoneRequests = createAsyncThunk(
  'sellPhone/fetchRequests',
  async ({ page = 1, limit = 10, status = 'all', search = '' }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status !== 'all' && { status }),
        ...(search && { search })
      });

      const response = await fetch(`https://mizan-mobile-backend-mizan.up.railway.app/api/sell-phone/requests?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch requests');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for updating request status
export const updateRequestStatus = createAsyncThunk(
  'sellPhone/updateStatus',
  async ({ id, status, adminNotes }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`https://mizan-mobile-backend-mizan.up.railway.app/api/sell-phone/request/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, adminNotes })
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update status');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for updating quote
export const updateRequestQuote = createAsyncThunk(
  'sellPhone/updateQuote',
  async ({ id, estimatedPrice, adminNotes, status }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`https://mizan-mobile-backend-mizan.up.railway.app/api/sell-phone/request/${id}/quote`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estimatedPrice, adminNotes, status })
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update quote');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for deleting request
export const deleteRequest = createAsyncThunk(
  'sellPhone/deleteRequest',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`https://mizan-mobile-backend-mizan.up.railway.app/api/sell-phone/request/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to delete request');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState = {
  // Form submission state
  submitLoading: false,
  submitSuccess: false,
  submitError: null,
  
  // Admin requests state
  requests: [],
  currentRequest: null,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
    hasNext: false,
    hasPrev: false
  },
  
  // Loading states
  loading: false,
  updateLoading: false,
  deleteLoading: false,
  
  // Error states
  error: null,
  
  // Filters
  filters: {
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  }
};

const sellPhoneSlice = createSlice({
  name: 'sellPhone',
  initialState,
  reducers: {
    // Reset form submission state
    resetSubmitState: (state) => {
      state.submitLoading = false;
      state.submitSuccess = false;
      state.submitError = null;
    },
    
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
      state.submitError = null;
    },
    
    // Set current request
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload;
    },
    
    // Clear current request
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit request
      .addCase(submitSellPhoneRequest.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitSellPhoneRequest.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = true;
        state.submitError = null;
      })
      .addCase(submitSellPhoneRequest.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = false;
        state.submitError = action.payload;
      })
      
      // Fetch requests
      .addCase(fetchSellPhoneRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellPhoneRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.requests;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchSellPhoneRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update status
      .addCase(updateRequestStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.requests.findIndex(req => req._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest && state.currentRequest._id === action.payload._id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Update quote
      .addCase(updateRequestQuote.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateRequestQuote.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.requests.findIndex(req => req._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest && state.currentRequest._id === action.payload._id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(updateRequestQuote.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Delete request
      .addCase(deleteRequest.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.requests = state.requests.filter(req => req._id !== action.payload);
        if (state.currentRequest && state.currentRequest._id === action.payload) {
          state.currentRequest = null;
        }
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  resetSubmitState,
  setFilters,
  clearError,
  setCurrentRequest,
  clearCurrentRequest
} = sellPhoneSlice.actions;

export default sellPhoneSlice.reducer;

// Selectors
export const selectSellPhoneState = (state) => state.sellPhone;
export const selectSellPhoneRequests = (state) => state.sellPhone.requests;
export const selectSellPhonePagination = (state) => state.sellPhone.pagination;
export const selectSellPhoneLoading = (state) => state.sellPhone.loading;
export const selectSellPhoneError = (state) => state.sellPhone.error;
export const selectSubmitLoading = (state) => state.sellPhone.submitLoading;
export const selectSubmitSuccess = (state) => state.sellPhone.submitSuccess;
export const selectSubmitError = (state) => state.sellPhone.submitError;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetch2 } from '../helpers/fetch2'

const initialState = {
  token: '',
  loading: false,
  message: '',
}

export const signUpUser = createAsyncThunk('signUpUser', async (body) => {
  const result = await fetch2('/signup', body)
  return result
})

export const signInUser = createAsyncThunk('signInUser', async (body) => {
  const result = await fetch2('/signin', body)
  return result
})

const authReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.token = localStorage.getItem('token')
    },
    logout: (state, action) => {
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: {
    [signUpUser.pending]: (state, action) => {
      state.loading = true
    },
    [signUpUser.fulfilled]: (state, { payload: { error, message } }) => {
      state.loading = false
      if (error) state.message = error
      else if (message) state.message = message
    },
    [signInUser.pending]: (state, action) => {
      state.loading = true
    },
    [signInUser.fulfilled]: (state, { payload: { error, token } }) => {
      state.loading = false
      if (error) {
        state.message = error
      } else if (token) {
        state.token = token
        localStorage.setItem('token', token)
      }
    },
  },
})

export const { addToken, logout } = authReducer.actions
export default authReducer.reducer

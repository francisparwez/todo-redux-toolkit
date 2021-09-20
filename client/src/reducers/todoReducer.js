import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetch2, fetchOrRemove } from '../helpers/fetch2'

const initialState = []

export const createTodo = createAsyncThunk('createTodo', async (body) => {
  const result = await fetch2('/createTodo', body)
  return result
})

export const fetchTodos = createAsyncThunk('fetchTodos', async () => {
  const result = await fetchOrRemove('/getTodos', 'GET')
  return result
})

export const deleteTodos = createAsyncThunk('deleteTodos', async (id) => {
  const result = await fetchOrRemove(`/removeTodo/${id}`, 'DELETE')
  return result
})

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {},
  extraReducers: {
    [createTodo.fulfilled]: (state, { payload: { message } }) => {
      if (message) state.push(message)
    },
    [fetchTodos.fulfilled]: (state, { payload: { message } }) => {
      return message
    },
    [deleteTodos.fulfilled]: (state, { payload: { message } }) => {
      const removedTodos = state.filter((item) => item._id !== message._id)
      return removedTodos
    },
  },
})

export default todoSlice.reducer

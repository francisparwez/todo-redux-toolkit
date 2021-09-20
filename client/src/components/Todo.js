import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTodo, deleteTodos, fetchTodos } from '../reducers/todoReducer'
import { logout } from '../reducers/authReducer'

function Todo() {
  const [myTodo, setMyTodo] = useState('')
  const dispatch = useDispatch()
  const todos = useSelector((state) => state.todos)

  const addTodo = () => {
    if (myTodo !== '') {
      dispatch(createTodo({ todo: myTodo }))
      setMyTodo('')
    }
  }

  useEffect(() => {
    dispatch(fetchTodos())
  }, [dispatch])

  return (
    <div className='container'>
      <h2>Add New Todos</h2>
      <input
        placeholder='Write TODO Here'
        value={myTodo}
        onChange={(e) => setMyTodo(e.target.value)}
      />
      <button className='btn #ff4081 pink accent-2' onClick={() => addTodo()}>
        Add Todo
      </button>

      <ul className='collection'>
        {todos.map((item) => {
          return (
            <li
              className='collection-item'
              key={item._id}
              onClick={() => dispatch(deleteTodos(item._id))}
            >
              {item.todo}
            </li>
          )
        })}
      </ul>

      <button
        className='btn #ff4081 pink accent-2'
        onClick={() => dispatch(logout())}
      >
        Logout
      </button>
    </div>
  )
}

export default Todo

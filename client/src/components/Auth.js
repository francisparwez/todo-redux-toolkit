import { useState } from 'react'
import { signInUser, signUpUser } from '../reducers/authReducer'
import { useDispatch, useSelector } from 'react-redux'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState('Sign In')

  const dispatch = useDispatch()
  const { loading, message } = useSelector((state) => state.user)

  const authenticate = () => {
    if (auth === 'Sign In') {
      dispatch(signInUser({ email, password }))
    } else {
      dispatch(signUpUser({ email, password }))
    }
  }

  return (
    <div className='container'>
      {loading && (
        <div className='progress'>
          <div className='indeterminate'></div>
        </div>
      )}
      <h1>Please {auth}</h1>
      {message && <h4>{message}</h4>}
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={'Please Enter Your Email'}
      />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={'Please Enter Your Password'}
      />
      {auth === 'Sign In' ? (
        <h6 onClick={() => setAuth('Sign Up')}>Don't Have An Account?</h6>
      ) : (
        <h6 onClick={() => setAuth('Sign In')}>Already Have An Account?</h6>
      )}
      <button className='btn' onClick={() => authenticate()}>
        {auth}
      </button>
    </div>
  )
}

export default Auth

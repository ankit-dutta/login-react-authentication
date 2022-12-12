import { useRef, useState } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [loading,setloading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) =>{
    event.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPass = passRef.current.value;

    setloading(true);
    if(isLogin){

    }else{
       fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCvZa-5u7cUh93_CV9xqh5JzLRSkdD9VFk",{
        method: 'POST',
        body:JSON.stringify({
          email:enteredEmail,
          password:enteredPass,
          returnSecureToken: true
        }),
        headers:{
          'Content-Type': 'application/json',
        }
       }).then(res =>{
        setloading(false)
        if(res.ok){
          
        }else{
          return res.json().then((data)=>{
            console.log(data)
            let errorMessage = 'Authentication failed';
            if(!data && data.error && data.error.message){
              errorMessage = data.error.message;
            }
            alert(errorMessage);
             
          })
        }
       })
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passRef} />
        </div>
        <div className={classes.actions}>
       { !loading &&  <button>{isLogin ? 'Login' : 'Create Account'}</button>}
       {  loading && <p>Loading...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
import UsernameInput from '../Components/AuthComponents/UsernmaeInput'
import PasswordInput from '../Components/AuthComponents/PasswordInput'
import {Link, useNavigate} from 'react-router-dom'
import { useState,useContext } from 'react'
// import OAuthButton from '../Components/AuthComponents/OAuthButton'
import { login } from '../Services/authService'


const LoginPage = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault()
    login(userDetails).then((response)=>{
      const { token, ...userData } = response.data;
      sessionStorage.setItem("token", `${token}`);
      sessionStorage.setItem("user", JSON.stringify(userData));
      console.log("logging in")
      navigate('/home')
    }).catch((error) => console.log(error))

  }

  return (
    <div>
      <div className='container mx-auto flex justify-center items-center h-screen'>
        <div className='w-96 p-6 bg-white rounded shadow-2xl justify-items-center'>
          <h2 className='text-2xl font-bold mb-4 '>Login</h2>
          <form className='space-y-4'  noValidate={true} onSubmit={handleSubmit}>
              <UsernameInput  value ={userDetails.username} isLogin={true} onChange={(e) => setUserDetails({...userDetails, username: e.target.value})}/>
              <PasswordInput  value ={userDetails.password} isLogin={true} onChange={(e) => setUserDetails({...userDetails, password: e.target.value})}/>
              
              <span className=''>
            <button type='submit' className="w-80 btn btn-primary mt-3" >Log in</button>
            </span>
            <div className='w-full items-center justify-center flex gap-2 mt-4'>
              {/* <OAuthButton /> */}
              <p className=' text-sm text-gray-600'>Don't have an account? <Link to='/signup' className='text-blue-500 hover:underline'>Sign up</Link></p>
            </div>
           
          </form>
        </div>      
      </div>
    </div>
  )
}

export default LoginPage
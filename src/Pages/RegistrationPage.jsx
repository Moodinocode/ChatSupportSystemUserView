import UsernameInput from '../Components/AuthComponents/UsernmaeInput'
import PasswordInput from '../Components/AuthComponents/PasswordInput'
import EmailInput from '../Components/AuthComponents/EmailInput'
import {Link,useNavigate} from 'react-router-dom'
import { useState } from 'react'
import { register } from '../Services/authService'

const RegistrationPage = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: ''
  });
   const navigate = useNavigate();

  const handleSubmit = () => (e) => {
    e.preventDefault()
    //console.log(userDetails)
    register(userDetails).then((response) => {
      //console.log(response.data);
      navigate('/login')
    }).catch(error => console.log(error))
    
  }

  return (
        <div>
      <div className='container mx-auto flex justify-center items-center h-screen'>
        <div className='w-96 p-6 bg-white rounded shadow-2xl justify-items-center'>
          <h2 className='text-2xl font-bold mb-4 '>Sign up</h2>
          <form className='space-y-4'  onSubmit={handleSubmit()}>
              <UsernameInput  value ={userDetails.username} onChange={(e) => setUserDetails({...userDetails, username: e.target.value})}/>
              <EmailInput     value ={userDetails.email} onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}/>
              <PasswordInput  value ={userDetails.password} onChange={(e) => setUserDetails({...userDetails, password: e.target.value})}/>

              
              <span className=''>
            <button className="w-80 btn btn-primary mt-3">Sign up</button>
            </span>

          </form>
          <p className='mt-4 text-sm text-gray-600'>
            Already have an account?  
            <Link to='/login' className='text-blue-500 hover:underline'> Log in</Link>
            </p>
  
        </div>      
      </div>
    </div>
  )
}

export default RegistrationPage
import React from 'react'
import Template from '../components/core/Auth/Template'
import loginImg from "../Assets/Images/login.webp"

const Login = () => {
  return (
    <div>
        <Template title="Welcome back"
        description1="build skills for today, tommorow, and beyond."
        description2="Education to future-proof your career."
        image={loginImg}
        formType="login"
        />
    </div>
  )
}

export default Login

import { useLogin } from "../context/LoginContext";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Login() {
    const [,setLogin]=useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate =useNavigate();

    const handleSubmit = async(event) => {
        event.preventDefault();
        console.log({
            email,
            password
        });
        const data={email,password}
        var subject='Login to your account detected'
        var text='from e-commerce'
        const emailData={email,subject,text}
        try{
            const response= await fetch('/login',{
                method:'POST',
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify(data)
            
            })
            try {
                await fetch('/send-email',{
                    method:'POST',
                    headers: { "Content-Type": "application/json" },
                    body:JSON.stringify(emailData)
                });
              } catch (error) {
                console.error('Error sending email:', error);
              }
            if (response.status === 200) {
                setLogin(true);
                localStorage.setItem('session',response.json())
                navigate('/');
                toast.success("Login successful", { autoClose: 1000 });
            } else if (response.status === 404) {
                const errorData = await response.json();
                console.log(errorData);
                toast.warning("Not a user , Please Signin", { autoClose: 1000 });
            } else {
                console.log('An error occurred');
                toast.error("An error occurred", {autoClose: 1000});
            }
            
        }catch(err){
            console.log(err);
            toast.error("An error occurred", {autoClose: 1000});
        }
    };
    
    return ( <>
    <form className="form-login" onSubmit={handleSubmit} autoComplete="off">
                <label className="form-label" htmlFor="email">Email:</label>
                <input 
                    className="form-input" 
                    type="email" 
                    required 
                    name="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                /><br/><br/>

                <label className="form-label" htmlFor="password">Password</label>
                <input 
                    className="form-input" 
                    type="password" 
                    name="password" 
                    required 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                /><br/><br/>
                <button className="form-button" type="submit">Submit</button><br/><br/>
                <Link to='/signin' style={{}}>Not a User? <span style={{color:'blue'}}>Signin here</span></Link>
            </form>
    </> );
}

export default Login;
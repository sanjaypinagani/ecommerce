import { useState } from "react";
import './signin.css';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const navigate=useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({
            name,
            email,
            mobile,
            password,
            gender
        });
        const data={name,email,mobile,password,gender}
        try{
            fetch('/signin',{
                method:'POST',
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify(data)
            }).then(response=>{
                if(response.status===200){
                    console.log(response.json());
                    toast.success("Signin successful, Login in continue", { autoClose: 1000 });
                    navigate('/login');
                }else if(response.status===409) {
                   console.log(response.json());
                   toast.warning("Already a user , Please Login", { autoClose: 1000 });
                   navigate('/login');
                }else{
                    console.log('error')
                }
            })
            
        }catch(err){
            console.log(err)
        }
    };

    return (
        <>
            <form className="form-login" onSubmit={handleSubmit} autoComplete="off">
                <label className="form-label" htmlFor="name">Name</label>
                <input 
                    className="form-input" 
                    type="text" 
                    required 
                    name="name" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                /><br/><br/>

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

                <label className="form-label" htmlFor="mobile">Mobile:</label>
                <input 
                    className="form-input" 
                    type="text" 
                    name="mobile" 
                    id="mobile" 
                    maxLength={10}
                    minLength={10}
                    value={mobile} 
                    onChange={(e) => setMobile(e.target.value)} 
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

                <label className="form-label" htmlFor="gender">Gender:</label>
                <select 
                    className="form-input" 
                    name="gender" 
                    id="gender" 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select><br/><br/>

                <button className="form-button" type="submit">Submit</button><br/><br/>
                <Link to='/login' style={{}}>Already a User? <span style={{color:'blue'}}>Login here</span></Link>
            </form>
        </>
    );
}

export default SignIn;

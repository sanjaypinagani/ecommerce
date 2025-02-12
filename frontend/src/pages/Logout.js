import { useLogin } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Logout() {
    const [,setLogin]=useLogin();
    const navigate =useNavigate();

    const Logout = async(event) => {
        event.preventDefault();
        try{
            const response= await fetch('/logout')
            if (response.status === 200) {
                setLogin(false);
                localStorage.removeItem('session');
                navigate('/');
                toast.success("Loggedout successfully", { autoClose: 2000 });
            } else {
                console.log('An error occurred');
                toast.error("An error occurred", {autoClose: 2000});
            }
            
            
        }catch(err){
            console.log(err);
            toast.error('Internal server error' , {autoClose: 2000});
        }
    };
    
    return ( <>
        <button className="logout-button" type="submit" onClick={Logout}>Logout</button><br/><br/>
    </> );
}

export default Logout;
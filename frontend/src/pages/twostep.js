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
                toast.success("Signin successful, Login in continue", { autoClose: 3000 });
                navigate('/login');
            }else if(response.status===409) {
               console.log(response.json());
               toast.warning("Already a user , Please Login", { autoClose: 3000 });
               navigate('/login');
            }else{
                console.log('error')
            }
        })
        
    }catch(err){
        console.log(err)
    }
};
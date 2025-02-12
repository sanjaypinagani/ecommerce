import { useCart } from "../context/CartContex";
import { useLogin } from "../context/LoginContext";
import { useEffect } from "react";
import './cart.css';
function Cart() {
    const [Login, setLogin] = useLogin();
    const [cart, setCart] = useCart();

    useEffect(() => {
        const fetchCart = async () => {
            if (Login) {
                try {
                    const response = await fetch('/cart');
                    const data = await response.json();
                    if (response.status === 200) {
                        setCart(data);
                        console.log('setting cart')
                    } else if (response.status === 401) {
                        setLogin(false);
                    } else {
                        console.log('Error');
                        alert('An error has occurred');
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            }
        };

        fetchCart();
        console.log('for fetching cart')
        // eslint-disable-next-line 
    }, [Login]);

    const T=()=>{
        if (cart.items){
            let total=0
            cart.items.map((cartitem,index)=>(
                total +=(cartitem.item.price)*cartitem.quantity
            ))
            return total
        }
    }


    const removeitem=async(id)=>{
        console.log(id)
        const response=await fetch('/cart',{
            method:'DELETE',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({id})
        });
        const d= await response.json();
        if(response.status===200){
            console.log('removed item')
            setCart(d);
        }else{
            console.log(response.status)
        }
    }

    const quantity = async (id,type) => {
        try {
            const response = await fetch('/cart', {
                method: 'PUT',
                headers:{"Content-Type": "application/json" },
                body:JSON.stringify({id,type})
            });
            const data = await response.json();
            if (response.status === 200) {
                setCart(data);
            } else {
                console.log('Error');
                alert('An error has occurred');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    const handlePayment = async () => {
        const amount = T(); // Total cart amount
        try {
            const response = await fetch('/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });
    
            const { order_id } = await response.json();
    
            
            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID',
                amount: amount * 100,
                currency: 'INR',
                name: 'Your Company Name',
                description: 'Thank you for shopping with us',
                order_id, 
                handler: async (response) => {
                    console.log(response);
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
    
                    
                    const verificationResponse = await fetch('/verifyPayment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_payment_id,
                            razorpay_order_id,
                            razorpay_signature,
                        }),
                    });
    
                    if (verificationResponse.status === 200) {
                        alert('Payment successful');
                    } else {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'Sanjay',
                    email: 'sanjayomagani@smail.com',
                    contact: '919490770765',
                },
                theme: {
                    color: '#F37254',
                },
            };
    
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment initiation error:', error);
        }
    };
    


    console.log(cart)

    return (
        <div className="container">
            {!Login && <h1>Login to go to cart</h1>}
            {Login && (
                <div className="row">
                    <h1>Cart</h1>
                    {(!cart || !cart.items || cart.items.length === 0) && <h2>Your cart is empty</h2>}
                    {cart && cart.items && cart.items.length > 0 && (
                        <ul>
                            {cart.items.map((cartitem, index) => (
                                <li key={index} style={{listStyleType:'none'}}>
                                    <div className='itemList' >
                                        <div className='itemList__image' >
                                            <img srcSet={cartitem.item.image} style={{width:'100px',height:'100px'}} alt={`${cartitem.item.name}` }></img>
                                        </div>
                                        <div className='itemList__description' >
                                            <p>{cartitem.item.name}</p>
                                                {cartitem.item.description && cartitem.item.description.substring(0,60)}..
                                        </div>
                                        <div className='itemList__price' >
                                            <p> ₹{cartitem.item.price}</p> 
                                        </div>
                                        <div>
                                            <button onClick={() => quantity(cartitem.item._id,'sub')}>-</button>
                                            <p>{cartitem.quantity}</p>
                                            <button onClick={() => quantity(cartitem.item._id,'add')}>+</button>
                                        </div>
                                        <div className="itemList__removebutton">
                                            <button onClick={()=>removeitem(cartitem.item._id)}>Remove</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            <h1>Total:{T()}</h1>
                            <button onClick={handlePayment}>Proceed to Payment</button>

                        </ul>
                    )}
                </div>   
            )}
        </div>
    );
}

export default Cart;

import { useState,useEffect } from "react";
import { useLogin } from "../context/LoginContext";

function Orders() {
    const [Login,setLogin]=useLogin();
    const [orders,setOrders]=useState();

    useEffect(() => {
        const fetchOrder = async () => {
            if (Login) {
                try {
                    const response = await fetch('/orders');
                    const data = await response.json();
                    if (response.status === 200) {
                        setOrders(data);
                        console.log('setting orders')
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
        fetchOrder();
        console.log('for fetching orders')
    }, [Login]);

    return ( <>
    <div className="container">
            {!Login && <h1>Login to go to orders</h1>}
            {Login && (
                <div className="row">
                    <h1>Orders</h1>
                    {(!orders || !orders.items || orders.items.length === 0) && <h2>Your orders is empty</h2>}
                    {orders && orders.items && orders.items.length > 0 && (
                        <ul>
                            {orders.items.map((orderitem, index) => (
                                <li key={index} style={{listStyleType:'none'}}>
                                    <div className='itemList' >
                                        <div className='itemList__image' >
                                            <img srcSet={orderitem.item.image} style={{width:'100px',height:'100px'}}></img>
                                        </div>
                                        <div className='itemList__description' >
                                            <p>{orderitem.item.name}</p>
                                                {orderitem.orderDate}
                                                {orderitem.payment}
                                                {orderitem.status}
                                        </div>
                                        <div className='itemList__price' >
                                            <p> ₹{orderitem.item.price}</p> 
                                        </div>
                                        
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>   
            )}
        </div>
    
    </> );
}

export default Orders;
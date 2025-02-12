import {Link} from 'react-router-dom'

function ItemList({item,id}) {
    const percentageOff = ((item.beforePrice - item.price) / item.beforePrice) * 100;
    return (<>
    <Link to={`/${id}/${item._id}`}>
    <div className='itemList' >
        <div className='itemList__image' >
                <img srcSet={item.image}></img>
        </div>
        <div className='itemList__description' >
            <p>{item.name}</p>
            <ul>
                {item.description}
            </ul>
        </div>
        <div className='itemList__price' >
            <p> ₹{item.price}</p> 
            <p><span className='beforePrice'> ₹{item.beforePrice}</span>
            {percentageOff > 0 && (<span className='percentage-off'> {percentageOff.toFixed(0)}% off</span>)}</p>   
        </div>
    </div>
    </Link>
    </>  );
}

export default ItemList;
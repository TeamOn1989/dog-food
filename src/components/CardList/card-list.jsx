import Card from '../Card/card';
import './index.css';


const CardList = ({goods, onProductLike, curretnUser}) => {
	return (
		<div className='cards'>		
		{
			goods.map((item)=> <Card key={item._id} {...item} curretnUser={curretnUser} onProductLike={onProductLike}/>)
		}	
		</div>		
	);
};

export default CardList;

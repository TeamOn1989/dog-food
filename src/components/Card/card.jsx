import './index.css';
import {ReactComponent as Save} from "./save.svg";
import cn from "classnames"

const Card = ( { name, price, discount, wight, description, pictures, onProductLike, _id, likes, curretnUser } ) => {
	function handleLikeClick() {
		onProductLike({_id, likes})
	}
	const isLiked = likes.some(id => id === curretnUser._id)


	const discountPrice = Math.floor(price - (price * discount / 100))
	return (
		<div className="card">
			<div className="card__sticky card__sticky_type_top-left">
				{discount !== 0 && <span className="card__discount">{`-${discount}%`}</span>}
			</div>
			<div className="card__sticky card__sticky_type_top-right">
				<button className={cn('card__favorite', {
					"card__favorite_is-active": isLiked,
				})} onClick={handleLikeClick}>
					<Save className='card__favourite-icon'/>
				</button>
			</div>
			<a href="/product" className="card__link">
				<img src={pictures} alt={description} className="card__image" />
				<div className="card__desc">
					<span className={discount !==0 ? "card__old-price" : "card__price"}>{price}&nbsp;₽</span>
					{discount !== 0 && <span className="card__price card__price_type_discount">{discountPrice}&nbsp;₽</span>}
					<span className="card__wight">{wight}</span>
					<p className="card__name">{name}</p>
				</div>
			</a>
			<a href="#" className="card__cart btn btn_type_primary">
				В корзину
			</a>
		</div>
	);
};

export default Card;

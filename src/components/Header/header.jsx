import { useContext } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { ReactComponent as FavoriteIcon } from './img/favorites.svg';
import { CardContext } from '../../context/cardContext';
import s from './index.module.css';

function Header({ children, user, onUpdateUser }) {
  const { favorites } = useContext(CardContext);
  return (
    <header className={cn(s.header, 'cover')}>
      <div className="container">
        <div className={s.header__wrapper}>
          {children}
          <div className={s.iconsMenu}>
            <Link
              className={s.favoritesLink}
              to={{ pathname: '/favorites', state: { from: '123' } }}
            >
              <FavoriteIcon />
              {favorites.length !== 0 && (
                <span className={s.iconBubble}>{favorites.length}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

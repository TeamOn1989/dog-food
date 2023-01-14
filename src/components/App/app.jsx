import { useState, useEffect, useCallback } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Footer from '../Footer/footer';
import Header from '../Header/header';
import Logo from '../Logo/logo';
import Search from '../Search/search';
import SeachInfo from '../SeachInfo';
import api from '../../utils/api';
import useDebounce from '../../hooks/useDebaunts';
import { isLiked } from '../../utils/product';
import { CatalogPage } from '../../pages/CatalogPages/catalog-page';
import { ProductPage } from '../../pages/ProductPage/product-page';
import { UserContext } from '../../context/userContext';
import { CardContext } from '../../context/cardContext';
import { FaqPage } from '../../pages/FAQPage/faq-page';
import { FavoritePage } from '../../pages/FavoritePage/favorite-page';
import { NotFoundPage } from '../../pages/NotFoundPage/not-found-page';
import './index.css';

function App() {
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const debounceSearchQuery = useDebounce(searchQuery, 500);
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  const handleRequest = useCallback(() => {
    setIsLoading(true);
    api
      .search(searchQuery)
      .then((searchResult) => {
        setCards(searchResult);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([api.getProductList(), api.getUserInfo()])
      .then(([productsData, userData]) => {
        setCurrentUser(userData);
        setCards(productsData.products);
        const favoriteProducts = productsData.products.filter((item) =>
          isLiked(item.likes, userData._id)
        );
        setFavorites((prevSate) => favoriteProducts);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    handleRequest();
  }, [debounceSearchQuery]);

  const handleFormSubmit = (inputText) => {
    navigate('/');
    setSearchQuery(inputText);
    handleRequest();
  };

  const handleInputChange = (inputValue) => {
    setSearchQuery(inputValue);
  };

  const handleProductLike = useCallback(
    (product) => {
      const liked = isLiked(product.likes, currentUser._id);
      return api.changeLikeProduct(product._id, liked).then((updateCard) => {
        const newProducts = cards.map((cardState) => {
          return cardState._id === updateCard._id ? updateCard : cardState;
        });

        if (!liked) {
          setFavorites((prevState) => [...prevState, updateCard]);
        } else {
          setFavorites((prevState) =>
            prevState.filter((card) => card._id !== updateCard._id)
          );
        }

        setCards(newProducts);
        return updateCard;
      });
    },
    [currentUser, cards]
  );

  return (
    <>
      <UserContext.Provider value={{ user: currentUser, isLoading }}>
        <CardContext.Provider
          value={{ cards, favorites, handleLike: handleProductLike }}
        >
          <Header>
            <>
              <Logo className="logo logo_place_header" href="/" />
              <Routes>
                <Route
                  path="/"
                  element={
                    <Search
                      onSubmit={handleFormSubmit}
                      onInput={handleInputChange}
                    />
                  }
                />
              </Routes>
            </>
          </Header>
          <main className="content container">
            <SeachInfo searсhText={searchQuery} />
            <Routes>
              <Route index element={<CatalogPage />} />
              <Route
                path="/product/:productId"
                element={<ProductPage isLoading={isLoading} />}
              />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/favorites" element={<FavoritePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </CardContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;

import CardList from '../CardList/card-list';
import Footer from '../Footer/footer';
import Header from '../Header/header';
import Sort from '../Sort/sort';
import './index.css';
import { useEffect, useState } from 'react';
import Logo from '../Logo/logo';
import Search from '../Search/search';
import SearchInfo from '../SeachInfo/SeachInfo';
import api from '../../assets/utils/api'
import useDebounce from '../../hooks/useDebounce';

function App() {
  const [cards, setCards] = useState([])
  const [searchQuerry, setsearchQuerry] = useState('')
  const [curretnUser, setCurretnUser] = useState(null)
  const debounceSearchQuerry = useDebounce(searchQuerry, 300)


  const handleRequest = () => {
    api.search(debounceSearchQuerry)
      .then((searchResult) => {
        setCards(searchResult)
      })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    handleRequest()
  }

  const handleInputChange = (value) => {
    setsearchQuerry(value)
  }

  const handleUpdateUser = (userUpdateData) => {
    api.setUserInfo(userUpdateData)
      .then((newUserData) => {
        setCurretnUser(newUserData)
      })
    
  }

  useEffect(() => {
    Promise.all([api.getProductList(), api.getUserInfo()])
      .then(([productsData, userData]) => {
        setCurretnUser(userData)
        setCards(productsData.products)
      })
      .catch(err => console.log(err))
  },[])

  useEffect(() => {
    handleRequest()
  },[debounceSearchQuerry])

  function handleLikeProduct(product) {
    const isLiked = product.likes.some(id => id === curretnUser._id)
    api.changeLikeProduct(product._id, isLiked)
      .then((newCard) => {
        const newProducts = cards.map(item => {
          return item._id === newCard._id ? newCard : item
        })
        setCards(newProducts)
      })
  }
  
  return (
    <>
      <Header user={curretnUser} onUpdateUser={handleUpdateUser}>
        <>
          <Logo className="logo header__logo"/>
          <Search onSubmit={handleFormSubmit} onInput={handleInputChange}/>
        </>
          
      </Header>
      <main className='content container'>
        <SearchInfo searchText={searchQuerry} searchCount={cards.length}/>
       <Sort/>
        <div className='content__cards'>
         <CardList goods={cards} onProductLike={handleLikeProduct} curretnUser={curretnUser}/>
        </div>
      </main>
      <Footer/>
    </>
  )
}

export default App;

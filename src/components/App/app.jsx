import CardList from '../CardList/card-list';
import Footer from '../Footer/footer';
import Header from '../Header/header';
import Sort from '../Sort/sort';
import './index.css';
import data from '../../assets/data.json'
import { useEffect, useState } from 'react';
import Logo from '../Logo/logo';
import Search from '../Search/search';
import SearchInfo from '../SeachInfo/SeachInfo';

function App() {
  const [cards, setCards] = useState(data)
  const [searchQuerry, setsearchQuerry] = useState('')

  const handleRequest = () => {
    const filterCards = data.filter(item => item.name.toLowerCase().includes(searchQuerry.toLowerCase()))
    setCards(filterCards)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    handleRequest()
  }

  const handleInputChange = (value) => {
    setsearchQuerry(value)
  }

  useEffect(() => {
    handleRequest()
  },[searchQuerry])
  return (
    <>
      <Header>
        <>
          <Logo className="logo header__logo"/>
          <Search onSubmit={handleFormSubmit} onInput={handleInputChange}/>
        </>
          
      </Header>
      <main className='content container'>
        <SearchInfo searchText={searchQuerry} searchCount={cards.length}/>
       <Sort/>
        <div className='content__cards'>
         <CardList goods={cards}/>
        </div>
      </main>
      <Footer/>
    </>
  )
}

export default App;

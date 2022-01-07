import React, {useState, useEffect} from 'react';
import BooksContainer from './components/BooksContainer';
import Header from './components/Header';
import {GlobalStyle} from './styles';
import DetailPanel from './components/DetailPanel';
import {Transition} from 'react-transition-group';
import Search from './components/Search';

const App = () => {
  const [books, setBooks] = useState([]); //fetching data from API and  storing it into the state variable
  const [selectedBook, setSelectedBook] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);

  console.log('this message is going to load every time the compoenent renders');
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://book-club-json.herokuapp.com/books'); //async is used here because it takes a bit to fetch all the data

      const books = await response.json();
      console.log('our json-ified response:', books);
      setBooks(books);
      setFilteredBooks(books)
    };

    fetchData();
  }, []); // empty dependency array
  console.log('the books array in our state:', books);

  //helper function when a user clicks on a book
  const pickBook = (book) => {
    setSelectedBook(book);
    setShowPanel(true);
  };

  const closePanel = () => {
    setShowPanel(false);
  };

  const filterBooks = (searchTerm) => {
    const stringSearch = (bookAttribute, searchTerm) =>
      bookAttribute.toLowerCase().includes(searchTerm.toLowerCase());
    if (!searchTerm) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(
        books.filter(
          (book) => stringSearch(book.title, searchTerm) || stringSearch(book.author, searchTerm)
        )
      );
    }
  };

  const hasFiltered=filteredBooks.length !== BooksContainer.length;
  return (
    <>
      <GlobalStyle />
      <Header>
        <Search filterBooks={filterBooks}/>
      </Header>
      <BooksContainer books={filteredBooks} pickBook={pickBook} isPanelOpen={showPanel} title = {hasFiltered ? 'Search results': 'All books'} />;
      <Transition in={showPanel} timeout={300}>
        {(state) => <DetailPanel book={selectedBook} closePanel={closePanel} state={state} />}
        {/*when book is selected the detail panel will render*/}
      </Transition>
    </>
  );
};

export default App;

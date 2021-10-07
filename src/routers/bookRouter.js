const express = require('express');

const bookController = require('../controllers/bookController');

function routes(Book){
  const bookRouter = express.Router();
  const controller = bookController(Book);
  bookRouter.route('/books')
    .post(controller.post)
    .get(controller.get);

  bookRouter.use('/books/:bookId', (req, res, next)=>{
    Book.findById(req.params.bookId, (error, book) => {
      if (error) {
        return res.send(error);
      }
      if( book ){
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  bookRouter.route('/books/:bookId')
    .get((req, res) => {
      const returnBook = req.book.toJSON();
      returnBook.links = {};
      const genre = req.book.genre.replace(' ', '%20');
      returnBook.links.FilterByThisGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
      res.json(returnBook);
    })
    .put((req, res) => {
        const { book } = req;
        book.title = req.body.title;
        book.author = req.body.author;
        book.genre = req.body.genre;
        book.read = req.body.read;
        book.save();
        return res.json(book);
    })
    .patch((req, res)=>{
      const { book } = req;
      if( req.body._id ){
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item, index)=>{
        const key = item[0];
        const value = item[1];
        book[key] = value;
      })
      req.book.save((err)=>{
        if( err ){
          return res.send(err);
        }
        return res.json(book);
      })
    })
    .delete((req, res)=>{
      req.book.delete((err)=>{
        if( err ){
          return res.send(err);
        }
        return res.sendStatus(204);
      })
    });
  return bookRouter;
}
module.exports = routes;

const { response } = require("@hapi/hapi/lib/validation");
const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const { 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading 
    } = request.payload;

    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading, 
        id, 
        finished,
        insertedAt,
        updatedAt
    };

    books.push(newBook);
    
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    const isBookHasOwnPropertyName = request.payload.hasOwnProperty('name');
    const isReadPageMoreThanPage = readPage>pageCount;

    if(isReadPageMoreThanPage){
        const response = h.response({
            status : "fail",
            message : "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }
    
    if(isBookHasOwnPropertyName==false){
        const response = h.response({
            status : "fail",
            message : "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }
    else{
        if(isSuccess){
            const response = h.response({
                status : 'success',
                message : 'Buku berhasil ditambahkan',
                data : {
                    bookId : id
                }
            });
            response.code(201);
            return response;
        }
    }
    
    const response = h.response({
        status : "fail",
        message : "Buku gagal ditambahkan"
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = () => ({
    status : 'success',
    data : {
        books,
    }
});

const getBookByIdHandler = (request, h) => {
    const {id} = request.params;
    

    const book = books.filter((b) => b.id === id)[0];
    
    if (book !== undefined){
        return {
            status : 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status :'fail',
        message : 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;

};

module.exports = { addBookHandler, 
    getAllBooksHandler, 
    getBookByIdHandler
};
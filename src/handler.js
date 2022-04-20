const { response } = require("@hapi/hapi/lib/validation");
const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {

    const isBookHasOwnPropertyName = request.payload.hasOwnProperty('name');

    if (isBookHasOwnPropertyName) {
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

        const isReadPageMoreThanPage = readPage > pageCount;

        if (!isReadPageMoreThanPage) {
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

            if (isSuccess) {
                const response = h.response({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: id
                    }
                });
                response.code(201);
                return response;
            }
        }
        else {
            const response = h.response({
                status: "fail",
                message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
            });
            response.code(400);
            return response;
        }
    }
    else {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;

    }
    const response = h.response({
        status: "fail",
        message: "Buku gagal ditambahkan"
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    
    if (name !== undefined) {
        const regex = new RegExp(name, 'i');
        const response = h.response({
            status: 'success',
            data: {
                books: books.filter((book) => regex.test(book.name)).
                map((book) => ({
                    id: book.id,
                    name : book.name,
                    publisher : book.publisher
                }))
            }
        });
        response.code(200);
        return response;
    }
    if (reading !== undefined) {
        if (reading == 1) {
            const response = h.response({
                status: 'success',
                data: {
                    books: books.filter((book) => book.reading === true).
                    map((book) => ({
                        id: book.id,
                        name : book.name,
                        publisher : book.publisher
                    }))
                }
            });
            response.code(200);
            return response;
        }
        else if (reading == 0) {
            const response = h.response({
                status: 'success',
                data: {
                    books: books.filter((book) => book.reading === false).
                    map((book) => ({
                        id: book.id,
                        name : book.name,
                        publisher : book.publisher
                    }))
                }
            });
            response.code(200);
            return response;
        }
    }
    if(finished !== undefined){
        if (finished == 1) {
            const response = h.response({
                status: 'success',
                data: {
                    books: books.filter((book) => book.readPage === book.pageCount).
                    map((book) => ({
                        id: book.id,
                        name : book.name,
                        publisher : book.publisher
                    }))
                }
            });
            response.code(200);
            return response;
        }
        else if (finished == 0) {
            const response = h.response({
                status: 'success',
                data: {
                    books: books.filter((book) => book.readPage < book.pageCount).
                    map((book) => ({
                        id: book.id,
                        name : book.name,
                        publisher : book.publisher
                    }))
                }
            });
            response.code(200);
            return response;
        }
    }
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;

};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

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

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);
    const isBookHasOwnPropertyName = request.payload.hasOwnProperty('name');
    const isReadPageMoreThanPage = readPage > pageCount;

    if (isReadPageMoreThanPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    if (isBookHasOwnPropertyName === false) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    else {
        if (index !== -1) {
            books[index] = {
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                updatedAt
            };

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            });
            response.code(200);
            return response;
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

// const getBookBasedOnQueryParam = (request, h) => {
//     const { name } = request.query;
//     console.log(name);

//     const response = h.response({
//         status : 'success',
//         data : {
//             books : books.filter(book => book.name === name)
//         }
//     })

// };

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
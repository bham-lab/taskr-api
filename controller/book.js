import { error } from "node:console"



let book =[]

export const getBook = async (req, res) => {
    try {

      const books = book.find()
        

  if(books.length === 0) {
    return res.status(404).json({message: "There is no book"})
  }

        const { title, author} = req.query
        if(title || author) {
        const filtered =  books.filter(b => (title && b.title.toLowerCase().includes(title.toLowerCase().trim())) ||
        (b.author.toLowerCase().includes(author.toLowerCase().trim())) )

          if(filtered.length === 0) {
    return res.status(404).json({message: "There is no matching book"})
  }
         return res.status(200).json(filtered)
        
        }
        
       return res.status(200).json(books)
       



    } catch(err) {

      return res.status(500).json({message:"internal server error" , error: err.message})

    }
    
}



export const createBook = async (req, res) => {

  const {title, author, year} = req.body


try {  
  if (!title || !author) {
    return res.status(400).json({error: "Title and Author are required"})
  }

const newBook = {
    id: Date.now(),
    title: title,
    author: author,
    year: year,
    read: false,
    rating: null,
  createdAt: new Date().toISOString()

  }
 book.push(newBook)

 return res.status(201).json({message: "Book created successfully" ,book :  newBook})
}catch(err) {

      return res.status(500).json({message:"internal server error" , error: err.message})

    }



}

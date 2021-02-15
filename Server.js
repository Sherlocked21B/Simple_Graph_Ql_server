const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const {
GraphQLSchema,
GraphQLObjectType,
GraphQLString,
GraphQLList,
GraphQLInt,
GraphQLNonNull
} = require("graphql");

const authors =[
    {id:1 , name:"J.K Rolwing"},
    {id:2, name:"J.R.R Tokein"},
    {id:3 , name:"Brent Weeks"}
]

const books = [
    {id:1 , name:"Harry Potter and chamber of Secrets",authorId:1},
    {id:2 , name:"Harry Potter and the Prisoner of Azkaban",authorId:1},
    {id:3, name:"Harry Potter and the goblet of fire ",authorId:1},
    {id:4 , name:"The Fellowship of the ring",authorId:2},
    {id:5, name:"The Two Towers",authorId:2},
    {id:6 , name:"The Return of the king ",authorId:2},
    {id:7 , name:"The way of shadows ",authorId:3},
    {id:8 , name:"Beyond the shadows",authorId:3},
]

const BookType = new GraphQLObjectType({
    name:"Book",
    description:"This represt the book written by the user",
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        authorId:{type:GraphQLNonNull(GraphQLInt)},
        author:{
            type : AuthorType,
            resolve:(book)=>{
                return authors.find(author=> book.authorId === author.id )
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name:"Author",
    description:"This reprents the name of author",
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        books:{
            type:GraphQLList(BookType),
            resolve:(author)=>{
                return books.filter(book=> book.authorId === author.id )
            }
        }
    })
})



const rootQuerytype = new GraphQLObjectType({
    name:"Query",
    description:"Root Query",
    fields:()=>({
        book:{
            type : BookType,
            description: "A single book information",
            args : {
                id : { type : GraphQLInt }
            },
            resolve : (parent,args)=>{
                return books.find(book=> book.id === args.id)
            }
        },
        author:{
            type: AuthorType,
            description: "Info of single author",
            args:{
                id:{type: GraphQLInt}
            },
            resolve:(parent,args)=>{
                return authors.find (author=> args.id === author.id )
            }
        },
        Books:{
        type:GraphQLList(BookType),
        description:"List of all books",
        resolve:()=>books
    },
        Authors:{
            type : GraphQLList(AuthorType),
            description:"list of all the aurthors",
            resolve:()=> authors
        }
    })
})

const rootMutationType = new GraphQLObjectType({
    name:"mutation",
    description: "Adding the books and author to the data base",
    fields:{
        addBook:{
            type:BookType,
            description:"A new Book",
            args:{
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId:{type: GraphQLNonNull(GraphQLInt)},
            },
            resolve:(parent,args)=>{
                const book = {id : books.length+1 , name: args.name, authorId: args.authorId};
                books.push(book);
                return book;
            }
        },
        addAurthor:{
            type:AuthorType,
            description:"A new Aurthor",
            args:{
                name: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve:(parent,args)=>{
                const author = {id : authors.length+1 , name: args.name};
                authors.push(author);
                return author;
            }
        },
        deleteBook:{
            type:BookType,
            description:"Deleting the book",
            args:{
                id: GraphQLInt
            },
            resolve:(parent,args)=>{
            books.pop(id:args.id)
            }
        }

    }
})

const schema = new GraphQLSchema({
    query: rootQuerytype,
    mutation: rootMutationType
})

const app = express();

app.use("/graphql",graphqlHTTP({
    schema:schema,
    graphiql:true
}))

app.listen(5000,()=>{console.log("Server has started")} ); 

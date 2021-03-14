const grpc = require("grpc")

// Lib that can compile proto to js file
const protoLoader = require("@grpc/proto-loader")
// Compile proto to js file
const packageDef = protoLoader.loadSync("todo.proto")

// Create grpc object from the compiled proto file
const grpcObject = grpc.loadPackageDefinition(packageDef)
const todoPackage = grpcObject.todoPackage;

// Get input from the third argument
// e.g node client.js sleep --> sleep should be the input
const text = process.argv[2];

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure())

client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {
    if (!err) {
        console.log("You added: " + response.text)
    } else {
        console.log(err)
    }
})

client.readTodos({}, (err, response) => {
    if (!err) {
        if(response.items) {
            console.log("todo items:")
            response.items.forEach(i => console.log(i.text))
            console.log("----")
        }
            
    } else {
        console.log(err)
    }
})

const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server " + JSON.stringify(item))
})
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// Gets the definition of package from the given protobuf file
const packageDef = protoLoader.loadSync('todo.proto', {});

// Load the protobuf definition on a grpc model frm it's definition
const grpcObject = grpc.loadPackageDefinition(packageDef);

// Gets the todo package (defined in protobuf file)
const { todoPackage } = grpcObject;

// Where todos will be stored
const todos = [];

// Creates server
const server = new grpc.Server();
server.bind(
    '0.0.0.0:8080', // address:port (binds to anything without the need to define a protocol)
    grpc.ServerCredentials.createInsecure() // Creating insecure conection
);

// Adds services
server.addService(todoPackage.Todo.service, {
    'createTodo': createTodo,
    'readTodos': readTodos
});

// Functions to be listened by grpc services
// Tooks two params always: 
//      - call     // similar to a Request object
//      - callback // Will execute with a response from the grpc service
function createTodo({ request }, callback) {
    const todoItem = {
        id: todos.length + 1,
        text: request.text
    };
    todos.push(todoItem);

    // Response (length of response - null autofills that, response)
    callback(null, todoItem);
}

function readTodos(call, callback) {

}

// Start service
server.start();
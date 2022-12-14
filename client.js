const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// Gets the definition of package from the given protobuf file
const packageDef = protoLoader.loadSync('todo.proto', {});

// Load the protobuf definition on a grpc model frm it's definition
const grpcObject = grpc.loadPackageDefinition(packageDef);

// Gets the todo package (defined in protobuf file)
const { todoPackage } = grpcObject;

// Create a client of Todo Service
const client = new todoPackage.Todo(
    '0.0.0.0:8080', // address:port where the service is to connect
    grpc.credentials.createInsecure() // Create client insecure credentials
);

// ########################################
// Create a todo
// ########################################

const payload = {
    id: -1,
    text: `This is a todo! ${Date.now()}`
};

client.createTodo(payload, (err, response) => {
    console.log(
        '\x1b[36m', // Change color to cyan
        'Received from server (createTodo): ', 
        JSON.stringify(response)
    );
});

client.readTodos({}, (err, response) => {
    console.log(
        '\x1b[33m', // Change color to yellow
        'Received from server (readTodos): ', 
        JSON.stringify(response)
    );
});

const call = client.readTodosStream();
call.on('data', todoItem => {
    console.log(
        '\x1b[32m', // Change color to green
        'Received from server (readTodosStream): ', 
        JSON.stringify(todoItem),
    );
});
call.on('end', e => console.log(
    '\x1b[32m', // Change color to green
    'Received from server (readTodosStream): Stream DONE'
));
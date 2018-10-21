'use strict';

const Hapi = require('hapi');
const Blockchain = require('./simpleChain.js');
const Block = require('./simpleBlock.js');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route([{
    method: 'GET',
    path: '/hello',
    handler: function (request, h) {
        return 'hello world';
    }
},
{
    method: 'GET',
    path: '/block/{height}',
    handler: async function (request, h) {
        let blockchain = new Blockchain();
        let block = await blockchain.getBlock(request.params.height);
        return block;
    }
},
{
    method: 'POST',
    path: '/block',
    handler: async (request, h) => {
        try {
            var payload = request.payload.blockText   
            if (typeof payload != 'undefined' && payload) {
                let chain = await new Blockchain();
                let newblock = await chain.addBlock(new Block(payload));
                return newblock;
            } else {
                return "Please enter a valid value"
            }
        } catch (err) {
            console.log(err);
        }
    }
}
]);

// Start the server
async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();
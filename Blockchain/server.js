'use strict';

const Hapi = require('hapi');
const Blockchain = require('./simpleChain.js');
const Block = require('./simpleBlock.js');
const Boom = require('boom');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

function criarBlockchain() {
    return new Promise((resolve, reject) => {

        let Blockchain = new Blockchain();
        console.log("Entrou");
        resolve(Blockchain);
    });
}



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
        try {
            let blockchain = new Blockchain();
            let block = await blockchain.getBlock(request.params.height);
            return block;
        } catch (err) {
            return Boom.badRequest(err.toString());
        }
    }
},
{
    method: 'POST',
    path: '/block',
    handler: async (request, h) => {
        try {
            var payload = request.payload.body
            if (typeof payload != 'undefined' && typeof payload === 'string') {
                let chain = new Blockchain();
                let init = await chain.init();
                let blockheight = await chain.getBlockHeight();
                console.log(blockheight);
                let newblock = await chain.addBlock(new Block(payload));
                return newblock;
            } else {
                throw "Please enter a valid value"
            }
        } catch (err) {
            return Boom.badRequest(err.toString());
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
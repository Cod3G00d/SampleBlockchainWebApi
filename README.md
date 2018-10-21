# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use npm to install all project dependencies.
```
npm Install
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install hapi 
```
npm install hapi --save
```

## Testing

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session
4: Instantiate blockchain with blockchain variable
```
let blockchain = new Blockchain();
```
5: Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Induce errors by changing block data
```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```
8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```

## Rest API Blockchain
This is an example of how to insert and verify data in blockchain.

### Run the server

- By default the server runs at localhost: 8000.

- Use npm to start application .
```
npm start
```

### Get a specific Block

#### URL
```
/block/:number
```

#### Method:
```
GET
```

#### URL Params

##### Required:
```
block=[integer]
```

#### Success Response:
```
Code: 200 
Content: 
{
    "hash": "95229f182223b7c831c5ffa37e0c8cbf85daaee979ca0ae4a5ac7f69a9dfd49b",
    "height": 0,
    "body": "First block in the chain - Genesis block",
    "time": "1539547320",
    "previousBlockHash": ""
}
```

#### Error Response:
```
Code: 404 NOT FOUND 
Content: { error : message error }
```

#### Sample Call:
```
  $.ajax({
    url: "/block/0",
    dataType: "json",
    type : "GET",
    success : function(r) {
      console.log(r);
    }
  });
```

### Insert data in Blockchain

#### URL
```
/block
```

#### Method:
```
POST
```

#### Data Params
```
 blockText = [string]
 ```

#### Success Response:
```
Code: 200 
Content: 
{
    "hash": "b02d00e59957623801966b8166ff69eae72d9688437c83a8223f7d168e5ee4c6",
    "height": 23,
    "body": "Just a example text",
    "time": "1540086270",
    "previousBlockHash": "fb33ad8847f9315f8aad0fe098afb7941f7b3afd15e0f8a1f736300be0f36acb"
}
```

#### Sample Call:
```
  $.ajax({
    url: "/block",
    method : "POST",
    dataType: "json",
    contentType: 'application/json',
    data:{
        "blockTest":"Just a example"
     },
    success : function(r) {
      console.log(r);
    }
  });
```





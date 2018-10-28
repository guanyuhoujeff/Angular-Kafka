var Kafka = require('no-kafka');


var express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)

var bodyParser = require('body-parser');
// app.get('/',function(req,res){
//   ...
// })

// socket
// var io = require('socket.io')(http);
// io.on('connection', (socket) => {
//   console.log('USER CONNECTED');

//   socket.on('disconnect', function () {
//     console.log('USER DISCONNECTED');
//   });

// });

// new
// var socket = require('socket.io')
// var io = socket.listen(server);
// io.sockets.on('connection', function () {
//   console.log('hello world im a hot socket');

//   socket.on('disconnect', function () {
//     console.log('USER DISCONNECTED');
//   });

// });


// new 10/25
let io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('USER CONNECTED');

  socket.on('disconnect', function () {
    console.log('USER DISCONNECTED');
  });

});

server.listen(8888, "192.168.43.12", () => {
  console.log('started on port 8888');

  // var consumer = new Kafka.SimpleConsumer({
  //       connectionString: 'MWKS363613:9092',
  //       clientId: 'no-kafka-client'
  //   }); 

  var consumer = new Kafka.SimpleConsumer({
    connectionString: 'kafka://192.168.43.12:9092',
  });

  // data handler function can return a Promise 
  var dataHandler = function (messageSet, topic, partition) {
    messageSet.forEach(function (m) {
      console.log(topic, partition, m.offset, m.message.value.toString('utf8'));

      if (topic == "kafka-test-topic") {
        io.emit('message', {
           x: (new Date()).getTime(),
           y: m.message.value.toString('utf8') 
        });
      }

    });
  };

  return consumer.init().then(function () {
    // Subscribe partitons 0 and 1 in a topic: 
    // var val = consumer.subscribe('kafka-test-topic', { time: Kafka.EARLIEST_OFFSET }, dataHandler);
    var v1 = consumer.subscribe('kafka-test-topic', dataHandler);
    var arr = [];
    arr.push([v1]);
    console.log("val:" + arr);
    return arr;

  });
});


// var server = http.createServer(app).listen(app.get('port'), function(){
//   console.log("Express server listening on port " + app.get('port'));
// });


app.use(bodyParser());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});



var producer = new Kafka.Producer({
  connectionString: 'kafka://192.168.43.12:9092',
});

app.post("/api/producer", function (req, res) {
  // console.log(' !! **********  post("/api/producer" req', req);
  let theMessage = req.body.value
  // console.log(' ! **********  !!!  post theMessage', theMessage);

  // Kafka
  return producer.init().then(function () {
    return producer.send({
      topic: 'kafka-test-topic',
      partition: 0,
      message: {
        key: 12,
        value: theMessage
      }
    });
  })
    .then(function (result) {
      // console.log("result :", result)
      /*
      [ { topic: 'kafka-test-topic', partition: 0, offset: 353 } ]
      */
    });

})
























var consumer = new Kafka.SimpleConsumer({
  connectionString: 'kafka://192.168.43.12:9092',
});


// data handler function can return a Promise 
var dataHandler = function (messageSet, topic, partition) {
  messageSet.forEach(function (m) {
    console.log(topic, partition, m.offset, m.message.value.toString('utf8'));

    if (topic == "kafka-test-topic") {
      io.emit('message', { x: (new Date()).getTime(), y: m.message.value.toString('utf8') });
    }
    else {
      io.emit('sampleMessage', { x: (new Date()).getTime(), y: m.message.value.toString('utf8') });
    }
  });
};



app.get("/api/consumer", function (req, res) {
  console.log("Start Get Fund Data");
  return consumer.init().then(function () {
    // Subscribe partitons 0 and 1 in a topic:
    var val = consumer.subscribe('kafka-test-topic', { time: Kafka.EARLIEST_OFFSET }, dataHandler);
    var arr = [];
    arr.push(val);
    console.log("val:" + arr);
    return arr;

  });
})




// app.listen(8888, '192.168.43.12', function () {
//   console.log('Example app listening on port 8888  !')

//   var consumer = new Kafka.SimpleConsumer({
//     connectionString: 'kafka://192.168.43.12:9092',
//   });


//   // data handler function can return a Promise 
//   var dataHandler = function (messageSet, topic, partition) {
//     messageSet.forEach(function (m) {
//       console.log(topic, partition, m.offset, m.message.value.toString('utf8'));

//       if (topic == "kafka-test-topic") {
//         io.emit('message', { x: (new Date()).getTime(), y: m.message.value.toString('utf8') });
//       }
//       else {
//         io.emit('sampleMessage', { x: (new Date()).getTime(), y: m.message.value.toString('utf8') });
//       }
//     });
//   };




//   console.log("Start Get Fund Data");
//   return consumer.init().then(function () {
//     // Subscribe partitons 0 and 1 in a topic:
//     var val = consumer.subscribe('kafka-test-topic', { time: Kafka.EARLIEST_OFFSET }, dataHandler);
//     var arr = [];
//     arr.push(val);
//     console.log("val:" + arr);
//     return arr;

//   });
// })
const http = require('http')
const socketIO = require('socket.io')

function onlyForHandshake(middleware) {
    return (req, res, next) => {
      const isHandshake = req._query.sid === undefined;
      if (isHandshake) {
        middleware(req, res, next);
      } else {
        next();
      }
    };
  }

exports.initServer = function(app, session, passport) {

    const server = http.Server(app)
    const io = socketIO(server)

    io.engine.use(onlyForHandshake(session));
    io.engine.use(onlyForHandshake(passport.session()));
    io.engine.use(
      onlyForHandshake((req, res, next) => {
        if (req.user) {
          next();
        } else {
          res.writeHead(401);
          res.end();
        }
      }),
    );

    // Определим входящее соединение
    io.on('connection', (socket) => {
        const {id} = socket
        console.log(`connection ${id}`)

        const user = socket.request.user;
        console.log('io.on(connection - socket.request.user')
        console.log(user)
        socket.join(`user:${user.id}`);

        // реализуем несколько кастомных событий
        // 1. отправим сообщение самому себе
        socket.on('message-to-me', (msg) => {

            console.log('socket.on(message-to-me - socket.request.user')
            console.log(socket.request.user)

            const msg_server = {
                username: socket.request.user.username,
                text: msg.text,
                type: 'me'  
            }                  
            socket.emit('message-to-me', msg_server)
        })

        // 2. отправим сообщение всем
        socket.on('message-to-all', (msg) => {

            console.log('socket.on(message-to-all - socket.request.user')
            console.log(socket.request.user)

            const msg_server = {
              username: socket.request.user.username,
              text: msg.text,
              type: 'all'  
            }    
               
            socket.broadcast.emit('message-to-all', msg_server)
            // отдельно отправим сообщение себе,
            // т.к. метод broadcast не отправляет сообщение отправителю
            socket.emit('message-to-all', msg_server)
        })     

        socket.on('disconnect', (socket) => {
            console.log(`disconnect ${id}`)
        })
    })

    return { server, io }
}
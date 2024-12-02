const http = require('http')
const socketIO = require('socket.io')
const Comments = require('./models/comments')

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
        // console.log(`connection ${id}`)

        const user = socket.request.user;
        // console.log('io.on(connection - socket.request.user')
        // console.log(user)
        socket.join(`user:${user.id}`);

        // Отправим сообщение всем обсуждающим книгу
        // console.log(`socket.handshake.query`)
        // console.log(socket.handshake.query)
        const {advertId} = socket.handshake.query
        // console.log(`Socket advertId: ${advertId}`)
        socket.join(advertId)
        socket.on('message-to-advert-discussants', async (msg) => {

            // console.log('socket.on(message-to-advert-discussants - socket.request.user')
            // console.log(socket.request.user) 
            // console.log('socket.on(message-to-advert-discussants - advertId')
            // console.log(advertId)                        
 
            let date = new Date()
            const newComment = new Comments({
              advertId: advertId,
              userId  : socket.request.user.id,
              date    : date,
              text    : msg.text
            })  
            // console.log(`newComment = ${newComment}`)

            try {
                await newComment.save()
                const msg_server = {
                  name: socket.request.user.name,
                  date: date.toLocaleString('ru'),
                  text: msg.text,
                }  
                // console.log(`msg_server`)
                // console.log(msg_server)
                socket.broadcast.emit('message-to-advert-discussants', msg_server)
                // отдельно отправим сообщение себе,
                // т.к. метод broadcast не отправляет сообщение отправителю
                socket.emit('message-to-advert-discussants', msg_server)                
            } catch (e) {
              console.log(`Не удалось сохранить сообщение в БД ${msg.text}`)
              console.log(e)
            }
        })     

        socket.on('disconnect', (socket) => {
            console.log(`disconnect ${id}`)
        })
    })

    return { server, io }
}
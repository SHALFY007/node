import http from "http";
import fs from "fs";
import path from "path";
import { Server } from "socket.io"

const host = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {

    const filePath = path.join(process.cwd(), "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});
const io = new Server(server)

io.on('connection', (client) => {
  console.log(`Websocket connected ${client.id}`)
  const count = io.engine.clientsCount;
  const count2 = io.of("/").sockets.size;
  
  client.broadcast.emit('connect-user', { id: count })
  client.emit('connect-user', {  id: count  })

  client.on('client-msg', (data) => {
    client.broadcast.emit('server-msg', { msg: `${data.msg} was send by User-${count}` })
    client.emit('server-msg', { msg: `${data.msg} was send by User-${count}` })
  })
  client.conn.on("close", (reason) => {
    client.broadcast.emit('disconnect-user', { id: count, reason: reason })
    client.emit('disconnect-user', { id: count, reason: reason  })
  });

  console.log(count2)
})



server.listen(port, host, () =>
  console.log(`Server running at http://${host}:${port}`)
);

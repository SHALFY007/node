import http from "http";
import fs from "fs";
import path from "path";
import { Transform } from "stream";
import {Server} from "socket.io"
import { Worker } from 'worker_threads';

const host = "localhost";
const port = 3000;

const list = [];
const fsp = fs.promises;

const links = (arr, curUrl) => {
  if (curUrl.endsWith("/")) curUrl = curUrl.substring(0, curUrl.length - 1);
  let li = "";
  for (const item of arr) {
    li += `<li><a href="${curUrl}/${item}">${item}</a></li>`;
  }
  return li;
};

function search(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData });
    worker.on('result-search', resolve);
    worker.on('error', reject);
    })
}

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    const url = req.url.split("?")[0];
    const curPath = path.join(process.cwd(), url);

    fs.stat(curPath, (err, stats) => {
      if (!err) {
        if (stats.isFile(curPath)) {
          const rs = fs.createReadStream(curPath, "utf-8");
          rs.pipe(res);
        } else {
          fsp
            .readdir(curPath)
            .then((files) => {
              if (url !== "/") files.unshift("..");
              return files;
            })
            .then((data) => {
              const filePath = path.join(process.cwd(), "./index.html");
              const rs = fs.createReadStream(filePath);
              const ts = new Transform({
                transform(chunk, encoding, callback) {
                  const li = links(data, url);
                  this.push(chunk.toString().replace("#filelinks#", li));

                  callback();
                },
              });

              rs.pipe(ts).pipe(res);
            });
        }
      } else {
        res.end("Path not exists");
      }
    });
  }
});

const io = new Server(server)
io.on('connection', (client) => {
  console.log(client.id)

  const count = io.engine.clientsCount;
  const count2 = io.of("/").sockets.size;

  client.broadcast.emit('all-users', { count: count2 })
  client.emit('all-users', { count: count2  })

  client.conn.on("close", (reason) => {
    client.broadcast.emit('all-users', { count: count2-1 })
    console.log(count2)
    console.log(count)
    client.emit('all-users', { count: count2-1  })
  });

})

server.listen(port, host, () =>
  console.log(`Server running at http://${host}:${port}`)
);

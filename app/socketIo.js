function getName(connections, socket) {
  let name;
  for (const key in connections) {
    if (socket === connections[key]) {
      name = key;
      break;
    }
  }
  return name;
}

export default function (io) {
  const connections = {};

  io.on("connection", (socket) => {
    socket.on("msg", (message) => {
      const name = getName(connections, socket);
      const msg = {
        name,
        msg: message.msg,
      };

      socket.emit("msg", msg);
      socket.broadcast.emit("msg", msg);
    });

    socket.on("join", function (message) {
      const name = getName(connections, socket);
      connections[message.name] = socket;
      const msg = {
        names: Object.keys(connections),
      };

      socket.emit("join", msg);
      socket.broadcast.emit("join", msg);
    });

    socket.on("disconnect", () => {
      const disconnectedUser = getName(connections, socket);
      if (disconnectedUser) {
        const msg = JSON.stringify({
          type: "join",
          names: Object.keys(connections),
        });
        socket.broadcast.emit("join", msg);
        delete connections[disconnectedUser];
      }
    });
  });

  return function logout(user) {
    if (connections[user]) {
      const msg = JSON.stringify({
        type: "join",
        names: Object.keys(connections),
      });
      connections[user].broadcast.emit("join", msg);
      connections[user].disconnect();
      delete connections[user];
    }
  };
}



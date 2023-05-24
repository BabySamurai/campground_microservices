const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const userProtoPath = 'user.proto';
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;

const users = [
  {
    id: '1',
    username: 'Spystra',
    email: 'khedhermanef1@gmail.com',
  },
  {
    id: '2',
    username: 'Tyty',
    email: 'tylerfulton@hotmail.com',
  },

];

let global_id = users.length;

const userService = {

  getUser: (call, callback) => {
    const get_id = users.indexOf(users.find(element => element.id == call.request.user_id));

    if (get_id < 0) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'NOT FOUND',
      });
    }

    const user = {
      
      id: call.request.user_id,
      username: users[get_id].username,
      email: users[get_id].email,
  
    };
    callback(null, {user});
  },

  searchUsers: (call, callback) => {

    callback(null, { users });
  },

  createUser: (call, callback) => {
    const user = {
      id: ++global_id,
      username: call.request.username,
      email: call.request.email,

    };
    users.push(user);
    callback(null, {user});
  },

  updateUser: (call, callback) => {

    const user = {
      id: call.request.user_id,
      username: call.request.username,
      email: call.request.email
  
    };
    const update_id = users.indexOf(users.find(element => element.id == user.id));
    users[update_id] = user;
    callback(null, {user});
  },

  deleteUser: (call, callback) => {
    const user = {
      id: call.request.user_id,

    };
    const delete_id = users.indexOf(users.find(element => element.id == user.id));
    users.splice(delete_id, 1);
    callback(null, {user});
  }

};






const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`User microservice running on port ${port}`);




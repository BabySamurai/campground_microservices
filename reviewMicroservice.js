const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const reviewProtoPath = 'review.proto';
const userProtoPath = 'user.proto';

const reviewProtoDefinition = protoLoader.loadSync(reviewProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const reviewProto = grpc.loadPackageDefinition(reviewProtoDefinition).review;
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;

const clientUsers = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());

const reviews = [
  {
    id: '1',
    title : 'XYZ CG Review',
    body : 'Good camp',
    rating : 4,
    user :  {
      id: '1',
      username: 'Spystra',
      email: 'khedhermanef1@gmail.com',
    }
  },
  {
    id: '2',
    title : 'VV CG Review',
    body : 'Bad experience',
    rating : 1,
    user :  {
      id: '1',
      username: 'Spystra',
      email: 'khedhermanef1@gmail.com',
    }
  },

];

let global_id = reviews.length;

const reviewService = {
  getReview: (call, callback) => {
    const get_id = reviews.indexOf(reviews.find(element => element.id == call.request.review_id));

    if (get_id < 0) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'NOT FOUND',
      });
    }
    const review = {
      
      id: call.request.review_id,
      title: reviews[get_id].title,
      body: reviews[get_id].body,
      rating: reviews[get_id].rating,
      user: reviews[get_id].user,
  
    };
    callback(null, {review});
  },
  searchReviews: (call, callback) => {

    callback(null, { reviews });
  },
  
  createReview: (call, callback) => {
    const review = {
      id: ++global_id,
      title: call.request.title,
      body: call.request.body,
      rating: call.request.rating,
      user: '',
    };

    clientUsers.getUser(
      
      { user_id: call.request.user_id },
      (err, response) => {
        if (!err) {
          review.user = response.user;
          reviews.push(review);
          callback(null, { review });
        } else if (err.code == 5) {
          global_id--;
          callback({
            code: grpc.status.OUT_OF_RANGE,
            message: 'User not found',
          });
        } else {
          callback(null, { review });
        }
      }
    ); 
  },

  updateReview: (call, callback) => {

    const review = {
      id: call.request.review_id,
      title: call.request.title,
      body: call.request.body,
      rating: call.request.rating,
    };

    const update_id = reviews.indexOf(reviews.find(element => element.id == review.id));
    review.user = reviews[update_id].user;
    reviews[update_id] = review;
    callback(null, {review});
  },

  deleteReview: (call, callback) => {
    const review = {
      id: call.request.review_id,

    };
    const delete_id = reviews.indexOf(reviews.find(element => element.id == review.id));
    reviews.splice(delete_id, 1);
    callback(null, {review});
  }

};


const server = new grpc.Server();
server.addService(reviewProto.ReviewService.service, reviewService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`Review microservice running on port ${port}`);


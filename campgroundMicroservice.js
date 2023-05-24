const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const campgroundProtoPath = 'campground.proto';
const userProtoPath = 'user.proto';
const reviewProtoPath = 'review.proto';

const campgroundProtoDefinition = protoLoader.loadSync(campgroundProtoPath, {
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

const reviewProtoDefinition = protoLoader.loadSync(reviewProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});  

const campgroundProto = grpc.loadPackageDefinition(campgroundProtoDefinition).campground;
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;
const reviewProto = grpc.loadPackageDefinition(reviewProtoDefinition).review;

const clientUsers = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());
const clientReviews = new reviewProto.ReviewService('localhost:50052', grpc.credentials.createInsecure());


const campgrounds = [
  {
    id: '1',
    title : 'XYZ Campground',
    description : 'Vivamus pellentesque volutpat massa',
    price: 200.0,
    location: 'dadad, dadasd',
    user :  {
      id: '1',
      username: 'Spystra',
      email: 'khedhermanef1@gmail.com',
    },
    reviews: [
      {
        id: '1',
        title : 'XYZ Review',
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
        title : 'dazc Review',
        body : 'Bad experience',
        rating : 1,
        user :  {
          id: '1',
          username: 'Spystra',
          email: 'khedhermanef1@gmail.com',
        }
      }
    ]
  },
  {
    id: '2',
    title : 'VV Campground',
    description : 'Aenean est leo, scelerisque id lectus eget',
    price: 300.0,
    location: ', commodo rhoncus',
    user :  {
      id: '1',
      username: 'Spystra',
      email: 'khedhermanef1@gmail.com',
    },
    reviews: [
      {
        id: '2',
        title : 'dazc Review',
        body : 'Bad experience',
        rating : 1,
        user :  {
          id: '1',
          username: 'Spystra',
          email: 'khedhermanef1@gmail.com',
        }
      }
    ]
  },
];

let global_id = campgrounds.length;

const campgroundService = {
  getCampground: (call, callback) => {
    const get_id = campgrounds.indexOf(campgrounds.find(element => element.id == call.request.campground_id));

    if (get_id < 0) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'NOT FOUND',
      });
    }
    const campground = {
      
      id: call.request.campground_id,
      title: campgrounds[get_id].title,
      description: campgrounds[get_id].description,
      price: campgrounds[get_id].price,
      location: campgrounds[get_id].location,
      user: campgrounds[get_id].user,
      reviews: campgrounds[get_id].reviews,

    };
    callback(null, {campground});
  },
  searchCampgrounds: (call, callback) => {

    callback(null, { campgrounds });
  },
  
  createCampground: (call, callback) => {
    const campground = {
      id: ++global_id,
      title: call.request.title,
      description: call.request.description,
      price: call.request.price,
      location: call.request.location,
    };

    clientUsers.getUser(
      
      { user_id: call.request.user_id },
      (err, response) => {
        if (!err) {
          campground.user = response.user;
        } else if (err.code == 5) {
          global_id--;
          callback({
            code: grpc.status.OUT_OF_RANGE,
            message: 'User not found',
          });
        } else {
          callback(null, { campground });
        }
      }
    ); 

    clientReviews.searchReviews(
      {}, (err, response) => {
        if (!err) {
          //review response from the review microservice
          const reviews = response.reviews;
          console.log(reviews);
          //review ids that I sent
          const review_ids = call.request.review_ids;
          console.log(review_ids)
          const result_reviews = [];

          for(let i = 0; i < review_ids.length ;i++) {
            let get_id = reviews.indexOf(reviews.find(element => element.id == review_ids[i]));
            console.log(get_id);
            if (get_id < 0) {
              callback({
                code: grpc.status.OUT_OF_RANGE,
                message: 'Review not found',
              });
            }
            result_reviews.push(reviews[get_id]);
          }

          campground.reviews = result_reviews
          campgrounds.push(campground);
          console.log(result_reviews);
          callback(null, { campground });

        } else if (err.code == 5) {
          global_id--;
          callback({
            code: grpc.status.OUT_OF_RANGE,
            message: 'Review not found',
          });
        } else {
          callback(null, { campground });
        }
      }
    ); 

  },

  updateCampground: (call, callback) => {

    console.log(call.request);
    const campground = {
      id: call.request.campground_id,
      title: call.request.title,
      description: call.request.description,
      price: call.request.price,
      location: call.request.location,
    };

    const update_id = campgrounds.indexOf(campgrounds.find(element => element.id == campground.id));
    campground.user = campgrounds[update_id].user;
    campground.reviews = campgrounds[update_id].reviews;
    campgrounds[update_id] = campground;
    console.log(campground);
    callback(null, {campground});
  },

  deleteCampground: (call, callback) => {
    const campground = {
      id: call.request.campground_id,

    };
    const delete_id = campgrounds.indexOf(campgrounds.find(element => element.id == campground.id));
    campgrounds.splice(delete_id, 1);
    callback(null, {campground});
  }

};


const server = new grpc.Server();
server.addService(campgroundProto.CampgroundService.service, campgroundService);
const port = 50053;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`Campground microservice running on port ${port}`);


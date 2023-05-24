

const express = require('express');
const bodyParser = require('body-parser');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const userProtoPath = 'user.proto';
const reviewProtoPath = 'review.proto';
const campgroundProtoPath = 'campground.proto';



const app = express();
app.use(bodyParser.json());

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


  const campgroundProtoDefinition = protoLoader.loadSync(campgroundProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;
  const campgroundProto = grpc.loadPackageDefinition(campgroundProtoDefinition).campground;
  const reviewProto = grpc.loadPackageDefinition(reviewProtoDefinition).review;

  const clientUsers = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());
  const clientReviews = new reviewProto.ReviewService('localhost:50052', grpc.credentials.createInsecure());
  const clientCampground = new campgroundProto.CampgroundService('localhost:50053', grpc.credentials.createInsecure());

// User Endpoints
  app.get('/users', (req, res) => {
  clientUsers.searchUsers({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.users);
      }
    });
  });

  app.get('/users/:id', (req, res) => {
    const id = req.params.id;

    clientUsers.getUser({ user_id: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.user);
      }
    });
  });

  app.post('/user', (req, res) => {
    const {username, email} = req.body;    
    clientUsers.createUser({username: username, email: email}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.user);
      }
    });
  })

  app.patch('/users/:id', (req, res) => {
    const id = req.params.id;
    const {username, email} = req.body;    
    clientUsers.updateUser({user_id: id, username: username, email: email}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.user);
      }
    });

  })

  app.delete('/users/:id', (req, res) => {
    const id = req.params.id;  
    clientUsers.deleteUser({user_id: id}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).json(response.user);
      }
    });

  })
  


  // Reviews Endpoints
  app.get('/reviews', (req, res) => {
    clientReviews.searchReviews({}, (err, response) => {

      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.reviews);
      }
    });
  });

  app.get('/reviews/:id', (req, res) => {
    const id = req.params.id;
    clientReviews.getReview({ review_id: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.review);
      }
    });
  });

  app.post('/review', (req, res) => {
    const {title, body, rating, user_id} = req.body;    
    clientReviews.createReview({title: title, body: body, rating: rating, user_id: user_id}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.review);
      }
    });
  })

  app.patch('/reviews/:id', (req, res) => {
    const id = req.params.id;
    const {title, body, rating} = req.body;  
    clientReviews.updateReview({review_id: id, title: title, body: body, rating: rating}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.review);
      }
    });

  })

  app.delete('/reviews/:id', (req, res) => {
    const id = req.params.id;  
    clientReviews.deleteReview({review_id: id}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).json(response.user);
      }
    });

  })
  

// Campgrounds Endpoints
app.get('/campgrounds', (req, res) => {
  clientCampground.searchCampgrounds({}, (err, response) => {

    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.campgrounds);
    }
  });
});

app.get('/campgrounds/:id', (req, res) => {
  const id = req.params.id;

  clientCampground.getCampground({ campground_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.campground);
    }
  });
});


app.post('/campground', (req, res) => {
  const {title, description, price, location, user_id, review_ids} = req.body;    
  clientCampground.createCampground({title: title, description: description, price: price, location: location, user_id: user_id, review_ids: review_ids}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.campground);
    }
  });
})


app.patch('/campgrounds/:id', (req, res) => {
  const id = req.params.id;
  const {title, description, price, location} = req.body;  
  clientCampground.updateCampground({campground_id: id, title: title, description: description, price: price, location: location}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.campground);
    }
  });

})

app.delete('/campgrounds/:id', (req, res) => {
  const id = req.params.id;  
  
  clientCampground.deleteCampground({campground_id: id}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).json(response.user);
    }
  });

})





const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});

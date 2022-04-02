const userSchema = require("../models/userSchema/rider");
const driverSchema = require("../models/driverSchema/driver")
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const async = require("async");



function getDistanceFromLatLngInKm(lat1, lon1, lat2, lon2) {

   let diff1 = Math.pow(lat2 - lat1, 2);
   let diff2 = Math.pow(lon2 - lon1, 2);
   let dis = Math.sqrt(diff1 + diff2);
   return dis;
}


let getdriverList = async (req, res) => {

  let user = req.user;
  let getAllDriver = await driverSchema.find({"available": true, "status": true});
  let data = [];
  if(getAllDriver.length > 0){
    getAllDriver = await Promise.all(getAllDriver.map(async (ele, i) => {
       if(ele.location.length){
        const userLng = user.location[0].coordinates[0];
        const userLat = user.location[0].coordinates[1];
        const driverLng = ele.location[0].coordinates[0];
        const driverLat = ele.location[0].coordinates[1];
        const distance = getDistanceFromLatLngInKm(userLat, userLng, driverLat, driverLng)  ///6 Km
        //Assuming the specific threshold is 5Km. With In 5Km an user's can book a cab.
        if(distance <= 5){
            data.push(ele);
        }
       }
    }))
  }
}


//Register a rider..
let register = (req, res) => {
  req.body.email = req.body.email
    ? req.body.email.toLowerCase()
    : req.body.email;
  async.waterfall(
    [
      (cb) => {
        let user = {
          fullName: req.body.fullName,
          email: req.body.email || "",
          phone: req.body.phone,
        };
        console.log('user', user);
        userSchema.create(user, (err, result) => {
          if (err) {
            return cb(null, apiResponse.ErrorResponse(res, err), null);
          }
          return cb(null, result);
        });
      },
      (userData, cb) => {
        let dataToSet = { token: utility.jwtEncode(userData._id) };
        userSchema
          .findOneAndUpdate({ _id: userData._id }, dataToSet, { new: true })
          .exec(async (err, updatedUser) => {
            if (err) {
              return cb(null, apiResponse.ErrorResponse(res, err), null);
            }
            cb(
              null,
              apiResponse.successResponseWithData(
                res,
                statusMessage.REGISTER,
                updatedUser
              )
            );
          });
      },
    ],
    (err, res) => {}
  );
};

//User add address.
let addAddress = (req, res) => {
  const { address, state, city, zipcode, latitude, longitude } = req.body;
  const userId = req.headers.decoded_id;
  async.waterfall(
    [
      (cb) => {
        let dataToSet = {
          $push: {
            location: {
              address,
              state,
              city,
              zipcode,
              coordinates: [longitude || 0, latitude || 0],
            },
          },
        };
        userSchema.findOneAndUpdate(
          { _id: userId },
          dataToSet,
          { new: true },
          (err, dbData) => {
            console.log(err, dbData);
            if (err) {
                return cb(
                  apiResponse.ErrorResponseWithData(
                    res,
                    statusMessage.DB_ERROR
                  ),
                  err
                );
            }
            return cb(
              null,
              apiResponse.successResponseWithData(
                res,
                statusMessage.ADDED,
                dbData.location
              )
            );
          }
        );
      },
    ],
    (err, res) => {}
  );
};

module.exports = {
  register,
  addAddress,
  getdriverList
};

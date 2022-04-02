const driverSchema = require("../models/driverSchema/driver");
const { apiResponse } = require("../helpers/apiResponse");

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
        driverSchema.create(user, (err, result) => {
          if (err) {
            return cb(null, apiResponse.ErrorResponse(res, err), null);
          }
          return cb(null, result);
        });
      },
      (userData, cb) => {
        let dataToSet = { token: utility.jwtEncode(userData._id) };
        driverSchema
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

let addAddress = (req, res) => {
  const { address, state, city, zipcode, latitude, longitude } = req.body;
  const userId = req.headers.decoded_id;
  async.waterfall(
    [
      (cb) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          cb(
            apiResponse.validationErrorWithData(
              res,
              "Validation Error.",
              errors.array()
            ),
            null
          );
          return;
        }
        cb(null);
      },
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
        driverSchema.findOneAndUpdate(
          { _id: userId },
          dataToSet,
          { new: true },
          (err, dbData) => {
            console.log(err, dbData);
            if (err) {
              if (req.headers.lang === "el")
                return cb(
                  apiResponse.ErrorResponseWithData(
                    res,
                    statusMessageGr.DB_ERROR
                  ),
                  err
                );
              else
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

let editAddress = (req, res) => {
  const userId = req.headers.decoded_id;
  const addressId = req.params.addressId || req.body.addressId;
  const { address, state, city, zipcode, latitude, longitude } = req.body;
  async.waterfall(
    [
      (cb) => {
        let query = { "location._id": addressId };
        driverSchema.findOne(query, (err, dbData) => {
          if (err) {
            return cb(apiResponse.ErrorResponse(res, err), null);
          } else if (!dbData) {
            return cb(
              apiResponse.ErrorResponse(res, "Invaild Address Id"),
              null
            );
          }
          return cb(null, dbData);
        });
      },
      (result, cb) => {
        let criteria = [{ _id: userId }, { "location._id": addressId }, {"available": true}];
        let dataToSet = {
          "location.$.address": address || result.location[0].address,
          "location.$.state": state || result.location[0].state,
          "location.$.zipcode": zipcode || result.location[0].zipcode,
          "location.$.city": city || result.location[0].city,
          "location.$.coordinates": [
            longitude || result.location[0].coordinates[0],
            latitude || result.location[0].coordinates[1],
          ],
        };
        driverSchema.findOneAndUpdate(
          { $and: criteria },
          { $set: dataToSet },
          { new: true },
          (err, dbData) => {
            if (err || !dbData) {
              return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
            }
            cb(null, dbData.location);
          }
        );
      },
    ],
    (err, result) => {
      if (err) return;
      apiResponse.successResponseWithData(res, statusMessage.success, result);
    }
  );
};

let updateAvailability = (req, res) => {
    
    const userId = req.headers.decoded_id;
    let request = req.body.available;
    let msg = statusMessage.UPDATED;
    driverSchema.findByIdAndUpdate({ _id: userId}, { $set: request }, (err, result) => {
      if (err || !result) {
          apiResponse.ErrorResponse(res, statusMessage.ValidationError);
      }
    });
    apiResponse.successResponseWithData(res, msg);
}

module.exports = {
  register,
  addAddress,
  editAddress,
  updateAvailability
};

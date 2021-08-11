const db = require("../models");
const Tutorial = db.tutorials;

const getPagination = (page, size) => {
    const limit = size ? + size : 4;
    const offset = page ? page * limit : 0;

    return {limit, offset};
};

//Create and Save a New Tutorial
exports.create = (req, res) => {
    //validate request
    if(!req.body.title) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    //Create a Tutorial
    const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    });

    //Save Tutorial in the Database
    tutorial
        .save(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some Error Occured While Creating the Tutorial."
            });
        });
};

//Retrieve all Tutorials from the Database
// exports.findAll = (req, res) => {
//     const title = req.query.title;

//     var condition = title ? {title : {$regex: new RegExp(title), $options: "i"}} : {};

//     Tutorial.find(condition)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some Error Occured While Retrieving Tutorials."
//             });
//         });
// };

//Retrieve all Tutorials from the Database
exports.findAll = (req, res) => {
    const {page, size, title} = req.query;
    var condition = title ? {title : {$regex: new RegExp(title) , $options: "i"}} : {};

    const {limit, offset} = getPagination(page, size);

    Tutorial.paginate(condition, {offset , limit})
        .then((data) => {
            res.send({
                totalItems: data.totalDocs,
                tutorials: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: 
                    err.message || "Some Error Occured While Retrieving Tutorials.",
            });
        });
};

//Find a Single Tutorial With an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findById(id)
        .then(data => {
            if(!data)
                res.status(404).send({message: "Not Found Tutorial With Id" + id});
            else
                res.send(data);
        })
        .catch(err => {
            res.status(500).send({message: "Error Retrieving Tutorial with id=" + id});
        });
};

//Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to Update cannot be empty!"
        });
    }

    const id = req.params.id;

    Tutorial.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data) {
                res.status(404).send({
                    message: `Cannot Update Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
            else {
                res.send({message: "Tutorial was Updated Successfully."});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error Updating Tutorial with ID=" + id
            });
        });
};

//Delete a Tutorial with the Specified Id in the Request
exports.delete = (req , res) => {
    const id = req.params.id;

    Tutorial.findByIdAndRemove(id, {useFindAndModify: false})
        .then(data => {
            if(!data) {
                res.status(404).send({
                    message: `Cannot Delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
            else {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" +id
            });
        });
};

//Delete all Tutorials from the Database
exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tutorials were Deleted Successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some Error Occured While Removing all Tutorials."
            });
        });
};

//Find all Published Tutorials
// exports.findAllPublished = (req, res) => {
//     Tutorial.find({published: true})
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error Occured While Finding All Published Tutorials."
//             });
//         });
// };

//Find all Published Tutorials
exports.findAllPublished = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Tutorial.paginate({ published: true }, { offset, limit })
      .then((data) => {
        res.send({
          totalItems: data.totalDocs,
          tutorials: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error Occured While Finding All Published Tutorials.",
        });
      });
  };
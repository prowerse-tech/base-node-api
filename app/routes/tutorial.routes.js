module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");

    var router = require("express").Router();

    //Create a New Tutorial
    router.post("/" , tutorials.create);

    //Retrieve All Tutorials
    router.get("/" , tutorials.findAll);

    //Retrive All Published Tutorials
    router.get("/published" , tutorials.findAllPublished);

    //Retrive a Single Tutorial with id
    router.get("/:id" , tutorials.findOne);

    //Update a Tutorial with Id
    router.put("/:id" , tutorials.update);

    //Delete a Tutorial with id
    router.delete("/:id", tutorials.delete);

    //Delete All Tutorials
    router.delete("/" , tutorials.deleteAll);

    app.use("/api/tutorials" , router);
};
const express = require("express");
const eventRouter = express.Router();
const isAuth = require("../middlewares/isAuth");
const Event = require("../Models/event");

//Add Event Page Render Route
eventRouter.get("/admin/createEvent", isAuth, async (req, res) => {
  try {
    res.render("createEvent");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//  all event page

eventRouter.get("/admin/allEvents", isAuth, async (req, res) => {
  try {
    const events = await Event.find({}).sort({ publishedAt: -1 }).exec();
    res.render("allEvents", { events });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// adding new event
eventRouter.post("/admin/createEvent", isAuth, async (req, res) => {
  try {
    let event = new Event(req.body);
    event = await event.save();

    res.redirect("/admin/allEvents");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//deleting an event
eventRouter.delete("/admin/event/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);
    await Event.findByIdAndDelete(id);
    res.redirect("/admin/allEvents");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//TO FETCH ALL EVENTS FOR MOBILE APPLICATION
eventRouter.get("/api/getEvents", async (req, res) => {
  const page = parseInt(req.query.page);
<<<<<<< HEAD
  try {
    if (!page) {
      const events = await Event.find({}).sort({ publishedAt: -1 }).exec();
      res.status(200).json(events);
    } else {
      const options = {
        page,
        limit: 15,
        sort: { publishedAt: -1 }, // Sort in descending order of publishedAt
      };

      const result = await Event.paginate({}, options);
      res.status(200).json(result);
=======
    try{
      const page = parseInt(req.query.page);
      if(!page){
        const events = await Event.find({}).sort({publishedAt:-1}).exec();
        res.status(200).json(events)
      }
      else{
        const options = {
          page,
          limit: 15,
          sort: { publishedAt: -1 }, // Sort in descending order of publishedAt
        };

        const result = await Event.paginate({},options);
        res.status(200).json(result);
      }
    } catch(e){
      res.status(500).json({error: e.message})
>>>>>>> 99844cc8c4eefabd1b49f00f73670362d1af4cc9
    }
    //const events = await Event.find({}).sort({publishedAt:-1}).exec();
    //res.status(200).json(events)
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

<<<<<<< HEAD
module.exports = eventRouter;
=======
module.exports = eventRouter
>>>>>>> 99844cc8c4eefabd1b49f00f73670362d1af4cc9

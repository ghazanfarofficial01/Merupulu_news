const express = require('express');
const eventRouter = express.Router();
const isAuth = require('../middlewares/isAuth');
const Event = require('../Models/event');


//Add Event Page Render Route
eventRouter.get('/admin/createEvent', isAuth, async (req, res) => {
    try{
      res.render("createEvent");
    } catch(e){
      res.status(500).json({error: e.message})
    }
   })
 
// adding new event   
eventRouter.post('/admin/createEvent', isAuth, async (req, res) =>{
    try{
           
           let event = new Event(req.body);
           event = await event.save();

           res.redirect('/admin/dashboard');
    } catch(e){
        res.status(500).json({error:e.message});
    }
})

//TO FETCH ALL EVENTS FOR MOBILE APPLICATION
eventRouter.get('/api/getEvents',async (req, res) => {
    try{
      const events = await Event.find({});
      res.status(200).json(events)
    } catch(e){
      res.status(500).json({error: e.message})
    }
   })

module.exports = eventRouter
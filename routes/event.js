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

  //  all event page

  eventRouter.get('/admin/allEvents', isAuth, async (req, res) => {
    try{
      const events = await Event.find({}).sort({publishedAt:-1}).exec();
      res.render("allEvents",{events});
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

//deleting an event
eventRouter.delete('/admin/event/:id',isAuth, async (req,res) =>{
  try{
    const {id} = req.params;
    //console.log(id);
     await Event.findByIdAndDelete(id);
     res.redirect('/admin/allEvents');

  } catch(e){
    res.status(500).json({error: e.message})
  }
})
//TO FETCH ALL EVENTS FOR MOBILE APPLICATION
eventRouter.get('/api/getEvents',async (req, res) => {
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
    }
   })

module.exports = eventRouter

const User = require('../../models/user');
const noteItemsModel = require('../../models/note');
const jwt = require("jsonwebtoken");
const config=require('../../utils/config');

const SECRET_KEY = config.SECRET_KEY;

const getTokenFrom = (request) => {
    const authHeader = request.header('Authorization');
    return authHeader;
}

const noteController={
    
      //To get the ID of User
      getUserID:async(req,res)=>{
        try{
            const token = getTokenFrom(req);
            // decode the token to authorize the user
            const decodedToken = jwt.verify(token, SECRET_KEY);
            // if the token is not valid, return an error
            if(!decodedToken){
                return response.json({ message: 'token invalid' });
            }
            const user=await User.findById(decodedToken.userId).exec();
            const user_ID=user._id
            res.status(200).json({user_ID,user})
            
        }
        catch(error){
            console.error('Error in Fetching User ID',error)
            res.status(500).json({message:'Error in Fetching User ID'})
        }
    },

    //To view all notes
    getAllNotes:async(req,res)=>{
        try{
          console.log("IDDD "+req.params.id)
            const allNoteItems = await noteItemsModel.find({user:req.params.id}).exec();
             console.log("Alll  "  +allNoteItems);
            res.status(200).json(allNoteItems);
          }catch(err){
            res.json(err);
          }
    },

    //To get note using ID
    getNote:async(req,res)=>{
      try{
          //console.log(req.params.id)
          const NoteItems = await noteItemsModel.findById(req.params.id).exec();
          //console.log({TodoItems});
          res.status(200).json({NoteItems})
        }catch(err){
          res.json(err);
        }
  },

     //To add new note
     addnewNote:async(req,res)=>{
        try{
            const {note,description}=req.body;
            console.log("NOTE "+note+"   "+description +"   "+ req.params.id)
            const newItem = new noteItemsModel({
              note: note,
              description:description,
              user:req.params.id,
            })
            //save this item in database
            const saveItem = await newItem.save();
             console.log(saveItem)
            res.status(200).json(saveItem);
          }catch(err){
            res.json(err);
          }
    },


     //To update a note
     editNote:async(req,res)=>{
        try{
            //find the item by its id and update it
            const updateItem = await noteItemsModel.findByIdAndUpdate(req.params.id).exec();
            updateItem.set(req.body)
            const result=await updateItem.save();
            res.status(200).json({result});
          }catch(err){
            res.json(err);
          }
    },

     //To Delete a note
     deleteNote:async(req,res)=>{
        try{
          //console.log(req.params.id)
            //find the item by its id and delete it
            const deleteItem = await noteItemsModel.findByIdAndDelete(req.params.id);
            // console.log("DELETED");
            res.status(200).json('Item Deleted');
          }catch(err){
            res.json(err);
          }
    },

}

module.exports=noteController;
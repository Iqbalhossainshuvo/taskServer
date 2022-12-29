const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()



const app = express()
const port = process.env.PORT || 5000



//  MIDDLEWARE
app.use(cors())
app.use(express.json())



// MONGODB CONNECTION

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c3fbyna.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})

// YOUR ALL CODE WRITE INSIDE HERE 
async function run(){
  try{
      const taskCollection=client.db('taskMaster').collection('task')

      app.post('/task', async (req, res)=>{
          const task=req.body;
          const result=await taskCollection.insertOne(task)
          res.send(result)
      })

      app.get('/task', async(req, res)=>{
        const email=req.query.email
        const query={email: email, complete:false}
        const result=await taskCollection.find(query).toArray()
        res.send(result)

      })

      app.get('/complete', async(req, res)=>{
        const email=req.query.email
        const query={email: email, complete:true}
        const result=await taskCollection.find(query).toArray()
        res.send(result)

      })

      app.delete('/delete/:id', async(req, res)=>{
        const id=req.params.id
        const query={_id: ObjectId(id)}
        const result=await taskCollection.deleteOne(query)
        res.send(result)
      })

      app.put('/update/:id', async (req, res)=>{
        const id=req.params.id
        const filter={_id: ObjectId(id)}
        const option={upsert: true}
        const updateUser={
          $set:{
            complete: true
          }
        }
        const result= await taskCollection.updateOne(filter, updateUser, option)
        res.send(result)
      })

      // dynamic id
      app.get('/update/:id', async(req, res)=>{
        const id=req.params.id
        const query={_id: ObjectId(id)}
        const result=await taskCollection.findOne(query)
        res.send(result)
      })

      // update data 
      app.put('/updateTask/:id', async(req, res)=>{
        const id=req.params.id
        const filter={_id: ObjectId(id)}
        const user=req.body 
        const updateDoc={
          $set:{
            task: user.task
            
          }
        }
        const result= await taskCollection.updateOne(filter, updateDoc)
        res.send(result)
      })



  }

  finally{

  }

}
run().catch(error => console.log(error))



app.get('/', (req, res) => {
  res.send('Server is running...')
})

app.listen(port, () => {
  console.log(`Server is running...on ${port}`)
})

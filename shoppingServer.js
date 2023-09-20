let express =require ("express")
let app =express()
app.use(express.json())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD")
    res.header("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept")
    next()
})
var port=process.env.PORT||2410
app.listen(port,()=>console.log(`Listening on port ${port}!`))
let {data,orders,customers}=require("./data.js")

app.get("/products",function(req,res){
    let category=req.query.category
    let arr1=data
    if(category){
        arr1=arr1.filter(st=>st.category===category)
    }
    else arr1=data
    res.send(arr1)
})

app.get("/products/:id",function(req,res){
    let id=req.params.id
    let arr1=data.find(st=>st.id===+id)
    console.log(arr1,data)
    if (arr1) res.send(arr1)
    else res.status(404).send("no product found")
})

app.post("/products",function(req,res){
    let body =req.body
    console.log(body)
    let maxid=data.reduce((acc,curr)=>acc>=curr.id
    ?acc:curr.id,0)
    console.log(maxid)
    let newId=data.length+1
    console.log(maxid+1)
    let newProd={id:maxid+1,...body}
    data.push(newProd)
    res.send(newProd)
    
})

app.put("/products/:id",function(req,res){
    let id=req.params.id
    let body =req.body
    let index=data.findIndex(st=>st.id===+id)
    if(index>=0){
    let updatedProd={id:id,...body}
    data[index]=updatedProd
    res.send(updatedProd)
    }
    else
    res.status(404).send("no product found")
})

app.delete("/products/:id",function(req,res){
    let id=req.params.id
    console.log(id,"delete")
    let index=data.findIndex(st=>st.id===+id)
    console.log(index)
    if(index>=0){
    let deletedProd=data.splice(index,1)
    res.send(deletedProd)
    }
    else
    res.status(404).send("no product found")
})

app.get("/cart",function(req,res){
    res.send(cart)
})
app.post("/addtocart",function(req,res){
    let body =req.body
    console.log(body)
    cart.push(body)
    res.send(body)
    
})
app.delete("/removefromcart/:id",function(req,res){
    let index=req.params.index
    console.log(index)
    if(index>=0){
    let deletedProd=cart.splice(index,1)
    res.send(deletedProd)
    }
    else
    res.status(404).send("no product found")
})
app.get("/orders",function(req,res){
    res.send(orders)
})

app.post("/orders",function(req,res){
    let body =req.body
    console.log(body)
    let maxid=orders.reduce((acc,curr)=>curr.id>=acc
    ?curr.id:acc,0)
    let newId=maxid+1
    let newOrder={id:newId,...body}
    orders.push(newOrder)
    res.send(newOrder)
})

app.post("/login", function (req, res) {
    let body = { email: req.body.email, password: req.body.password };
    let index=customers.findIndex(ele=>ele.password===body.password && ele.email===body.email)
    if(index>=0){
        let send={name:customers[index].name,email:customers[index].email}
        res.send(send)
    }
    else {
        res.status(400).send("wrong username or password")
    }
   }
  );

  app.post("/register", function (req, res) {
    let body = { name: req.body.name,email: req.body.email,password:req.body.password};
    let id=customers.reduce((acc,curr)=>{acc>curr?acc:curr},0)
    console.log(id)
    let newcus={custId:id,...body}
    console.log(newcus)
    customers.push(newcus)
    res.send(newcus)
   }
  );

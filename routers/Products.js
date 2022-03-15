const route =require('express').Router();
const contro=require('../controle/Prod_controle');
route.get('/products',(req,res,next)=>{
    contro.getallProd()
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
    
})
route.get('/product/:id',(req,res,next)=>{
    contro.getone(req.params.id)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.post('/addprod/:id_man',(req,res,next)=>{
    contro.addProduct(req.body.name,req.body.mark,req.body.image,req.body.description,req.body.price,req.body.tage,req.params.id_man)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.delete('/product/:id',(req,res,next)=>{
    contro.deleteProd(req.params.id)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.get('/productofman/:id_man',(req,res,next)=>{
    contro.getprodofman(req.params.id_man)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
route.patch('/update/:id',(req,res,next)=>{
    contro.updateProd(req.params.id,req.body.name,req.body.mark,req.body.image,req.body.description,req.body.price)
    .then(doc=>res.status(200).json(doc))
    .catch(err=>res.status(400).json(err))
})
module.exports=route
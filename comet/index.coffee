
express = require "express"
bodyParser = require "body-parser"
queue = require "./queue"
app = express()

app.engine ".html", require("ejs").__express
app.set "views", "#{__dirname}/views"
app.set "view engine", "html"
app.use bodyParser.json() # for parsing application/json
app.use bodyParser.urlencoded extended: true # for parsing application/x-www-form-urlencoded
app.use express.static "#{__dirname}"

app.get "/", (req,res)->
    res.render "home"

# Comet apis
app.get "/comet", (req,res)->
    res.render "comet"

app.post "/comet", (req,res)->
    data = req.body
    if data.action == "Push"
        data.time = new Date().getTime()
        delete data.action
        queue.push data
    else if data.action =="Clear"
        queue.clear()
    console.log queue.get()
    res.redirect "/comet"
request_timer = null

app.get "/push", (req,res)->
    clearTimeout request_timer

    checkData = ()->

        console.log "checking ... #{new Date()} "
        data = queue.get()

        if data && data.length>0
            queue.clear()
            res.send data[data.length-1]
        else 
            request_timer = setTimeout ()->
                checkData()
            ,200

    response_timer = setTimeout ()->
        res.destroy();
        console.log "Response Timeout."
    , 60000*15

    res.on "end", ()->
        clearTimeout response_timer
        clearTimeout request_timer

    checkData()



# Cross domain apis

app.get "/cors", (req,res)->
    res.render "cors"


app.get "/weather", (req,res)->
    rs = 
        data: req.query.citypinyin
        method: "GET #{new Date()}"
    res.send rs

app.post "/weather", (req,res)->
    rs = req.body
    rs['method'] = "POST #{new Date()}"
    res.send rs

app.put "/weather", (req,res)->
    rs = req.body
    rs['method'] = "PUT  #{new Date()}"
    res.send rs

app.delete "/weather/:id", (req,res)->
    rs = 
        data: req.params.id 
        method: "DELETE #{new Date()}"
    res.send rs

app.listen 3000
console.log "Express started on port 3000"
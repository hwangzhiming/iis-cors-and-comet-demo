requestQueue = []

exports.push = (item)-> 
    requestQueue.push item

exports.get = ()->
    return requestQueue

exports.clear = ()->
    requestQueue = []


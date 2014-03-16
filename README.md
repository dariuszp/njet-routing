njet-routing
============

Routing for njet

##Usage

```JavaScript
var njetRouting = require('njet-routing'),
    router = njetRouting.createRouter();
```

You can use following verb methods:
- get
- post
- put
- delete
- options
- head
- trace
- connect
- any

To add route for any verb use *router.{verb}.add()* like this:

```JavaScript
router.post.add('create_user', '/user/{type}')
```

where type is variable passed to user. Default regexp for any variable is ([^/]+).
Variable can have default value. Define it like this:

```JavaScript
router.post.add('create_user', '/user/{type | super me}')
```

If you need specific pattern for "type", add it to third parameter - requirements:
```JavaScript
router.post.add('create_user', '/user/{type | super me}', {
    type: [a-z]+
})
```

*Remember*, default value will be trimmed to "super me" and it will be not affected by provided requirement for type.

Now if "type" is not provided when generating url, default value will be "super me".
To retreive route, use get() method:

```JavaScript
var route = router.post.get('create_user')
```

To generate url based on route name and arguments, use:

```JavaScript
var route = router.post.generate('create_user', {
    type: 'superman',
    age: 26
})
```

Any unused parameter will be added to url as query string. In this specific case it will be like this:
```
/user/superman?age=26
```
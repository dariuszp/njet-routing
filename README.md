njet-routing [![Build Status](https://travis-ci.org/dariuszp/njet-routing.png?branch=master)](https://travis-ci.org/dariuszp/njet-routing)
===



###REQUEST METHODS

```JavaScript
var njetRouting = require('njet-routing'),
    router = njetRouting.createRouter();
```

You can use following methods methods:
- get
- post
- put
- delete
- options
- head
- trace
- connect
- any (custom, when request method is not specified)



###ADD ROUTE

To add route for any verb use *router.{method}.add()* like this:

```JavaScript
router.post.add('create_user', '/user/{type}')
```

where type is variable passed by user. Default regexp for any variable is ([^/]+).
Variable can have default value. Define it like this:

```JavaScript
router.post.add('create_user', '/user/{type | super me}')
```

If you need specific pattern for "type", add it to third parameter - requirements:
```JavaScript
router.post.add('create_user', '/user/{type | super me}', {
    type: '[a-z]+'
})
```

*Remember*, default value will be trimmed to "super me" and it will be not affected by provided requirement for type.

Now if "type" is not provided when generating url, default value will be "super me".

Also, each route can carry data object. For example while registering route, you want to keep some informations,
like controller name that should handle request or anything like that. If you want to have that information,
simply add 4th parameter to .add() method like this:

```JavaScript
router.post.add('create_user', '/user/{type | super me}', {
    type: '[a-z]+'
}, {
    myControllerName: 'MySuperController',
    myActionName: 'CoolAction',
    randomStuff: 'my dog name is Cesar'
})
```



###GET ROUTE

To retreive route, use get() method:

```JavaScript
var route = router.post.get('create_user')
```

You will have full object with all data you provided so far.



###GENERATE PATH

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

If type is omitted while default parameter is defined, default parameter will be used.
Default argument is add as alternative to regexp in requirements so both will always match.

If you need absolute url, set third argument to true:
```JavaScript
var route = router.post.generate('create_user', {
    type: 'superman',
    age: 26
}, true)
```

This will generate:
```
http://localhost/user/superman?age=26
```

Remember that all arguments added to query string are sorted alphabetically so order on argument list does not matter.

To change scheme, base url or host, use:
- setHost()
- setScheme()
- setBaseUrl()
- setPort()

Like this:
```JavaScript
router.setScheme('https').setHost('dariuszp.com').setBaseUrl('my/new');
var route = router.post.generate('create_user', {
    type: 'superman',
    age: 26
}, true)
```

This will generate:
```
https://dariuszp.com/my/new/user/superman?age=26
```

Ad port as 4th parameter in case you want to change port for just this route:

```JavaScript
router.post.generate('create_user', {
    type: 'superman',
    age: 26
}, true, 8983);
```

This will generate:
```
https://dariuszp.com:8983/my/new/user/superman?age=26
```

Default port 80 is never added to route for obvious reasons. If You want port to be always visible, you can force it:
```
.forcePortInUrl(true)
```

Also if all your routes should have custom port, simply use:
```
.setPort(8983); // for example port 8983
```



###MATCHING

To find out if your path match any route, use match for any method (verbs):

```JavaScript
router.post.match('/user/superman?age=26');
```

.match() return either false or result object. Result object have properties:
- route - route object
- routeParams - route in path extracted from given pattern
- queryParams - params from query string
- params - all params but *be aware* that if route param name match query param name, route param takes priority

By aware that match will check either specific verb routes or all routes. ANY is just another group of routes.
Matching will not check any at any point. Programmer need to do it himself/herself.



###DEBUGGING

To get all routes, use .dump(method = false, byName = false) method. Dump accept two arguments:
- method - dump only specific methods
- byName - dump routes with names as keys
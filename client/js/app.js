angular.module("demo", [])
.service("query", ["$http","$q",function ($http, $q) {
    var request = function (req) {
        var deferred = $q.defer();
        $http(req)
            .success(function (data) {
                deferred.resolve(data);
            }).error(function (msg, status) {
                deferred.reject(status);
            });

        return deferred.promise;
    }

    return {
        get: function () {
            var req = {
                method: 'get',
                timeout:14*60*1000,
                url: '/api/push'
            }
            return request(req);
        }
    }
}])
.service("weather", ["$http","$q",function ($http, $q) {
    var request = function (req) {
        var deferred = $q.defer();
        $http(req)
            .success(function (data) {
                deferred.resolve(data);
            }).error(function (msg, status) {
                deferred.reject(status);
            });

        return deferred.promise;
    }
    return {
        get: function (city) {
            var req = {
                method: 'get',
                url: '/api/weather?citypinyin='+city
            }
            return request(req);
        },
        post: function (d) {
            var req = {
                method: 'post',
                url: '/api/weather',
                data: d
            }
            return request(req);
        },
        put: function (d) {
            var req = {
                method: 'put',
                url: '/api/weather',
                data: d
            }
            return request(req);
        },
        delete: function (d) {
            var req = {
                method: 'delete',
                url: '/api/weather/'+d
            }
            return request(req);
        }

    }
}]);

angular.module("demo").controller("baseCtrl", ["$scope", "weather", "query", "$timeout", function ($scope, weather, query, $timeout) {
    $scope.title = "CORS Demo"
    $scope.setSampleData = function () {
        $scope.reqData = angular.toJson({ name: "alex", age: 18 })
    }
    showResult = function (data) {
        $scope.data = angular.toJson(data, false);
    }
    $scope.get = function () {
        promise = weather.get($scope.reqData);
        promise.then(function (data) {
            showResult(data);
        }, function (msg, status) {
            $scope.errors = msg
        });
    }
    $scope.status = {
        statusA:"0",
        statusB:"0",
        statusC:"0"
    }
    $scope.post = function () {
        promise = weather.post(angular.fromJson($scope.reqData));
        promise.then(function (data) {
            showResult(data);
        }, function (msg, status) {
            $scope.errors = msg
        });
    }

    $scope.put = function () {
        promise = weather.put(angular.fromJson($scope.reqData));
        promise.then(function (data) {
            showResult(data);
        }, function (msg, status) {
            $scope.errors = msg
        });
    }

    $scope.delete = function () {
        promise = weather.delete($scope.reqData);
        promise.then(function (data) {
            showResult(data);
        }, function (msg, status) {
            $scope.errors = msg
        });
    }


    /*long pulling*/
    var longPull = function () {
        $timeout(function(){
            promise = query.get()
            promise.then(function(data){
                $scope.status = data;
                longPull();
            },function(msg) {
                $scope.errors = msg
                longPull(); 
            });
        },0)
    }

    longPull(); 
}]);
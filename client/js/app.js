angular.module("demo", []);
angular.module("demo").service("weather", ["$http","$q",function ($http, $q) {
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

angular.module("demo").controller("baseCtrl", ["$scope", "weather", function ($scope, weather) {
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

}]);
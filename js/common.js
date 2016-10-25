'use strict';
var myApp = angular.module("myapp", []).config(function() {});

myApp.controller("myController", ['$scope', '$http', '$compile', '$timeout', function($scope, $http, $compile, $timeout) {

    $scope.gameData;
    $scope.startPage = true;
    $scope.clockTimeMax = 60;
    $scope.points = 0;

    $http.get('Json/game_data.json').success(function(response) {
        $scope.gameData = response.data;

    });

    $scope.clickNumber = 0;
    var previousTile;
    var clickedItem


    $scope.tileClicked = function(row, col, event) {
        $scope.clickNumber++;
        clickedItem = $scope.gameData[row][col];
        if ($scope.clickNumber == 1) {
            $scope.openTile = true;
            $scope.tile1RowIndex = row;
            $scope.tile1ColIndex = col;
            $(event.target).parent().addClass('flipped');
            previousTile = clickedItem;

        } else if ($scope.clickNumber == 2) {
            $scope.openTile = true;
            $scope.tile2RowIndex = row;
            $scope.tile2ColIndex = col;
            $(event.target).parent('.effect__click').addClass('flipped');
            $scope.compareTiles(previousTile, clickedItem);


        } else {
            $scope.openTile = false;
            $scope.clickNumber = 0;
            var tiles = $('.effect__click');

            for (var i = 0; i < tiles.length; i++) {
                if ($(tiles[i]).hasClass('flipped')) {
                    $(tiles[i]).removeClass('flipped')

                }
            }
            previousTile = null;
        }

    };

    $scope.compareTiles = function(tile1, tile2) {
        $timeout(function() {
            if (tile1.image === tile2.image) {
                $scope.gameData[tile1.row][tile1.col] = {};
                $scope.gameData[tile2.row][tile2.col] = {};
                $scope.points = $scope.points + 10;


            } else {
                var tiles = $('.effect__click');

                for (var i = 0; i < tiles.length; i++) {
                    if ($(tiles[i]).hasClass('flipped')) {
                        $(tiles[i]).removeClass('flipped')

                    }
                }

            }
            $scope.openTile = false;
            $scope.clickNumber = 0;

            previousTile = clickedItem;
        }, 100);

    };

    $scope.startGame = function() {
        $scope.startPage = false;
    };


    $scope.counter = 61;
    $scope.onTimeout = function() {
        $scope.counter--;
        if ($scope.counter >= 0) {
            mytimeout = $timeout($scope.onTimeout, 1000);
        } else {
            $scope.resetGame();
        }

    }
    var mytimeout = $timeout($scope.onTimeout, 1000);

    $scope.resetGame = function() {
        alert("game Over");
        $scope.counter = 61;
        $http.get('Json/game_data.json').success(function(response) {
            $scope.gameData = response.data;

        });
        var mytimeout = $timeout($scope.onTimeout, 1000);
    }

}]);


myApp.filter('isEmpty', [function() {
    return function(object) {
        var objectEmpty;
        if (angular.equals({}, object)) {
            objectEmpty = false;
        } else {
            objectEmpty = true;
        }

        return objectEmpty;
    }
}])

myApp.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])

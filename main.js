
var app = angular.module('macro-log', ['keepr.ngNumbersOnly']);

//TODO Add Droid Sans Font Family

app.directive('input', [function() {
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (
                   'undefined' !== typeof attrs.type
                && 'number' === attrs.type
                && ngModel
            ) {
                ngModel.$formatters.push(function(modelValue) {
                    return Number(modelValue);
                });

                ngModel.$parsers.push(function(viewValue) {
                    return Number(viewValue);
                });
            }
        }
    };
}]);

app.controller('mainCtrl', function($scope) {
    $scope.user = {};
    $scope.meal = {};
    $scope.showCalories = false;
    $scope.noUser = true;
    $scope.user_male= null;
    $scope.user_female = null;
    $scope.show_meals = null;
    $scope.show_activity_male = null;
    $scope.show_activity_female = null;
    $scope.final = null;
    $scope.results = null;
    $scope.results2 = null;
    $scope.user.activityLevel = '';
    $scope.user.bodyFat = '';
    $scope.totalCalories = 0;
    $scope.number = '';
    $scope.numbertwo = '';
    $scope.numberthree = '';

    $scope.bmrActivityCalc = {
      lazy: 1.30,
      light: 1.55,
      average: 1.65,
      heavy: 1.80,
      hard: 2.0
    };
    $scope.maleBodyFat = {
      '10.13': 1.0,
      '14.19': 0.95,
      '20.27': 0.90,
      '28.30': 0.85
    };
    $scope.femaleBodyFat = {
      '14.17': 1.0,
      '18.27': 0.95,
      '28.37': 0.90,
      '38.48': 0.85
    };

    // $scope.numberFieldChange = function() {
    //   console.log(angular.isNumber($scope.number));
      // if (typeof $scope.number === 'number') {
      //   console.log('i am a number');
      // } else {
      //   console.log('this is not a number');
      // }
    //
    // };



    //user basic info required for calculations
    $scope.update = function(user) {
      $scope.user = angular.copy(user);
      console.log($scope.user.bodyFat);
    };
    $scope.addFood = function(food) {
      $scope.meal = angular.copy(food);
      console.log($scope.meal);
      $scope.show_meals = false;
      if ($scope.user.gender === 'male') {
        $scope.show_activity_male = true;
      } else if ($scope.user.gender === 'female') {
        $scope.show_activity_female = true;
      }

      $scope.show_activity = true;
    };
    $scope.showMealsForm = function() {
      $scope.show_meals = true;
      if ($scope.user_male === true) {
        $scope.user_male = false;
      } else if ($scope.user_female === true) {
        $scope.user_female = false;
      }
    };

    $scope.findGender = function() {
      if ($scope.user.gender === 'male') {
        $scope.user_male = true;
        $scope.noUser = false;
        // $scope.show_meals = true;
      } else if ($scope.user.gender === 'female') {
        $scope.user_female = true;
        $scope.noUser = false;
        // $scope.show_meals = true;
      }
    };
    $scope.calculateBMRMale = function() {
      console.log('bodyfat', $scope.maleBodyFat[$scope.user.bodyFat]);
      console.log('type of', typeof $scope.user.weight);
      console.log('crazy', parseInt($scope.user.weight) * 24 * $scope.user.bodyFat);

      $scope.user.bodyFat = $scope.maleBodyFat[$scope.user.bodyFat];
      $scope.user.weight = Math.round($scope.user.weight / 2.2);
      $scope.user.startingBMR = Math.round(parseInt($scope.user.weight) * 24 * $scope.user.bodyFat);

      // $scope.user.startingBMR = $scope.user.startingBMR
      //take the input from the user and then multiply it by the startingBMR
      $scope.user.finalBMR = Math.round($scope.bmrActivityCalc[$scope.user.activityLevel] * $scope.user.startingBMR);
      //take users activity level then multiply it by the activity object
      $scope.show_activity_male = false;
      $scope.final = true;
    };

    $scope.calculateBMRFemale = function() {
      $scope.user.bodyFat = $scope.femaleBodyFat[$scope.user.bodyFat];
      $scope.user.weight = Math.round($scope.user.weight / 2.2);
      $scope.user.startingBMR = Math.round(parseInt($scope.user.weight) * 24 * $scope.user.bodyFat);

      // $scope.user.startingBMR = $scope.user.startingBMR
      //take the input from the user and then multiply it by the startingBMR
      $scope.user.finalBMR = Math.round($scope.bmrActivityCalc[$scope.user.activityLevel] * $scope.user.startingBMR);
      $scope.show_activity_female = false;
      $scope.final = true;
    };

    $scope.muscleGain = function() {
      //take total of meals calories, then compare against finalBMR
      $scope.final = false;
      $scope.results = true;
      $scope.totalCalories = _.reduce($scope.meal, function(num, sum) {
        return sum + num;
      }, 0);
      if ($scope.totalCalories < $scope.user.finalBMR) {
        $scope.showCalories = true;
        console.log($scope.totalCalories);
        $scope.totalCalories = Math.abs($scope.totalCalories - $scope.user.finalBMR);
        return false;

        //algorithim to gain 1 pound of muscle
      } else if ($scope.totalCalories - $scope.user.finalBMR > 350) {
        $scope.showCalories = true;
        return true;
      }



      //2500 calories over a week excess to gain 1 lb of muscle
      //average 350 a day
      //if the user finalBMR is 350 points over, then they are in the right spot
      //else if they are at finalBMR exactly or lower they need to eat more calories
    };

    $scope.weightLoss = function() {
      $scope.final = false;
      $scope.results2 = true;
      $scope.totalCalories = _.reduce($scope.meal, function(num, sum) {
        return sum + num;
      }, 0);
      if ($scope.totalCalories - $scope.user.finalBMR > 500 ) {
        $scope.showCalories = true;
        return false;
      } else if ($scope.totalCalories - $scope.user.finalBMR < 500) {
        $scope.showCalories = true;
        return true;
      }
    };
  });

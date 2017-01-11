(function(){
'use strict';

angular.module('AuditionFormApp', ['ngMaterial'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default').dark()
        .primaryPalette('blue')
        .accentPalette('orange');
    })

    .controller('MainCtrl', ['$scope', '$timeout', '$mdDialog', '$log', function ($scope, $timeout, $mdDialog, $log){
        $scope.formHeading = 'Audition Signup Form';
        $scope.hairLengths = ['short', 'medium', 'long'];
        $scope.hairColors = ['black', 'brown', 'blonde', 'auburn', 'red', 'gray', 'white'];
        $scope.roleSizes = ['small', 'large', 'any size'];
        $scope.yesorno = ['yes', 'no'];

        const ipc = require('electron').ipcRenderer;
        const configTemp = require('./configTemplate.js');

        $scope.user = angular.extend({}, configTemp.user);
        $scope.user.guardians.push(configTemp.guardian);

        $scope.loggedIn = false;
        $scope.admin = false;

        $scope.loginSubmit = function () {
            ipc.send('login-submit');
        }

        $scope.logout = function () {
            angular.element('#admin-section').slideUp();
            eventBuffer(500, 'userLogout');
        }

        ipc.on('adminLogin', function(event, userDatabase) {
            $scope.admin = true;
            $scope.userDatabase = userDatabase;
            console.log('admin logged in!');
        });

        ipc.on('userLogin', _=> {
            $scope.loggedIn = true;
        });

        ipc.on('userHistoryFound', (event, history) => {
            console.log('Angular Found: ');
            $scope.loggedIn = true;
            for (let item in history) {
                if (item !== 'name' && item !== 'birthdate') {
                    $scope.user[item] = history[item];
                }
            }
        });

        function showEditMessage (user) {
            $mdDialog.show({
                // $mdDialog.confirm({
                    clickOutsideToClose: true,
                    templateUrl: 'views/userCards.html',
                    controller: function (scope, user) {scope.user = user},
                    locals: {user: user}
                    // ok: 'close'
                // })
           })
                // .finally(function () {
                    
                // });
        }

        $scope.editUser = function (index) {
            let userArr = [];
            for (let key in $scope.userDatabase) {
                userArr.push(key);
            }
            $scope.editingUser = $scope.userDatabase[userArr[index]];
            showEditMessage($scope.editingUser);
            console.log($scope.userDatabase[userArr[index]].name.first, $scope.userDatabase[userArr[index]].name.last);
        }

        $scope.removeUser = function (index) {
            angular.element(`#user-line${index}`).slideUp();
        }

        $scope.adminEditUser = function (user) {
            console.log('user: ', user);
        }

        $scope.adminRemoveUser = function (user, index) {
            ipc.send('removeUser', user);
            angular.element(`#user${index}`).slideUp();
        }

        $scope.addGuardian = function () {
            let newGuardian = angular.extend({}, configTemp.guardian);
            $scope.user.guardians.push(newGuardian);
        }

        $scope.removeGuardian = function (index) {
            console.log(index)
            angular.element(`#guardian${index}`).slideUp();
            $timeout(_=> {
                $scope.user.guardians.splice(index, 1);
            }, 500);
        }

        let eventTimeout;
        function eventBuffer(delay, event, d1, d2, d3) {
            $timeout.cancel(eventTimeout);
            eventTimeout = $timeout(_=> {
                ipc.send(event, d1, d2, d3);
            }, delay);
        }

        $scope.updateUser = function () {
            eventBuffer(500, 'updateUser', 'user');
        }

        $scope.$watchCollection('user', (newObj, oldObj) => {
            let key;
            for (key in newObj) {
                if (newObj[key] !== oldObj[key] && key !== 'birthdate') {
                    eventBuffer(500, 'updateUser', 'user');
                }
            }
        });

        $scope.$watchCollection('user.name', (newName, oldName,) => {
            console.log('name name name: ', newName, oldName);
            eventBuffer(500, 'updateUser', 'user', newName, oldName);
        });

        $scope.$watchCollection('user.guardians', username => {
            eventBuffer(500, 'updateUser', 'user');
        });

        $scope.phoneNumberFormat = function(number) {
            number = number.match(/[\d+.+]/g);
            if (number) {
                if (number.length === 10) {
                let phonenumber = number.join('').replace(/(\d{3})(\d{3})(\d{4})/g, (match, area, pre, suff) => {
                    return `(${area}) ${pre}-${suff}`;
                });
                    return phonenumber;
                }
            }
        }

        $scope.updateUserName = function (event) {
            let name = event.target.value.split(' ');
            $scope.user.name.first = name[0];
            $scope.user.name.last = name[1];
        }

    module.exports.user = $scope.user;
}])

    .directive('loginForm', [function () {
        return {
            restict: 'E',
            replace: true,
            templateUrl: 'views/loginForm.html'
        }
    }])

    .directive('mainForm', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/mainForm.html'
        }
    }])

    .directive('adminSection', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/adminSection.html'
        }
    }])

    .directive('guardiansList', [function () {
        return {
            restict: 'E',
            replace: true,
            templateUrl: 'views/guardians.html'
        }
    }])
}())
















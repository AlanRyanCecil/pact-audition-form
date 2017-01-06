'use strict';

angular.module('AuditionFormApp', ['ui.router', 'ngMaterial'])

    .controller('MainCtrl', ['$scope', '$document', '$timeout', '$log', function ($scope, $document, $timeout, $log){
        $scope.formHeading = 'Audition Signup Form';
        $scope.hairLengths = ['short', 'medium', 'long'];
        $scope.hairColors = ['black', 'brown', 'blonde', 'auburn', 'red', 'gray', 'white'];
        $scope.roleSizes = ['small', 'large', 'any size'];
        $scope.yesorno = ['yes', 'no'];

        const ipc = require('electron').ipcRenderer;
        const configTemp = require('../configTemplate.js');

        $scope.user = angular.extend({}, configTemp.user);

        $scope.loggedIn = false;
        $scope.admin = false;

        $scope.logout = _=> {
            ipc.send('userLogout');
        }

        ipc.on('adminLogin', (event, userDatabase) => {
            $scope.admin = true;
            $scope.userDatabase = userDatabase;
            console.log('admin logged in!');
        });

        ipc.on('userLogin', _=> {
            $scope.loggedIn = true;
            // ipc.send('userLogin');
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

        $scope.adminEditUser = user => {
            console.log('user: ', user);
        }

        $scope.adminRemoveUser = user => {
            ipc.send('removeUser', user);
            delete $scope.userDatabase[user.key];
        }

        $scope.addGuardian = _=> {
            let newGuardian = angular.extend({}, configTemp.guardian);
            $scope.user.guardians.push(newGuardian);
        }

        $scope.removeGuardian = index => {
            console.log(index)
            $scope.user.guardians.splice(index, 1);
        }

        let eventTimeout;
        function eventBuffer(delay, event, d1, d2, d3) {
            $timeout.cancel(eventTimeout);
            eventTimeout = $timeout(_=> {
                ipc.send(event, d1, d2, d3);
            }, delay);
        }

        $scope.updateUser = _=> {
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

        $scope.$watchCollection('user.name', username => {
            eventBuffer(500, 'updateUser', 'user');
        });

        $scope.$watchCollection('user.guardians', username => {
            eventBuffer(500, 'updateUser', 'user');
        });


        $scope.phoneNumberFormat = (number) => {
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
    module.exports.user = $scope.user;
}]);
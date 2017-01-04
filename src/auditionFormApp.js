'use strict';

angular.module('AuditionFormApp', ['ngMaterial'])

    .controller('MainCtrl', ['$scope', '$document', '$timeout', '$log', function ($scope, $document, $timeout, $log){
        $scope.formHeading = 'Audition Signup Form';
        $scope.hairLengths = ['short', 'medium', 'long'];
        $scope.hairColors = ['black', 'brown', 'blonde', 'auburn', 'red', 'gray', 'white'];
        $scope.roleSizes = ['small', 'large', 'any size'];
        $scope.yesorno = ['yes', 'no'];

        const ipc = require('electron').ipcRenderer;

        $scope.user = {
            name: {
                first: '',
                last: ''
            },
            birthdate: '',
            age: '',
            height: '',
            weight: '',
            hairLength: '',
            hairColor: '',
            roleSizes: '',
            homePhone: '',
            alternatePhone: ''
        };

        let eventTimeout;
        function eventBuffer(key, val, delay) {
            $timeout.cancel(eventTimeout);
            eventTimeout = $timeout(_=> {
                
            }, delay);
        }

        $scope.$watchCollection('user', (newObj, oldObj) => {
            let key;
            for (key in newObj) {
                if (newObj[key] !== oldObj[key] && key !== 'birthdate') {
                    ipc.send('updateUser', key, newObj[key]);
                }
            }
        });

        $scope.$watchCollection('user.name', username => {
            // typeBuffer(username);
        });

        ipc.on('userHistorySend', (event, history) => {
            console.log('Angular Found: ');
            for (let item in history) {
                if (item !== 'name' && item !== 'birthdate') {
                    $scope.user[item] = history[item];
                }
            }
        });

        $scope.phoneNumberFormat = (phone) => {
            let number = $scope.user[phone].match(/[\d+.+]/g);
            if (number) {
                if (number.length === 10) {
                let phonenumber = number.join('').replace(/(\d{3})(\d{3})(\d{4})/g, (match, area, pre, suff) => {
                    return `(${area}) ${pre}-${suff}`;
                });
                    $scope.user[phone] = phonenumber;
                    $log.log(phonenumber);
                }
            }
        }
    module.exports.user = $scope.user;
}]);
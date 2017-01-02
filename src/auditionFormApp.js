'use strict';

angular.module('AuditionFormApp', ['ngMaterial'])

    .controller('MainCtrl', ['$scope', '$timeout', '$log', function ($scope, $timeout, $log){
        $scope.formHeading = 'Audition Signup Form';
        $scope.hairLengths = ['short', 'medium', 'long'];
        $scope.hairColors = ['black', 'brown', 'blonde', 'auburn', 'red', 'gray', 'white'];
        $scope.roleSizes = ['small', 'large', 'any size'];
        $scope.yesorno = ['yes', 'no'];

        $scope.user = {
            name: {
                first: null,
                last: null
            },
            birthdate: null,
            age: null,
            hairLength: null,
            hairColor: null,
            roleSizes: null,
            homePhone: '',
            alternatePhone: ''
        };

        let typeTimeout;
        function typeBuffer(obj) {
            $timeout.cancel(typeTimeout);
            typeTimeout = $timeout(_=> {
                $log.log($scope.user);
            }, 1000);
        }

        $scope.$watchCollection('user', user => {
            typeBuffer(user);
        });

        $scope.$watchCollection('user.name', username => {
            typeBuffer(username);
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
}]);
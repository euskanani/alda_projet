app.directive('myAlert', function($timeout){
  return {
    scope: {
      message: '@',
      isVisible: '='
    },
    link: link,
    restrict: 'E',
    replace: true,
    template: '<div ng-if="isVisible" class="alert">{{message}}</div>'
  }
  
  function link(scope, element, attrs){
    scope.isVisible = true;
    
    $timeout(function (){
            scope.isVisible = false;
            }, 5000);
    
  }
});
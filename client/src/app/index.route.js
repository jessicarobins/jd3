export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('login', {
      url: '/login',
      template: '<login-page></login-page>'
    })
    .state('signUp', {
      url: '/sign_up',
      template: '<signup></signup>'
    })
    .state('home', {
      url: '/',
      template: '<spec-pane layout="column" layout-fill></spec-pane>',
      resolve: {
        auth: ['$auth', function($auth) {
          return $auth.validateUser();
        }]
      }
    })
    .state('manage', {
      url: '/manage',
      template: '<p>manage stuff here</p>',
      resolve: {
        auth: ['$auth', function($auth) {
          return $auth.validateUser();
        }]
      }
    });

  $urlRouterProvider.otherwise('/');
}

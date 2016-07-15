var module = angular.module('jessdocs');
module.component('main', {
    transclude: {
        'content': 'mainContent'
    },
    templateUrl: 'app/components/main/main.template.html',
    controller: function(
        $anchorScroll,
        $auth,
        $location,
        $q,
        $api,
        $projects,
        $specs) {
       var self = this;
       self.$onInit = function(){
           
            var promises = {
                tickets: $api.request({url: '/tickets'}),
                tags: $api.request({url: '/tags'})
            };
            
            $q.all(promises).then( function(response) {
                self.tickets = response.tickets;
                self.tags = response.tags;
                
                $specs.setSpecList();
                
            });
            
            $projects.getProjects();
       };
       
       
    }
});
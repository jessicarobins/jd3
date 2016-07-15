module.component('spec', {
    require: {
        parent: '^^specs'
    },
    bindings: {
        spec: '<',
        uiTreeCallbacks: '=',
        tag: '<',
        ticket: '<'
    },
    templateUrl: 'app/components/main/spec-pane/specs/spec/spec.template.html',
    controller: function(
        $scope, 
        $http,
        $anchorScroll,
        $location,
        $tagtypes, 
        BreadcrumbsService, 
        $specs) {
            
       var self = this;
       
       $scope.$callbacks = self.uiTreeCallbacks;
       
        self.openSpecMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };
       
        self.toggleEditButtons = function(spec) {
            spec.userMouseover=false;
            //previously edited spec
            var editingSpec = self.parent.getEditingSpec();
            spec.showEditButtons = !spec.showEditButtons;
            //if we are turning editing on for this spec
            if (spec.showEditButtons) {
                toggleEditOn(spec, editingSpec);
            }
            //if we are turning editing off for this spec
            //that means we clicked the checkmark
            else {
                toggleEditOff(spec, editingSpec.copy);
                self.parent.setEditingSpec(null);
            }
        
        };
        
        self.toggleAddChildren = function(spec) {
            spec.addChildren = true;
            spec.showEditButtons = false;
            
            $location.hash('addChildren');
            $anchorScroll();
        };
        
        self.toggleExport = function() {
            self.parent.toggleExport(self.spec);
        };
        
        function toggleEditOn(spec, editingSpec){
            if(editingSpec && editingSpec.spec && !angular.equals(editingSpec.spec, spec)){
                editingSpec.spec.showEditButtons = false;
                toggleEditOff(editingSpec.spec, editingSpec.copy);
                self.cancelAdd(editingSpec.spec);
            }
            self.parent.setEditingSpec(spec);
            self.getAvailableTagTypes(spec);
        }
        
        function toggleEditOff(spec, copy){
            //if spec has changed, change in db
            if(!angular.equals(spec.description, copy.description)){
                $http({
                    url: '/specs/' + spec.id, 
                    method: "PUT",
                    data: {
                        id: spec.id,
                        spec: {
                            description: spec.description
                        }}
                }).
                then(function (response) {
                    console.log(response.data);
                });
            }
        }
        
        self.getAvailableTagTypes = function(spec){
            $tagtypes.getTagTypes().then( function(response){
              spec.tagtypes = response.data;  
            });
        };
        
        self.setBreadCrumbs = function(spec) {
            BreadcrumbsService.setBreadcrumbs(spec.id);
            var params = {spec_id: spec.id};
            
            $specs.setSpecList(params);
        };
        
    }
});
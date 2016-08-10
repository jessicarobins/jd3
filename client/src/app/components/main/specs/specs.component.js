module.component('specs', {
    require: {
        parent: '^^main'
    },
     templateUrl: 'app/components/main/specs/specs.template.html',
     controller: function(
        $anchorScroll,
        $location,
        $q, 
        $scope, 
        $api,
        $specs,
        MenuService) {
        var self = this;
        
        self.export = false;
        self.exportSpecs = [];
        
        self.dragging = false;
        
        self.treeOpts = {
            beforeDrop : function (e) {
                return true;
            },
            beforeDrag: function(sourceNodeScope){
                self.dragging = true;
                return true;
            },
            dropped: function(e){
                console.log('drag event', e)
                parseMove(e);
                //spec id: e.source.nodeScope.$modelValue.id
                //need parent
                //parent spec id: e.dest.nodeScope.$parent.$ctrl.spec.id)
                //need prev sibling
                //dropped index (relative to parent):
                //e.dest.index
                //value of previous sibling
                //e.dest.nodeScope.$modelValue[index-1].id
                return true;
            }
        };
        
        function parseMove(e){
            self.dragging = false;  
            var specId = e.source.nodeScope.$modelValue.data.id;
            var newIndex = e.dest.index;
            var siblingId;
            if(newIndex > 0){
                siblingId = e.dest.nodesScope.$modelValue[newIndex-1].data.id;
            }
            var parentId = null;
            if(e.dest.nodesScope.$parent.$ctrl.spec.data){
                parentId = e.dest.nodesScope.$parent.$ctrl.spec.data.id;
            }
            
            $specs.move(specId, parentId, siblingId);
        }
        
        self.toggleExport = function(spec){
            var id = spec.data.id;
            var idx = self.exportSpecs.indexOf(id);
            
            if (idx > -1) {
                recursiveCheck(spec, false);
            }
            else {
                recursiveCheck(spec, true);
            }
        };
        
        function recursiveCheck(spec, checked){
            spec.exported = checked;
            var id = spec.data.id;
            var idx = self.exportSpecs.indexOf(id);
            if (idx <= -1 && checked) {
                //if already in array, don't add twice
                self.exportSpecs.push(id);
            }
            else if (idx > -1 && !checked){
                self.exportSpecs.splice(idx, 1);
            }
            
            spec.children.forEach( function(child){
                recursiveCheck(child, checked); 
            });
            
        }
        
       self.$onInit = function(){
           
           MenuService.addCallback( function(){
                self.addChildren = MenuService.addChildren;
                $location.hash('bottom');
                $anchorScroll();
           });
           
           MenuService.addExportCallback( function(){
               self.export = MenuService.export;
               if( self.export === false ){
                   MenuService.exportSpecs = self.exportSpecs;
                   self.exportSpecs = [];
               }
           });
           
           self.spec = $specs.specs;
           $specs.addCallback(function callback() {
                self.spec = $specs.specs;
            });
            
       };
       
     }
});
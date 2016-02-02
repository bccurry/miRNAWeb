class ResultSection implements angular.IDirective {

    restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
    scope = {
        //@ reads the attribute value, = provides two-way binding, & works with functions
        resultList: '=',
        percentageFinished: '='
    };

    templateUrl = 'Angular/Templates/ResultSection.html';

    link = (scope) => {

//        scope.cy = cytoscape({
//            container: document.getElementById('cy'),
//
//            style: [{ "selector": "core", "style": { "selection-box-color": "#AAD8FF", "selection-box-border-color": "#8BB0D0", "selection-box-opacity": "0.5" } }, { "selector": "node", "style": { "width": "mapData(score, 0, 0.006769776522008331, 20, 60)", "height": "mapData(score, 0, 0.006769776522008331, 20, 60)", "content": "data(name)", "font-size": "12px", "text-valign": "center", "text-halign": "center", "background-color": "#555", "text-outline-color": "#555", "text-outline-width": "2px", "color": "#fff", "overlay-padding": "6px", "z-index": "10" } }, { "selector": "node[?attr]", "style": { "shape": "rectangle", "background-color": "#aaa", "text-outline-color": "#aaa", "width": "16px", "height": "16px", "font-size": "6px", "z-index": "1" } }, { "selector": "node[?query]", "style": { "background-clip": "none", "background-fit": "contain" } }, { "selector": "node:selected", "style": { "border-width": "6px", "border-color": "#AAD8FF", "border-opacity": "0.5", "background-color": "#77828C", "text-outline-color": "#77828C" } }, { "selector": "edge", "style": { "curve-style": "haystack", "haystack-radius": "0.5", "opacity": "0.4", "line-color": "#bbb", "width": "mapData(weight, 0, 1, 1, 8)", "overlay-padding": "3px" } }, { "selector": "node.unhighlighted", "style": { "opacity": "0.2" } }, { "selector": "edge.unhighlighted", "style": { "opacity": "0.05" } }, { "selector": ".highlighted", "style": { "z-index": "999999" } }, { "selector": "node.highlighted", "style": { "border-width": "6px", "border-color": "#AAD8FF", "border-opacity": "0.5", "background-color": "#394855", "text-outline-color": "#394855", "shadow-blur": "12px", "shadow-color": "#000", "shadow-opacity": "0.8", "shadow-offset-x": "0px", "shadow-offset-y": "4px" } }, { "selector": "edge.filtered", "style": { "opacity": "0" } }, { "selector": "edge[group=\"coexp\"]", "style": { "line-color": "#d0b7d5" } }, { "selector": "edge[group=\"coloc\"]", "style": { "line-color": "#a0b3dc" } }, { "selector": "edge[group=\"gi\"]", "style": { "line-color": "#90e190" } }, { "selector": "edge[group=\"path\"]", "style": { "line-color": "#9bd8de" } }, { "selector": "edge[group=\"pi\"]", "style": { "line-color": "#eaa2a2" } }, { "selector": "edge[group=\"predict\"]", "style": { "line-color": "#f6c384" } }, { "selector": "edge[group=\"spd\"]", "style": { "line-color": "#dad4a2" } }, { "selector": "edge[group=\"spd_attr\"]", "style": { "line-color": "#D0D0D0" } }, { "selector": "edge[group=\"reg\"]", "style": { "line-color": "#D0D0D0" } }, { "selector": "edge[group=\"reg_attr\"]", "style": { "line-color": "#D0D0D0" } }, { "selector": "edge[group=\"user\"]", "style": { "line-color": "#f0ec86" } }],
//            elements: scope.mydata
//        });
       
        scope.$watch("resultList.TermResultTerms", (newVal) => {
            if (newVal) {
                scope.gridClass = "col-md-6";
            }
        }, true);

        scope.gridClass = "";
        scope.gridOptionsMirna = {};
        scope.gridOptionsMirna.data = 'resultList.MirnaResultTerms';
        scope.gridOptionsMirna.columnDefs = [
            { name: 'Name', displayName: 'MiRNA' },
            { name: 'IsActive', displayName: 'Active', type: 'boolean', cellTemplate: '<input type="checkbox" ng-model="row.entity.IsActive" ng-change="grid.appScope.addOrRemoveNode(row.entity)">' }
        ];

        scope.gridOptionsTerm = {};
        scope.gridOptionsTerm.data = 'resultList.TermResultTerms';
        scope.gridOptionsTerm.columnDefs = [
            { name: 'Name', displayName: 'Term' },
            { name: 'IsActive', displayName: 'Active', type: 'boolean', cellTemplate: '<input type="checkbox" ng-model="row.entity.IsActive" ng-change="grid.appScope.addOrRemoveNode(row.entity)">' }
        ];

        scope.cy = cytoscape({
            container: document.getElementById('cy'),

            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'font-size': 10,
                    'content': 'data(name)',
                    'text-valign': 'center',
                    'color': 'white',
                    'text-outline-width': 2,
                    'text-outline-color': '#888',
                    'min-zoomed-font-size': 8,
                    'width': 'mapData(score, 0, 1, 20, 50)',
                    'height': 'mapData(score, 0, 1, 20, 50)'
                })
                .selector('node[node_type = "query"]')
                .css({
                    'background-color': '#666',
                    'text-outline-color': '#666'
                })
                .selector('node:selected')
                .css({
                    'background-color': '#000',
                    'text-outline-color': '#000'
                })
                .selector('edge')
                .css({
                    'curve-style': 'haystack',
                    'opacity': 0.75,
                    'width': '2'
                })
                .selector('edge[data_type = "Predicted"]')
                .css({
                    'line-color': '#F6C28C'
                })
                .selector('edge[data_type = "Physical interactions"]')
                .css({
                    'line-color': '#EAA2A3'
                })
                .selector('edge[data_type = "Shared protein domains"]')
                .css({
                    'line-color': '#DAD4A8'
                })
                .selector('edge[data_type = "Co-expression"]')
                .css({
                    'line-color': '#D0B7D3'
                })
                .selector('edge[data_type = "Pathway"]')
                .css({
                    'line-color': '#9BD8DD'
                })
                .selector('edge[data_type = "Co-localization"]')
                .css({
                    'line-color': '#A0B3D8'
                })
                .selector('edge:selected')
                .css({
                    opacity: 1
                }),

            elements: []

        });

        scope.addOrRemoveNode = (rowEntity) => {
            console.log(rowEntity.$$hashKey);
            if (rowEntity.IsActive) {
                scope.addNode(rowEntity);
                scope.addEdge(rowEntity);
            } else {
                scope.removeNode(rowEntity);
            }
        };

        scope.addNode = (rowEntity) => {
            scope.cy.add({
                data: { "id": rowEntity.$$hashKey, "name": rowEntity.Name, "score": rowEntity.Value, "query": true, "gene": true },
                position: { "x": Math.floor((Math.random() * 400) + 1), "y": Math.floor((Math.random() * 400) + 1) },
                group: "nodes"
            }); 
        };

        scope.removeNode = (rowEntity) => {
            scope.cy.remove(scope.cy.getElementById(rowEntity.$$hashKey));
        };

        scope.addEdge = (rowEntity) => {
            angular.forEach(scope.cy.nodes(), (obj, idx) => {
                var currentNode = obj.data();
                if (rowEntity.$$hashKey !== currentNode.id) {
                    if (Math.abs(rowEntity.Value - currentNode.score) <= 0.2) {

                        var tmpCombinedId = rowEntity.$$hashKey + currentNode.id;

                        scope.cy.add({
                            "data": {
                                "source": rowEntity.$$hashKey,
                                "target": currentNode.id,
                                "weight": 0.5,
                                "group": "Predicted",
//                                "intn": true,
//                                "rIntnId": tmpCombinedID,
                                "id": tmpCombinedId
                            },
                            "position": {},
                            "group": "edges"
//                            "selected": false,
//                            "classes": ""
                        });
                    }
                }
            });
        }

    }
}

app.directive('resultSection', [() => { return new ResultSection(); }]);
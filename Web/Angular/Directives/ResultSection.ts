class ResultSection implements angular.IDirective {
    private searchSvc: ISearchSvc;
    private $sce;
    constructor(searchSvc, $sce) {
        this.searchSvc = searchSvc;
        this.$sce = $sce;
    }

    restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
    scope = {
        //@ reads the attribute value, = provides two-way binding, & works with functions
        resultList: '=',
        isProcessing: '='
    };

    templateUrl = 'Angular/Templates/ResultSection.html';

    link = (scope) => {

        scope.$watch("isProcessing", (newVal) => {         
            if (newVal === true) {
                scope.clearGraph();
                scope.abstractComponent = null;
            } else {
                if (scope.resultList.TermResultTerms) {
                    scope.gridClass = "col-md-6";
                } else {
                    scope.gridClass = "";
                }
            }
        });

        scope.abstractSectionClass = "panel-body";
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
//                    'width': 'mapData(score, 0, 1, 20, 50)',
//                    'height': 'mapData(score, 0, 1, 20, 50)'
                })
                .selector('node[type = "miRNA"]')
                .css({
                    'background-color': '#EE2C2C',
                    'text-outline-color': '#EE2C2C',
                    'shape': 'ellipse',
                    'width': '60px',
                    'height': '30px'
                })
                .selector('node[type = "term"]')
                .css({
                    'background-color': '#FFD700',
                    'text-outline-color': '#FFD700',
                    'shape': 'rectangle',
                    'width': '60px',
                    'height': '30px'
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
                data: { "id": rowEntity.$$hashKey, "name": rowEntity.Name, "score": rowEntity.Value, "type": rowEntity.Type, "query": true, "gene": true },
                position: { "x": Math.floor((Math.random() * 400) + 1), "y": Math.floor((Math.random() * 400) + 1) },
                group: "nodes"
            }); 
        };

        scope.removeNode = (rowEntity) => {
            scope.cy.remove(scope.cy.getElementById(rowEntity.$$hashKey));
        };

        scope.addEdge = (rowEntity) => {
            console.log(rowEntity.Value + " " + rowEntity.Type);
            angular.forEach(scope.cy.nodes(), (obj, idx) => {
                var currentNode = obj.data();
                if (rowEntity.$$hashKey !== currentNode.id) {
                    if (rowEntity.Value >= 0.4 && currentNode.score >= 0.4) {
                        
                        if (!(rowEntity.Type === "term" && currentNode.type === "term")) {
                            var tmpCombinedId = rowEntity.$$hashKey + currentNode.id;

                            scope.cy.add({
                                "data": {
                                    "source": rowEntity.$$hashKey,
                                    "target": currentNode.id,
                                    "weight": 0.5,
                                    "group": "Predicted",
                                    "id": tmpCombinedId
                                },
                                "position": {},
                                "group": "edges"
                            });
                        }                    
                    }
                }
            });
        }

        scope.retrieveAbstracts = () => {
            scope.abstractComponent = null;
            var selectedNodes = scope.cy.$("node:selected");
            console.log(selectedNodes);
            if (selectedNodes.length > 0) {
                var requestEnumerable = [];
                angular.forEach(selectedNodes, (value, key) => {
                    requestEnumerable.push(value._private.data.name);
                });

                this.searchSvc.retrieveAbstracts(requestEnumerable).then((result) => {

                    scope.abstractComponent = result.data ? this.$sce.trustAsHtml(result.data) :
                        this.$sce.trustAsHtml("<div class=\"centered\"><b>No common abstracts for the selected miRNAs found</b></div>");

                    scope.abstractSectionClass = result.data ? "panel-body scroll-vertical" : "panel-body";
                });
            } else {
                scope.abstractComponent = this.$sce.trustAsHtml("<div class=\"centered\"><b>No miRNAs selected</b></div>");
                scope.abstractSectionClass = "panel-body";
            }        
        }

        scope.clearGraph = () => {
            scope.cy.remove("*");
        };
    }
}

app.directive('resultSection', ['searchSvc', '$sce', (searchSvc, $sce) => { return new ResultSection(searchSvc, $sce); }]);
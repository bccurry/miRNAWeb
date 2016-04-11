class ResultSection implements angular.IDirective {
    private searchSvc: ISearchSvc;
    private $sce;
    private $timeout;
    constructor(searchSvc, $sce, $timeout) {
        this.searchSvc = searchSvc;
        this.$sce = $sce;
        this.$timeout = $timeout;
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
                scope.logEntropyComponent = null;
            } else {
                if (scope.resultList.TermResultTerms) {
                    scope.gridClass = "col-md-6";
                } else {
                    scope.gridClass = "";
                }
                this.$timeout(() => {
                    scope.initNetwork();
                }, 3000);
               
            }
        });

        scope.abstractSectionClass = "panel-body";
        scope.gridClass = "";
        scope.gridOptionsMirna = {};
        scope.gridOptionsMirna.data = 'resultList.MirnaResultTerms';
        scope.gridOptionsMirna.columnDefs = [
            {
                name: 'Name',
                displayName: 'MiRNA',
                cellClass: (grid, row, col, rowRenderIndex, colRenderIndex) => {
                    if (grid.getCellValue(row, col).indexOf('span') > -1) {
                        return 'italics';
                    }
                    return '';
                },
                cellTemplate: '<div class="ui-grid-cell-contents"><input type="checkbox" ng-model="row.entity.IsActive" ng-change="grid.appScope.addOrRemoveNode(row.entity)"> <a ng-href="http://www.mirbase.org/cgi-bin/mirna_entry.pl?acc={{row.entity.Accession}}" target="_blank" ng-bind-html="row.entity[col.field]"></a></div>'
            }, 
            { name: 'Value', displayName: 'Score'}
        ];

        scope.gridOptionsTerm = {};
        scope.gridOptionsTerm.data = 'resultList.TermResultTerms';
        scope.gridOptionsTerm.columnDefs = [
            {
                name: 'Name',
                displayName: 'Term',
                cellClass: (grid, row, col, rowRenderIndex, colRenderIndex) => {
                    if (grid.getCellValue(row, col).indexOf('font-style') > -1) {
                        return 'italics';
                    }
                    return '';
                },
                cellTemplate: '<div class="ui-grid-cell-contents"><input type="checkbox" ng-model="row.entity.IsActive" ng-change="grid.appScope.addOrRemoveNode(row.entity)"><span ng-bind-html="row.entity[col.field]"></span></div>'
            },
            { name: 'Value', displayName: 'Score' }
        ];

        scope.gridOptionsLogEntropy = {};
        scope.gridOptionsLogEntropy.data = 'logEntropyComponent';
        scope.gridOptionsLogEntropy.columnDefs = [
            {
                name: 'LogEntropyTerm',
                displayName: 'Term',
                cellClass: (grid, row, col, rowRenderIndex, colRenderIndex) => {
                    if (grid.getCellValue(row, col).indexOf('span') > -1) {
                        return 'green';
                    }
                    return '';
                },
                cellTemplate: '<div class="ui-grid-cell-contents" ng-bind-html="row.entity[col.field]"></div>'
            }    
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
                    'min-zoomed-font-size': 8
                })
                .selector('node[type = "miRNA"]')
                .css({
                    'background-color': '#EE2C2C',
                    'text-outline-color': '#000000',
                    'shape': 'ellipse',
                    'width': '60px',
                    'height': '30px'
                })
                .selector('node[type = "term"]')
                .css({
                    'background-color': '#FFD700',
                    'text-outline-color': '#000000',
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
            if (rowEntity.IsActive) {
                scope.addNode(rowEntity);
                scope.addEdge(rowEntity);
            } else {
                scope.removeNode(rowEntity);
            }

            scope.getNetworkCount();
        };

        scope.addNode = (rowEntity) => {
            scope.cy.add({
                data: { "id": rowEntity.$$hashKey, "name": rowEntity.Description, "score": rowEntity.Value, "type": rowEntity.Type, "query": true, "gene": true },
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
            if (selectedNodes.length > 0) {
                var request = {
                    MirnaEnumerable: [],
                    TermEnumerable: []
                };
                angular.forEach(selectedNodes, (value, key) => {
                    if (value._private.data.type === 'miRNA') {
                        request.MirnaEnumerable.push(value._private.data.name);
                    } else {
                        request.TermEnumerable.push(value._private.data.name);
                    }
                });

                this.searchSvc.retrieveAbstracts(request).then((result) => {
                    scope.abstractComponent = result.data.Abstracts ? this.$sce.trustAsHtml(result.data.Abstracts) :
                        this.$sce.trustAsHtml("<div class=\"centered\"><b>No common abstracts for the selected miRNAs found</b></div>");

                    scope.abstractSectionClass = result.data.Abstracts ? "panel-body scroll-vertical" : "panel-body";
                    scope.abstractCount = result.data.Abstracts ? result.data.Count : null;
                });
            } else {
                scope.abstractComponent = this.$sce.trustAsHtml("<div class=\"centered\"><b>No miRNAs selected</b></div>");
                scope.abstractSectionClass = "panel-body";
                scope.abstractCount = null;
            }        
        }

        scope.clearGraph = () => {
            scope.cy.remove("*");
        };

        scope.retrieveLogEntropys = () => {
            scope.logEntropyComponent = [];
            console.log(scope.logEntropyComponent);
            var selectedNodes = scope.cy.$("node:selected");
            if (selectedNodes.length > 0) {
              
                var request = {
                    MirnaEnumerable: [],
                    TermEnumerable: []
                };
                angular.forEach(selectedNodes, (value, key) => {
                    if (value._private.data.type === 'miRNA') {
                        request.MirnaEnumerable.push(value._private.data.name);
                    } else {
                        request.TermEnumerable.push(value._private.data.name);
                    }
                });

                this.searchSvc.retrieveLogEntropys(request).then((result) => {
                    scope.logEntropyComponent = result.data.LogEntropys;
                    scope.logEntropyCount = result.data.Count;

                    var tempThis = this;
                    scope.logEntropyComponent.forEach((d) => {
                        tempThis.$sce.trustAsHtml(d.LogEntropyTerm);
                    });

                });
            } else {
                scope.logEntropyComponent = null;
                scope.logEntropyCount = null;
            }
        };

        scope.initNetwork = () => {

            angular.forEach(scope.resultList.MirnaResultTerms, (obj, idx) => {
                
                if (idx < 5) {
                    obj.IsActive = true;
                    scope.addNode(obj);
                    scope.addEdge(obj);
                }
            });

            angular.forEach(scope.resultList.TermResultTerms, (obj, idx) => {

                if (idx < 5) {
                    obj.IsActive = true;
                    scope.addNode(obj);
                    scope.addEdge(obj);
                }
            });

            scope.getNetworkCount();
        };

        scope.getNetworkCount = () => {
            scope.mirnaNodeCount = 0;
            scope.termNodeCount = 0;

            angular.forEach(scope.resultList.MirnaResultTerms, (obj, idx) => {
                if (obj.IsActive === true) {
                    scope.mirnaNodeCount += 1;
                }
            });

            angular.forEach(scope.resultList.TermResultTerms, (obj, idx) => {
                if (obj.IsActive === true) {
                    scope.termNodeCount += 1;
                }
            });

            scope.edgeCount = scope.cy.edges().length;
        };

    }
}

app.directive('resultSection', ['searchSvc', '$sce', '$timeout', (searchSvc, $sce, $timeout) => { return new ResultSection(searchSvc, $sce, $timeout); }]);
var ResultSection = (function () {
    function ResultSection(searchSvc, $sce, $timeout) {
        var _this = this;
        this.restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
        this.scope = {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            resultList: '=',
            isProcessing: '='
        };
        this.templateUrl = 'Angular/Templates/ResultSection.html';
        this.link = function (scope) {
            scope.$watch("isProcessing", function (newVal) {
                if (newVal === true) {
                    scope.clearGraph();
                    scope.abstractComponent = null;
                    scope.logEntropyComponent = null;
                }
                else {
                    if (scope.resultList.TermResultTerms) {
                        scope.gridClass = "col-md-6";
                    }
                    else {
                        scope.gridClass = "";
                    }
                    _this.$timeout(function () {
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
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (grid.getCellValue(row, col).indexOf('span') > -1) {
                            return 'italics';
                        }
                        return '';
                    },
                    cellTemplate: '<div class="ui-grid-cell-contents"><input type="checkbox" ng-model="row.entity.IsActive" ng-change="grid.appScope.addOrRemoveNode(row.entity)"> <a ng-href="http://www.mirbase.org/cgi-bin/mirna_entry.pl?acc={{row.entity.Accession}}" target="_blank" ng-bind-html="row.entity[col.field]"></a></div>'
                },
                { name: 'Value', displayName: 'Score' }
            ];
            scope.gridOptionsTerm = {};
            scope.gridOptionsTerm.data = 'resultList.TermResultTerms';
            scope.gridOptionsTerm.columnDefs = [
                {
                    name: 'Name',
                    displayName: 'Term',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
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
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
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
            scope.addOrRemoveNode = function (rowEntity) {
                if (rowEntity.IsActive) {
                    scope.addNode(rowEntity);
                    scope.addEdge(rowEntity);
                }
                else {
                    scope.removeNode(rowEntity);
                }
                scope.getNetworkCount();
            };
            scope.addNode = function (rowEntity) {
                scope.cy.add({
                    data: { "id": rowEntity.$$hashKey, "name": rowEntity.Description, "score": rowEntity.Value, "type": rowEntity.Type, "query": true, "gene": true },
                    position: { "x": Math.floor((Math.random() * 400) + 1), "y": Math.floor((Math.random() * 400) + 1) },
                    group: "nodes"
                });
            };
            scope.removeNode = function (rowEntity) {
                scope.cy.remove(scope.cy.getElementById(rowEntity.$$hashKey));
            };
            scope.addEdge = function (rowEntity) {
                angular.forEach(scope.cy.nodes(), function (obj, idx) {
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
            };
            scope.retrieveAbstracts = function () {
                scope.abstractComponent = null;
                var selectedNodes = scope.cy.$("node:selected");
                if (selectedNodes.length > 0) {
                    var request = {
                        MirnaEnumerable: [],
                        TermEnumerable: []
                    };
                    angular.forEach(selectedNodes, function (value, key) {
                        if (value._private.data.type === 'miRNA') {
                            request.MirnaEnumerable.push(value._private.data.name);
                        }
                        else {
                            request.TermEnumerable.push(value._private.data.name);
                        }
                    });
                    _this.searchSvc.retrieveAbstracts(request).then(function (result) {
                        scope.abstractComponent = result.data.Abstracts ? _this.$sce.trustAsHtml(result.data.Abstracts) :
                            _this.$sce.trustAsHtml("<div class=\"centered\"><b>No common abstracts for the selected miRNAs found</b></div>");
                        scope.abstractSectionClass = result.data.Abstracts ? "panel-body scroll-vertical" : "panel-body";
                        scope.abstractCount = result.data.Abstracts ? result.data.Count : null;
                    });
                }
                else {
                    scope.abstractComponent = _this.$sce.trustAsHtml("<div class=\"centered\"><b>No miRNAs selected</b></div>");
                    scope.abstractSectionClass = "panel-body";
                    scope.abstractCount = null;
                }
            };
            scope.clearGraph = function () {
                scope.cy.remove("*");
            };
            scope.retrieveLogEntropys = function () {
                scope.logEntropyComponent = [];
                console.log(scope.logEntropyComponent);
                var selectedNodes = scope.cy.$("node:selected");
                if (selectedNodes.length > 0) {
                    var request = {
                        MirnaEnumerable: [],
                        TermEnumerable: []
                    };
                    angular.forEach(selectedNodes, function (value, key) {
                        if (value._private.data.type === 'miRNA') {
                            request.MirnaEnumerable.push(value._private.data.name);
                        }
                        else {
                            request.TermEnumerable.push(value._private.data.name);
                        }
                    });
                    _this.searchSvc.retrieveLogEntropys(request).then(function (result) {
                        scope.logEntropyComponent = result.data.LogEntropys;
                        scope.logEntropyCount = result.data.Count;
                        var tempThis = _this;
                        scope.logEntropyComponent.forEach(function (d) {
                            tempThis.$sce.trustAsHtml(d.LogEntropyTerm);
                        });
                    });
                }
                else {
                    scope.logEntropyComponent = null;
                    scope.logEntropyCount = null;
                }
            };
            scope.initNetwork = function () {
                angular.forEach(scope.resultList.MirnaResultTerms, function (obj, idx) {
                    if (idx < 5) {
                        obj.IsActive = true;
                        scope.addNode(obj);
                        scope.addEdge(obj);
                    }
                });
                angular.forEach(scope.resultList.TermResultTerms, function (obj, idx) {
                    if (idx < 5) {
                        obj.IsActive = true;
                        scope.addNode(obj);
                        scope.addEdge(obj);
                    }
                });
                scope.getNetworkCount();
            };
            scope.getNetworkCount = function () {
                scope.mirnaNodeCount = 0;
                scope.termNodeCount = 0;
                angular.forEach(scope.resultList.MirnaResultTerms, function (obj, idx) {
                    if (obj.IsActive === true) {
                        scope.mirnaNodeCount += 1;
                    }
                });
                angular.forEach(scope.resultList.TermResultTerms, function (obj, idx) {
                    if (obj.IsActive === true) {
                        scope.termNodeCount += 1;
                    }
                });
                scope.edgeCount = scope.cy.edges().length;
            };
        };
        this.searchSvc = searchSvc;
        this.$sce = $sce;
        this.$timeout = $timeout;
    }
    return ResultSection;
})();
app.directive('resultSection', ['searchSvc', '$sce', '$timeout', function (searchSvc, $sce, $timeout) { return new ResultSection(searchSvc, $sce, $timeout); }]);
//# sourceMappingURL=ResultSection.js.map
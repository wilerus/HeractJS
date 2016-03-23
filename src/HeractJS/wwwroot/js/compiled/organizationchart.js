define('js/widget/graph/views/orgchart/OrgchartDataModel',['module/userModules'], function () {
    window.OrgchartDataModel = {
        build: function (cfg) {
            $.extend(this, cfg);
            this.buildData();
        },

        getData: function () {
            return this.data;
        },

        setData: function (data) {
            this.data = data;
        },

        buildData: function () {
            var self = this;
            this.rootId = 0;
            this.graph.edges = {};
            this.unassignedManagers = [];
            this.indexId = 0;

            this.graph.nodes = [{
                FullName: Localizer.get('PROJECT.PEOPLE.ORGCHARTTAB.COMPANY'),
                indexId: this.indexId++,
                id: this.rootId
            }];

            $.each(this.data, function (i, it) {
                it.indexId = self.indexId++;

                if (it.Manager) {
                    self.graph.nodes.push(it);
                    if (!self.graph.edges[it.Manager]) {
                        self.graph.edges[it.Manager] = [];
                    }
                    self.graph.edges[it.Manager].push(it.id);
                } else if (it.PresentedOnOrgchart) {
                    self.graph.nodes.push(it);
                    if (!self.graph.edges[self.rootId]) {
                        self.graph.edges[self.rootId] = [];
                    }
                    self.graph.edges[self.rootId].push(it.id);
                } else {
                    if (self.graph.edges[it.id]) {
                        self.graph.nodes.push(it);
                        if (!self.graph.edges[self.rootId]) {
                            self.graph.edges[self.rootId] = [];
                        }
                        self.graph.edges[self.rootId].push(it.id);
                    } else {
                        self.unassignedManagers.push(it);
                    }
                }
            });

            this.removeNonexistentManagers();
            this.graph.controlPanel && this.graph.controlPanel.setData(this.unassignedManagers);
        },

        removeNonexistentManagers: function () {
            var self = this;
            $.each(this.graph.edges, function (id, nodes) {
                var found;
                $.each(self.graph.nodes, function (i, item) {
                    if (id == item.id) {
                        found = true;
                        return false;
                    }
                });
                if (!found) {
                    var childs = self.graph.edges[id];
                    $.each(childs, function (i, child) {
                        self.unassignedManagers.push(self.getNodeById(child));
                        self.removeChildFromNode(child);
                    });
                    delete self.graph.edges[id];
                }
            });
        },

        removeChildFromNode: function (childId) {
            var self = this;
            $.each(this.graph.nodes, function (i, item) {
                if (item.id == childId) {
                    self.graph.nodes.splice(i, 1);
                    return false;
                }
            });
        },

        getUnassignedManagers: function () {
            return this.unassignedManagers;
        },

        getNodeById: function (id) {
            var node = null;
            $.each(this.graph.nodes, function (index, it) {
                if (it.id == id) {
                    node = it;
                    return false;
                }
            });
            return node;
        },

        getRootId: function () {
            return this.rootId;
        }
    };
});

define('js/widget/graph/views/orgchart/OrgchartPoint',['module/userModules'], function () {
    window.OrgchartPoint = function() {
        OrgchartPoint.superclass.constructor.apply(this, arguments);
        this.initPrimitives();
    };

    extend(OrgchartPoint, VPoint);

    OrgchartPoint.prepare = function (graph) {
        var inlineForm = $('#inlineForm');
        inlineForm.tmpl().appendTo(graph.body);
        OrgchartText.inlineFullName = graph.body.children('.inlineFullname');
        OrgchartText.inlineTitle = graph.body.children('.inlineTitle');
        OrgchartText.inlineDepartment = graph.body.children('.inlineDepartment');
    };

    OrgchartPoint.hideEditor = function () {
        OrgchartText.inlineTitle.hide();
        OrgchartText.inlineFullName.hide();
        OrgchartText.inlineDepartment.hide();
    };

    OrgchartPoint.getCenter = function (graph) {
        var width = graph.getWidth() || 1280 * 3;

        return { x: width / 2, y: 50 };
    };

    OrgchartPoint.prototype.initPrimitives = function () {
        this.nodalPoint = Point.create({ type: 'NodalPoint', ipoint: this, graph: this.graph, x: this.x, y: this.y + this.textNode.height / 2 });
        Line.create({ type: 'NodalLine', graph: this.graph, ipoint: this, opoint: this.nodalPoint });
        this.adder = new window[this.graph.typeProject + 'Adder'](this);
        this.info = new window[this.graph.typeProject + 'Info'](this);
        this.collapser = new window[this.graph.typeProject + 'Collapser'](this);
        this.setCoordinate(this.x, this.y);
    };

    OrgchartPoint.prototype.updateNodalPoint = function () {
        this.nodalPoint.x = this.x;
        this.nodalPoint.y = this.y + this.textNode.height / 2;
    };

    OrgchartPoint.prototype.hasCursor = function (x, y) {
        return OrgchartPoint.superclass.hasCursor.call(this, x, y) || this.adder.hasCursor(x, y) || this.info.hasCursor(x, y) || this.collapser.hasCursor(x, y);
    };

    OrgchartPoint.prototype.setCoordinate = function (x, y, fornodal) {
        Point.prototype.setCoordinate.call(this, x, y, fornodal);
    };

    OrgchartPoint.prototype.dblclickHandler = function (x, y) {
        // todo
        var isAdEnabled = Context.configurationModel.Info.IsAdEnabled || false,
            isAdmin = window.application.currentUser.get('IsAdmin') || false;

        if (this.collapser.hasCursor(x, y) || this.adder.hasCursor(x, y) || this.info.hasCursor(x, y)) {
            return;
        }

        if (this.isGroupNode() || isAdEnabled) {
            return;
        }

        if (isAdmin && this.data.id) {
            OrgchartText.buildInlineForm(this);
        }
    };

    OrgchartPoint.prototype.overHandler = function (x, y, e) {
        if ($(e.target).parents('.handnavigator, .userpanel, .cmw-form').length > 0
            || $(e.target).hasClass('userpanel')) return;

        this.wasCursor = true;

        if (e.which) {
            this.select();
        }

        if (this.collapser.hasCursor(x, y)) {
            this.collapser.overHandler();
            return;
        }
        this.info.show();

        if (this.info.hasCursor(x, y)) {
            this.info.overHandler();
        } else {
            this.info.outHandler();
            $(document.body).css({ cursor: 'move' });
        }
    };

    OrgchartPoint.prototype.reparentTo = function (futureParent, index) {
        var currentParent = this.getParent();
        if (!currentParent) {
            return;
        }
        currentParent.removeChild(this);

        futureParent.insertChild(this, index)

        if (this.getChilds().length > 0) {
            futureParent.expand();
        } else if (currentParent.data.Manager === null)
            currentParent.getParent().removeChild(currentParent);

        this.data.Manager = futureParent.data.id == 0 ? null : futureParent.data.id;
    };

    OrgchartPoint.prototype.getDescendants = function (descendants) {
        var descendants = descendants || [];

        $.each(this.getChilds(), function (index, child) {
            if (!child.groupProp) {
                descendants.push(child);
            }
            child.getDescendants(descendants);
        });

        return descendants;
    };

    OrgchartPoint.prototype.getParentProp = function (groups, point, propName) {
        var parentProp = '';

        $.each(groups, function (i, items) {
            $.each(items, function (j, item) {
                if (item.data.id == point.data.Manager) {
                    parentProp = item.data[propName];
                    return false;
                }
            });
        });

        return ((parentProp || propName == 'Department') && point.removedParent) ? point.removedParent.getData()[propName] : 'undefined';
    };

    OrgchartPoint.prototype.createGroupedCard = function (points, propertyName) {
        var self = this,
            groups = {};

        $.each(points, function (index, point) {
            var propValue = point.getData()[propertyName];
            groups[propValue] = groups[propValue] || [];
            groups[propValue].push(point);
        });

        var nullGroup = groups['null'];
        if (nullGroup) {
            $.each(nullGroup, function (i, item) {
                var p = self.getParentProp(groups, item, propertyName);
                if (!p) {
                    return;
                }
                groups[p] = groups[p] || [];
                groups[p].push(item);
            });

            delete groups['null'];
        }

        $.each(groups, function (deptName) {
            var data = {};
            data[propertyName] = deptName;
            var groupCard = self.nodalPoint.createNext({ graph: self.graph, type: self.graph.typeProject + 'Point', groupProp: propertyName, index: self.getChilds().length, data: data }),
                childs = groups[deptName];

            $.each(childs, function (i, point) {
                var parent = self.getParentByManagerId(groupCard, point.getData().Manager);
                if (!parent || point.getData().Manager == self.getData().id) {
                    parent = groupCard;
                }
                parent.nodalPoint.createNext({ graph: self.graph, type: self.graph.typeProject + 'Point', index: groupCard.getChilds().length, data: point.getData() });
            });
        });
    };

    OrgchartPoint.prototype.getParentByManagerId = function (scopeParent, managerId) {
        var descendants = scopeParent.getDescendants(),
            parent = null;

        $.each(descendants, function (index, child) {
            if (child.data.id == managerId) {
                parent = child;
                return false;
            }
        });

        return parent;
    };

    OrgchartPoint.prototype.groupDescendants = function (propertyName) {
        var descendants = this.getDescendants();
        $.each(this.getChilds(), function (i, child) {
            child.remove();
        });

        this.createGroupedCard(descendants, propertyName);
    };

    OrgchartPoint.prototype.isGroupNode = function () {
        return !!this.groupProp;
    };

    OrgchartPoint.prototype.dragHandler = function (type, e, x, y) {
        if ($(e.target).parents('.handnavigator, .userpanel, .cmw-form').length > 0
            || $(e.target).hasClass('userpanel')) return;

        if (this.graph.prevType == 'down' && type == 'over' && this.hasCursor(x, y)) {
            this.graph.clearSubTree();
            this.graph.subTreeCanvasDraw(this);
            this.graph.jsubTreeCanvas.show();
        }
        if (type == 'over') {
            var x = e.pageX - this.downPageX,
                y = e.pageY - this.downPageY;

            this.graph.jsubTreeCanvas.css({ left: x + 'px', top: y + 'px' });
            VPoint.wasMouseMove = true;
        }
        if (type == 'up' && VPoint.wasMouseMove) {
            if (this != VPoint.selectedNode && VPoint.selectedNode) {
                this.graph.commandController.reparent(this, VPoint.selectedNode);
            }

            VPoint.dragNode = null;
            VPoint.wasMouseMove = false;
        }
    };

    OrgchartPoint.prototype.outHandler = function () {
        this.adder.hide();
        this.info.hide();

        this.wasCursor = false;
        this.collapser.outHandler();
        this.adder.outHandler();
        this.info.outHandler();
        $(document.body).css({ cursor: 'default' });
    };

    OrgchartPoint.prototype.updateVisible = function () {
        this.getChilds().length > 0 ? this.collapser.show() : this.collapser.hide();
    };

    OrgchartPoint.prototype.downHandler = function (x, y, e) {
        if ($(e.target).parents('.handnavigator, .userpanel, .cmw-form').length > 0
            || $(e.target).hasClass('userpanel')) return;

        this.downPageX = e.pageX;
        this.downPageY = e.pageY;

        if (this.collapser.hasCursor(x, y)) {
            this.collapser.downHandler();
            return;
        }

        VPoint.dragNode = this;

        this.select();
        this.adder.hasCursor(x, y) && this.adder.downHandler();
        this.info.hasCursor(x, y) && this.info.downHandler();
        this.draw();
    };

    OrgchartPoint.prototype.upHandler = function (x, y, e) {
        if ($(e.target).parents('.handnavigator, .userpanel, .cmw-form').length > 0
            || $(e.target).hasClass('userpanel')) return;

        var tagName = e.target.tagName.toLowerCase();
        if (tagName == 'textarea' || tagName == 'input') {
            return;
        }

        this.graph.clearSubTree();
        this.graph.jsubTreeCanvas.hide();
        if (VPoint.wasMouseMove) {
            return;
        }
        this.adder.hasCursor(x, y) && this.adder.upHandler();
        this.info.hasCursor(x, y) && this.info.upHandler();
        this.collapser.hasCursor(x, y) && this.collapser.upHandler();
        VPoint.dragNode = null;
    };
});

define('js/widget/graph/views/orgchart/OrgchartLine',['module/userModules'], function () {
    window.OrgchartLine = function() {
        OrgchartLine.superclass.constructor.apply(this, arguments);
        this.lineWidth = 1;
    };

    extend(OrgchartLine, Line);

    OrgchartLine.prototype.draw = function (canvas) {
        if (this.isHidden()) {
            return;
        }

        var c = canvas ? [canvas] : this.canvases;
        this.strokeStyle(c);
        this.setLineWidth(c);
        this.beginPath(c);

        var ix = this.ipoint.x, iy = this.ipoint.y,
            ox = this.opoint.x, oy = this.opoint.y,
            vpoint = this.ipoint.ipoint;
        this.lineTo(c, ix + 0.5, iy + 0.5);
        if (vpoint) {
            if (vpoint.getDepth() > 1) {
                this.lineTo(c, ix + 0.5, oy + 0.5);
                this.lineTo(c, ox - this.opoint.textNode.width / 2 + 0.5, oy + 0.5);
            } else {
                this.lineTo(c, ix + 0.5, ((iy + 20) | 0) + 0.5);
                this.lineTo(c, ox + 0.5, ((iy + 20) | 0) + 0.5);
                this.lineTo(c, ox + 0.5, oy - this.opoint.textNode.height / 2 + 0.5);
            }
        }
        this.stroke(c);
        this.closePath(c);
    };
});
define('js/widget/graph/views/orgchart/OrgchartText',['module/userModules'], function () {
    window.OrgchartText = function (cfg) {
        OrgchartText.superclass.constructor.apply(this, arguments);
        this.data = this.point.data;
        this.loadUserPic();
    };

    extend(OrgchartText, Text);

    OrgchartText.defaultWidth = 200;
    OrgchartText.defaultHeight = 60;

    OrgchartText.prototype.updateCoordinate = function () {
        this.x = this.point.x - this.width / 2;
        this.y = this.point.y - this.height / 2;
        this.point.adder.updateCoordinate();
        this.point.info.updateCoordinate();
        this.point.collapser.updateCoordinate();
    };

    OrgchartText.loadedImgCounter = 1;

    OrgchartText.buildInlineForm = function (point) {
        var listeners = {
            blur: function () {
                if (this.getValue() != this.focusValue) {
                    point.data[this.name] = this.getValue();
                    OrgchartAjaxController.editField(point, this.name, this._form);
                    point.draw();
                }
            }
        },
        props = [
            {
                id: 'fullname-111114f041604bd1bb37946d6bd86c7x',
                name: 'FullName',
                value: point.data.FullName || ''
            },
            {
                id: 'title-111114f041604bd1bb37946d6bd86c7y',
                name: 'Title',
                value: point.data.Title || ''
            },
            {
                id: 'department-111114f041604bd1bb37946d6bd86c7z',
                name: 'Department',
                value: point.data.Department || ''
            }
        ];

        $.each(props, function (i, it) {
            it.listeners = listeners;
        });

        OrgchartText.inlineForm = js.widget.form.cmwForm({
            id: 'cmw-form-111119c55f9c4557b38d9891bd08a0c9',
            name: 'inlineForm',
            url: '/PPMAdministration/UserDetails',
            method: 'POST',
            properties: props
        });

        var graph = point.graph,
            titleOffsetX = 65,
            titleOffsetY = 8,
            formLeft = parseInt(point.textNode.x + graph.offsetLeft - graph.body.offset().left + titleOffsetX),
            formTop = parseInt(point.textNode.y + graph.offsetTop - graph.body.offset().top + titleOffsetY);

        OrgchartText.inlineFullName.css({ left: formLeft + 'px', top: formTop + 15 + 'px', width: 125, height: 20 }).show();
        OrgchartText.inlineTitle.css({ left: formLeft + 'px', top: formTop + 'px', width: 125, height: 20 }).show();
        OrgchartText.inlineDepartment.css({ left: formLeft + 'px', top: formTop + 30 + 'px', width: 125, height: 20 }).show();
        OrgchartText.inlineForm.getElementByName('FullName').focus();
    };

    OrgchartText.prototype.buildForm = function () {
        var self = this,
            data = this.data,
            listeners = {
                change: function (newValue) {
                    self.data[this.name] = newValue;
                    self.point.draw();
                },
                blur: function () {
                    OrgchartAjaxController.editField(self.point, this.name, form);
                }
            },
            props = [
                {
                    'id': 'title-855984f041604bd1bb37946d6bd86c7c',
                    'name': 'FullName',
                    'value': data.FullName || ''
                },
                {
                    'id': 'pos-855984f041604bd1bb37946d6bd86c7d',
                    'name': 'Title',
                    'value': (data.Title || '')
                },
                {
                    'id': 'department-855984f041604bd1bb37946d6bd86c7e',
                    'name': 'Department',
                    'value': data.Department
                },
                {
                    'id': 'mbox-855984f041604bd1bb37946d6bd86c7e',
                    'name': 'Mbox',
                    'type': 'label',
                    'value': "<a href='mailto:" + data.Mbox + "' target='_blank' title='" + data.Mbox + "' class='cmw-link-label' [%label%]>" + data.Mbox + "</a>"
                },
                {
                    'id': 'phone-855984f041604bd1bb37946d6bd86c7e',
                    'name': 'Phone',
                    'type': 'label',
                    'value': "<a href='skype:" + (data.Phone || '').replace(/-/g, '') || '' + "' title='" + data.Phone + "' class='cmw-link-label' [%label%]>" + data.Phone + "</a>"
                }
            ];

        $.each(props, function (i, it) {
            it.listeners = listeners;
        });

        var form = js.widget.form.cmwForm({
            id: 'cmw-form-aac3e9c55f9c4557b38d9891bd08a0c9',
            name: 'userinfo',
            url: '/PPMAdministration/UserDetails',
            method: 'POST',
            properties: props
        });
    };

    OrgchartText.prototype.loadUserPic = function () {
        var self = this,
            pointsCount = this.graph.nodes.length;

        this.icon = new Image();
        this.loadSuccess = true;
        this.icon.onload = function () {
            if (++OrgchartText.loadedImgCounter == pointsCount) {
                self.graph.draw();
            }
        };
        this.icon.onerror = function () {
            self.loadSuccess = false;
            if (++OrgchartText.loadedImgCounter == pointsCount) {
                self.graph.draw();
            }
        };

        if (this.point.data.UserpicUri) {
            this.icon.src = this.point.data.UserpicUri;
        } else {
            if (++OrgchartText.loadedImgCounter == pointsCount) {
                this.graph.draw();
            }
        }
    };

    OrgchartText.prototype.createUserCard = function (canvas) {
        var borderColor = this.point.isSelected() ? '#1B6DE0' : '#b1c6e1',
            borderWidth = this.point.isSelected() ? 2 : 1,
            width = Math.max(this.width, OrgchartText.defaultWidth),
            height = Math.max(this.height, OrgchartText.defaultHeight),
            leftOffset = 64;

        this.opacity = 1;
        if (this.graph.graphsearch.isActive() && !this.point.isMarked() || !this.point.data.IsActive) {
            this.opacity = 0.2;
        }

        this.createContour({
            borderColor: borderColor,
            borderWidth: borderWidth,
            borderRadius: 0,
            shadowColor: '#bebcbc',
            shadowBlur: 3,
            opacity: this.opacity,
            backgroundColor: '#ffffff',
            width: width,
            height: height
        }, canvas);

        this.createContour({
            backgroundColor: VPoint.branchcolor[this.point.getColumnIndex() % VPoint.branchcolor.length],
            width: 3,
            left: -1,
            top: 0,
            opacity: this.opacity,
            height: height
        }, canvas);

        this.createSelection({
            left: leftOffset,
            fontSize: '15px',
            top: 7,
            opacity: this.opacity,
            height: 15,
            fieldName: 'FullName'
        });

        this.setText(this.data.FullName, {
            fontSize: '15px',
            color: '#384650',
            left: leftOffset,
            top: 14,
            opacity: this.opacity,
            countRows: 1,
            cut: true
        }, canvas);

        var top = 29;

        this.createSelection({
            left: leftOffset,
            top: top - 7,
            height: 15,
            opacity: this.opacity,
            fieldName: 'Title'
        });

        this.setText(this.data.Title, {
            fontSize: '11px',
            color: '#666666',
            left: leftOffset,
            top: top,
            opacity: this.opacity,
            countRows: 1,
            cut: true
        }, canvas);

        if (this.data.Title) {
            top += 15;
        }

        this.createSelection({
            left: leftOffset,
            top: top - 7,
            height: 15,
            opacity: this.opacity,
            fieldName: 'Department'
        });

        this.setText(this.data.Department, {
            fontSize: '11px',
            color: '#666666',
            left: leftOffset,
            opacity: this.opacity,
            top: top,
            countRows: 1,
            cut: true
        }, canvas);

        if (this.point.data.UserpicUri && this.loadSuccess) {
            this.drawImage({
                image: this.icon,
                top: 10,
                opacity: this.opacity,
                left: 13,
                width: 40,
                height: 40
            });
        } else {
            this.data.Abbreviation = this.data.Abbreviation || this.data.FullName.slice(0, 2).toUpperCase();
            this.createContour({
                borderColor: '#dbe2e8',
                borderWidth: 1,
                borderRadius: 22,
                width: 40,
                top: 10,
                left: 10,
                height: 40
            }, canvas);

            this.setText(this.data.Abbreviation.toUpperCase(), {
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#99a1a7',
                top: 27,
                left: 20
            });
        }
    };

    OrgchartText.prototype.createGroupCard = function (canvas, propName) {
        this.graph.canvas.save();
        this.graph.canvas.font = "bold normal 13px Segoe UI";

        var borderColor = this.point.isSelected() ? '#1B6DE0' : '#b1c6e1',
            borderWidth = this.point.isSelected() ? 2 : 1,
            width = this.width,
            height = this.height,
            leftOffset = Math.max(5, (this.width - this.graph.canvas.measureText(this.data[propName]).width) / 2);

        this.opacity = this.graph.graphsearch.isActive() ? 0.2 : 1;

        this.createContour({
            borderColor: borderColor,
            borderWidth: borderWidth,
            borderRadius: 0,
            shadowColor: '#bebcbc',
            shadowBlur: 3,
            opacity: this.opacity,
            backgroundColor: '#ffffff',
            width: width,
            height: height
        }, canvas);

        this.createContour({
            backgroundColor: VPoint.branchcolor[this.point.getColumnIndex() % VPoint.branchcolor.length],
            width: 3,
            left: -1,
            opacity: this.opacity,
            top: 0,
            height: height
        }, canvas);

        this.setText(this.data[propName], {
            fontSize: '13px',
            fontWeight: 'bold',
            opacity: this.opacity,
            color: '#185ce6',
            left: leftOffset,
            top: 30
        }, canvas);

        this.graph.canvas.restore();
    };

    OrgchartText.prototype.draw = function (canvas) {
        OrgchartText.superclass.draw.apply(this, arguments);
        if (this.point.isGroupNode()) {
            this.createGroupCard(canvas, this.point.groupProp);
        } else {
            this.createUserCard(canvas);
        }

        this.point.adder.draw(canvas);
        this.point.info.draw(canvas);
        this.point.collapser.draw(canvas);
    };
});

define('js/widget/graph/views/orgchart/OrgchartAdder',['module/userModules'], function () {
    window.OrgchartAdder = function(point) {
        OrgchartAdder.superclass.constructor.apply(this, arguments);
        this.width = this.point.textNode.width;
        this.height = 16;
        this.bgColor = '#cfd9e6';
        this.prevAction = 'out';
    };

    extend(OrgchartAdder, Control);

    OrgchartAdder.prototype.updateCoordinate = function () {
        this.width = this.point.textNode.width;
        this.x = this.textNode.x;
        this.y = this.textNode.y + this.textNode.height - this.height;
    };

    OrgchartAdder.prototype.draw = function () {
        return;
        if (this.point.isCollapsed() || !this.isVisible()) {
            return;
        }
        this.textNode.createContour({
            left: 2,
            top: this.textNode.height - this.height,
            width: this.textNode.width - 2,
            height: this.height,
            backgroundColor: this.bgColor
        });

        var text = 'new employee';
        this.textNode.setText(text, {
            fontSize: '11px',
            color: '#ffffff',
            left: (this.textNode.width - this.textNode.getTextSize(text, 'width')) / 2,
            top: this.textNode.height - this.height + 6
        });
    };

    OrgchartAdder.prototype.overHandler = function () {
        return;
        if (this.prevAction == 'over') {
            return;
        }

        this.bgColor = '#98adc6';
        this.prevAction = 'over';
        $(document.body).css({ cursor: 'pointer' });
    };

    OrgchartAdder.prototype.outHandler = function () {
        return;
        if (this.prevAction == 'out') {
            return;
        }

        this.bgColor = '#cfd9e6';
        this.prevAction = 'out';
        $(document.body).css({ cursor: 'default' });
    };

    OrgchartAdder.prototype.downHandler = function () {

    };

    OrgchartAdder.prototype.upHandler = function () {
        //window.open('/people/users#new', '_blank');
    };

    OrgchartAdder.prototype.hasCursor = function (x, y) {
        return this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height;
    };
});
define('js/widget/graph/views/orgchart/OrgchartInfo',['module/userModules'], function () {
    window.OrgchartInfo = function () {
        OrgchartInfo.superclass.constructor.apply(this, arguments);
        Context.Path = Context.Path || '/resources/graph/';
        this.outImg = new Image();
        this.overImg = new Image();

        this.outImg.src = this.point.isRoot ? '' : Context.Path + 'img/info.png';
        this.outWidth = 26;
        this.outHeight = 26;

        this.overImg.src = this.point.isRoot ? '' : Context.Path + 'img/overInfo.png';
        this.overWidth = 26;
        this.overHeight = 26;

        this.img = this.outImg;
        this.width = this.outWidth;
        this.height = this.outHeight;

        this.prevAction = 'out';       
    };
    extend(OrgchartInfo, Control);
    var mixin = _.getWindowPropIfHas("classes.shared.view.ScrollerViewMixin");
    if (mixin) {
        _.extend(OrgchartInfo, mixin);
    }

    OrgchartInfo.loadData = function (nodeId) {
        var userPanel = GInfo.graph.userPanel;

        Ajax.People.UserProfile(nodeId, true, {
            dataType: 'html',
            ownHandler: true,
            success: function (htmlRes) {
                userPanel.container.html(htmlRes);
                OrgchartInfo.initScrollerView(userPanel.container.children('.cmw-form'));
                $('a.card__orgchat').remove();

                $('.button-icon_close')
                    .addClass('right')
                    .on('click', function () {
                        GInfo.graph.userPanel.toggleShow();
                    });
                userPanel.subMask && userPanel.subMask.hide();
                var form = ClassLoader.createNS("app.people.users").Form.lastForm;

                form.on('inputResize', function () {
                    OrgchartInfo.updateScrollerView();
                });
                form.on("activityStream>scrollTo", function (field) {
                    OrgchartInfo.updateScrollerView(field && field.renderTo);
                });
                OrgchartInfo.clearScrollerView();
                OrgchartInfo.updateScrollerView();

                form.on("submitChanges", function (changes, callback, failcallback) {
                    var data = this.getPurifiedData();
                    if (data.id != null) {
                        Ajax.People.EditUserProfile(data, null, function () {
                            callback && callback();
                        });
                    }

                    return false;
                });
            }
        });
    };

    OrgchartInfo.prototype.addCloseButton = function (el) {
        var self = this;
        el.bind('mousedown', function (e) {
            self.graph.userPanel.hide();
            e.stopPropagation();
        });
    };

    OrgchartInfo.prototype.updateCoordinate = function () {
        var textNode = this.point.textNode;
        this.x = textNode.x + textNode.width - this.width / 2;
        this.y = textNode.y + textNode.height / 2 - this.height / 2;
    };

    OrgchartInfo.prototype.draw = function () {
        if (this.point.isGroupNode() || this.point.isCollapsed() || !this.isVisible() || this.point.isRoot) {
            return;
        }
        var self = this;
        if ($.browser.mozilla) {
            var imgSrc = this.img.src;
            this.img.src = '';
            this.img.onload = function () {
                self.canvases[0].drawImage(self.img, self.x, self.y);
            };
            this.img.src = imgSrc;
        } else {
            self.canvases[0].drawImage(self.img, self.x, self.y);
        }
    };

    OrgchartInfo.prototype.overHandler = function () {
        if (this.prevAction == 'over' || this.point.isRoot || this.point.isGroupNode()) {
            return;
        }

        this.x += (this.outWidth - this.overWidth) / 2;
        this.y += (this.outHeight - this.overHeight) / 2;
        this.img = this.overImg;
        this.width = this.overWidth;
        this.height = this.overHeight;
        this.prevAction = 'over';
        $(document.body).css({ cursor: 'pointer' });
    };

    OrgchartInfo.prototype.outHandler = function () {
        if (this.prevAction == 'out' || this.point.isRoot || this.point.isGroupNode()) {
            return;
        }

        this.x -= (this.outWidth - this.overWidth) / 2;
        this.y -= (this.outHeight - this.overHeight) / 2;
        this.img = this.outImg;
        this.width = this.outWidth;
        this.height = this.outHeight;
        this.prevAction = 'out';
        $(document.body).css({ cursor: 'default' });
    };

    OrgchartInfo.prototype.downHandler = function () {
        return;
    };

    OrgchartInfo.prototype.upHandler = function () {
        if (this.point.isRoot || this.point.isGroupNode()) return;

        if (this.prevInfo === this.point) {

            this.graph.userPanel.toggleShow();
            $('button.show').toggleClass('disabled');
        } else {
            this.point.dragInCenter(true, true);
            this.graph.userPanel.GetData(this.point.data.id);
        }

        OrgchartInfo.prevInfo = this.point;
    };

    OrgchartInfo.prototype.hasCursor = function (x, y) {
        var r = this.width / 2;
        return Math.abs(this.x + this.width / 2 - x) <= r && Math.abs(this.y + this.height / 2 - y) <= r;
    };

});

define('js/widget/graph/views/orgchart/OrgchartCollapser',['module/userModules'], function () {
    window.OrgchartCollapser = function () {
        OrgchartCollapser.superclass.constructor.apply(this, arguments);
        this.outImg = new Image();
        Context.Path = Context.Path || '/resources/graph/';
        this.outImg.src = Context.Path + 'img/openCollapser.png';
        this.outWidth = 18;
        this.outHeight = 18;

        this.overImg = new Image();
        this.overImg.src = Context.Path + 'img/openOverCollapser.png';
        this.overWidth = 18;
        this.overHeight = 18;

        this.img = this.outImg;
        this.width = this.outWidth;
        this.height = this.outHeight;
        this.prevAction = 'out';
        this.offsetY = 16;
        this.collapsed = false;
    }

    extend(OrgchartCollapser, Control);

    OrgchartCollapser.prototype.updateCoordinate = function () {
        this.x = this.textNode.x + this.textNode.width / 2 - this.width / 2;
        this.y = this.textNode.y + this.textNode.height + this.offsetY - this.height / 2;
    };

    OrgchartCollapser.prototype.drawPartLine = function () {
        OrgchartLine.prototype.moveTo.call(this, this.canvases, this.textNode.x + this.textNode.width / 2, this.textNode.y + this.textNode.height);
        OrgchartLine.prototype.lineTo.call(this, this.canvases, this.x + this.width / 2, this.y + this.height);
        OrgchartLine.prototype.stroke.call(this, this.canvases);
    };

    OrgchartCollapser.prototype.draw = function (canvas) {
        if (!this.point.hasChilds() || this.point.isRoot) {
            return;
        }
        this.drawPartLine();
        var canvas = (canvas || this.canvases[0]);
        canvas.globalAlpha = this.point.textNode.opacity || 1;
        canvas.drawImage(this.img, this.x, this.y);
        canvas.globalAlpha = 1;
    };

    OrgchartCollapser.prototype.overHandler = function () {
        if (this.prevAction == 'over') {
            return;
        }
        this.x += (this.outWidth - this.overWidth) / 2;
        this.y += (this.outHeight - this.overHeight) / 2;
        this.img = this.overImg;
        this.width = this.overWidth;
        this.height = this.overHeight;
        this.prevAction = 'over';
    };

    OrgchartCollapser.prototype.outHandler = function () {
        if (this.prevAction == 'out') {
            return;
        }

        this.x -= (this.outWidth - this.overWidth) / 2;
        this.y -= (this.outHeight - this.overHeight) / 2;
        this.img = this.outImg;
        this.width = this.outWidth;
        this.height = this.outHeight;
        this.prevAction = 'out';
    };

    OrgchartCollapser.prototype.downHandler = function () {
        this.collapsed = !this.collapsed;
        if (this.collapsed) {
            this.outImg.src = Context.Path + 'img/collapser.png';
            this.overImg.src = Context.Path + 'img/overCollapser.png';
        } else {
            this.outImg.src = Context.Path + 'img/openCollapser.png';
            this.overImg.src = Context.Path + 'img/openOverCollapser.png';
        }
    };

    OrgchartCollapser.prototype.upHandler = function () {
        if (this.point.isHidden()) {
            return;
        }
        this.point.triggerCollapse();
        this.graph.draw();
    };

    OrgchartCollapser.prototype.hasCursor = function (x, y) {
        var r = this.width / 2;
        return Math.abs(this.x + this.width / 2 - x) <= r && Math.abs(this.y + this.height / 2 - y) <= r;
    };
});
/**
 * Orgchart tree layout
 */

define('js/widget/graph/views/orgchart/OrgchartLayout',['module/userModules'], function() {
    window.OrgchartLayout = {
        init: function(cfg) {
            $.extend(this, cfg);
            // tree layout parameters
            this.horisontalLevelsCount = 3;

            // horizontal layout config
            this.horizontalLayoutConfig = {
                horizontalMargin: 40,
                verticalMargin: 38
            };

            // vertical layout config
            this.verticalLayoutConfig = {
                horizontalMargin: -80,
                verticalMargin: 34
            };
        },

        doLayout: function(tree) {
            var needRedraw = false;
            this.layout(0, tree || this.graph.root);
            this.shiftToRightSubtree();
            $.each(this.graph.getPoints(), function(i, point) {
                if ((point.data.Manager === null && !point.data.PresentedOnOrgchart) && point.getChilds().length === 0)
                    delete GInfo.graph.points[point.id];
                else
                    point.updateNodalPoint();
            }.bind(this));
        },

        shiftToRightSubtree: function() {
            var points = this.graph.getPoints(),
                minX = Number.MAX_VALUE;

            $.each(points, function(i, point) {
                if (point.x - point.textNode.width / 2 < minX) {
                    minX = point.x - point.textNode.width / 2;
                }
            });

            minX < 0 && this.graph.root.shiftSubtree(-(minX + this.verticalLayoutConfig.horizontalMargin), 0);
        },

        layout: function(level, node) {
            if (level < this.horisontalLevelsCount - 1) {
                return this.horizontalLayout(level, node);
            }
            return this.verticalLayout(level, node);
        },

        verticalLayout: function(level, node) {
            var children = node.getChilds();
            var childrenLength = children.length;

            var layout = { width: node.textNode.width, height: node.textNode.height, childrenLayout: [] };

            // calculate children layout
            var maxChildWidth = 0;
            for (var i = 0; i < childrenLength; ++i) {
                var child = children[i];
                if (child.isHidden()) {
                    continue;
                }
                var childLayout = this.layout(level + 1, child);
                layout.childrenLayout.push(childLayout);
                maxChildWidth = Math.max(maxChildWidth, childLayout.width);
                layout.height += this.verticalLayoutConfig.verticalMargin + childLayout.height;
            }
            if (maxChildWidth != 0) {
                layout.width += maxChildWidth;

                if (childrenLength > 0 || level > this.horisontalLevelsCount - 1) {
                    layout.width += this.verticalLayoutConfig.horizontalMargin;
                } else {
                    layout.width -= node.textNode.width;
                }
            }


            // position children
            node.x = node.x || 0;
            node.y = node.y || 0;
            var childX = node.x;
            if (childrenLength > 0 || level > this.horisontalLevelsCount - 1) {
                childX += node.textNode.width + this.verticalLayoutConfig.horizontalMargin;
            }
            var childY = node.y + node.textNode.height + this.verticalLayoutConfig.verticalMargin;
            for (var i = 0; i < childrenLength; ++i) {
                var child = children[i];
                if (child.isHidden()) {
                    continue;
                }
                var childLayout = layout.childrenLayout[i];
                child.x = child.x || 0;
                child.y = child.y || 0;
                child.shiftSubtree(childX - child.x, childY - child.y);
                if (childLayout) {
                    childY += childLayout.height + this.verticalLayoutConfig.verticalMargin;
                }
            }

            return layout;
        },

        horizontalLayout: function(level, node) {
            var children = node.getChilds();
            var childrenLength = children.length;

            if (childrenLength == 0) {
                return { width: node.textNode.width, height: node.textNode.height, childrenLayout: [] };
            }

            var layout = { width: 0, height: node.textNode.height + this.horizontalLayoutConfig.verticalMargin, childrenLayout: [] };

            // calculate children layout
            for (var i = 0; i < childrenLength; ++i) {
                var child = children[i];
                if (child.isHidden()) {
                    continue;
                }

                child.shiftSubtree(0 - child.x, 0 - child.y);
                var childLayout = this.layout(level + 1, child);
                layout.childrenLayout.push(childLayout);
                layout.height = Math.max(layout.height, childLayout.height);
            }

            // position children
            node.x = node.x || 0;
            node.y = node.y || 0;

            var childWidths = [];
            var childOffsets = [];

            for (var i = 0; i < childrenLength; ++i) {
                var child = children[i];
                if (child.isHidden()) {
                    continue;
                }
                if (i > 0) {
                    var childLayout = layout.childrenLayout[i];
                    child.x = child.x || 0;
                    child.y = child.y || 0;

                    var childBottom = child.y + childLayout.height;
                    childWidths[i - 1] = this.getMaxXForY(children[i - 1], childBottom) - children[i - 1].x + node.textNode.width + this.horizontalLayoutConfig.horizontalMargin;
                    if (layout.childrenLayout[i - 1].width > node.textNode.width && layout.childrenLayout[i].width > node.textNode.width) {
                        childWidths[i - 1] += this.verticalLayoutConfig.horizontalMargin;
                    }
                    childOffsets[i - 1] = this.getMinXForY(child, childBottom);
                }
            }

            var totalWidth = 0;
            for (var i = 0; i < childWidths.length; ++i) {
                totalWidth += childWidths[i];
                totalWidth -= childOffsets[i];
            }

            var childY = node.y + node.textNode.height + this.horizontalLayoutConfig.verticalMargin;
            var childX = node.x - totalWidth / 2;

            for (var i = 0; i < childrenLength; ++i) {
                var child = children[i];
                child.shiftSubtree(childX - child.x, childY - child.y);
                childX += childWidths[i];
                childX -= childOffsets[i];
            }

            return layout;
        },

        getMaxXForY: function(node, ypos) {
            var max = node.x;
            var children = node.getChilds();
            var childrenLength = children.length;
            for (var i = 0; i < childrenLength; ++i) {
                var child = children[i];
                if (!child.isHidden() && child.y <= ypos) {
                    max = Math.max(max, this.getMaxXForY(child, ypos));
                }
            }
            return max;
        },

        getMinXForY: function(node, ypos) {
            var min = node.x;
            var children = node.getChilds();
            var childrenLength = children.length;
            for (var i = 0; i < childrenLength; ++i) {
                var child = children[i];
                if (!child.isHidden() && child.y <= ypos) {
                    min = Math.min(min, this.getMinXForY(child, ypos));
                }
            }
            return min;
        }
    };
});
define('js/widget/graph/views/orgchart/OrgchartAjaxController',['module/userModules'], function() {
    window.OrgchartAjaxController = {
        createCard: function(point) {
            var parentIsRoot = point.getParent().data.id === 0;
            if (parentIsRoot) {
                point.data.Manager = null;
                point.data.PresentedOnOrgchart = true;
            }
            else {
                point.data.Manager = point.getParent().data.id;
            }
            
            Ajax.People.EditShortUserProfile(point.data);
        },

        removeCard: function(point) {
            point.data.Manager = null;
            point.data.PresentedOnOrgchart = false;
            point.graph.controlPanel.addItem(point.data);
            OrgchartDataModel.unassignedManagers.push(point.data)
            Ajax.People.EditShortUserProfile(point.data);
        },

        editField: function(point) {
            Ajax.People.EditShortUserProfile(point.data);
        },

        reparentCard: function(point, callback) {
            if (point.getParent())
                point.data.Manager = point.getParent().data.id === 0 ? null : point.getParent().data.id;
            else {
                point.data.Manager = null;
                point.data.PresentedOnOrgchart = true;
            }

            Ajax.People.EditShortUserProfile(point.data, function() {
                callback && callback();
            });
        }
    };
});

define('text!js/widget/graph/views/orgchart/tmpl/OrgchartCommandList.html',[],function () { return '{{foreach Command}}\r\n    {{if type === \'ReparentCommand\'}}\r\n        {{if newParentId === 0}}\r\n            <li>\r\n                <a href="{{{this.getUrl(\'Person\', taskId)}}}">{{title}}</a>&nbsp\r\n                {{{this.Localizer(\'PROJECT.MYWORK.ACTIVITYTAB.CHANGESTREAMITEM.ACTION.REMOVEDFROMPARENT\')}}}\r\n            </li>\r\n        {{else}}\r\n            <li>\r\n                {{{this.Localizer(\'PROJECT.PEOPLE.ORGCHARTTAB.MANAGERCHANGE.FIRSTPART\')}}}&nbsp\r\n                    <a href="{{{this.getUrl(\'Person\', taskId)}}}">\r\n                    {{if !title}}\r\n                        {{taskId}}\r\n                    {{else}}\r\n                        {{title}}\r\n                    {{/if}}\r\n                    </a>&nbsp\r\n                    {{{this.Localizer(\'PROJECT.PEOPLE.ORGCHARTTAB.MANAGERCHANGE.FROM\')}}}&nbsp\r\n                    <a href="{{{this.getUrl(\'Person\', oldParentId)}}}">{{oldParentTitle}}</a>&nbsp\r\n                    {{{this.Localizer(\'PROJECT.PEOPLE.ORGCHARTTAB.MANAGERCHANGE.TO\')}}}&nbsp\r\n                    <a href="{{{this.getUrl(\'Person\', newParentId)}}}">{{newParentTitle}}</a>\r\n            </li>\r\n        {{/if}}\r\n    {{/if}}\r\n{{/foreach}}';});


define([
    'js/widget/graph/views/orgchart/OrgchartDataModel',
    'js/widget/graph/views/orgchart/OrgchartPoint',
    'js/widget/graph/views/orgchart/OrgchartLine',
    'js/widget/graph/views/orgchart/OrgchartText',
    'js/widget/graph/views/orgchart/OrgchartAdder',
    'js/widget/graph/views/orgchart/OrgchartInfo',
    'js/widget/graph/views/orgchart/OrgchartCollapser',
    'js/widget/graph/views/orgchart/OrgchartLayout',
    'js/widget/graph/views/orgchart/OrgchartAjaxController',
    'cmwTemplate!js/widget/graph/views/orgchart/tmpl/OrgchartCommandList.html'
]);

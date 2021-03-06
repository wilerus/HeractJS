/**
 * @author Alexander Korzhikov <korzio@gmail.com>
 * @date 09.10.2011 
 */

/**
 * - GA to keep GATracker instances
 * - GATracker
 * GA.getTracker('U-11111111-1').addLinkerEvents().trackPageview()
 */

define('lib/cmw/ga',['module/shared',

    'module/lib'], function () {
    window.GA = (function () {
        var trackers = {},
            length = 0;

        // google global object
        if (!window._gaq) window._gaq = [];

        /**
         * addTracker - creates new tracker's instance, set it in internal object trackers
         * @param {String} id - tracker name
         * @param {String} siteName - site name to set in tracker
         **
         */
        function addTracker(id, siteName) {
            return (trackers[id] = new GATracker(id, siteName, _gaq));
        }

        return {
            /**
             * getTracker returns tracker in internal object,
             * @param {String} id - tracker name
             * @param {String} siteName - site name to set in tracker
             **
             */
            getTracker: function (id, siteName) {
                if (id)
                    if (id in trackers)
                        return trackers[id]
                    else if (siteName) {
                        length++;
                        return addTracker(id, siteName, _gaq)
                    }

                    else if (length == 1) {
                        for (var c in trackers)
                            return trackers[c];
                    }
            },

            /**
             * removeTracker
             * @param {String} id - tracker name
             **
             */
            removeTracker: function (id) {
                length--;
                delete trackers[id];
            },


            /**
             * redirect
             * @param {string} url
             * @param {function} func
             * in case of redirecting ( location.href ... ) - execute function func on unload
             * if opera - waits for half minute
             *
             * GA.redirect( redirect_path, function() {
             *  GA.getTracker('U-111111-1')
             *    .setCustomVar( 3, 'name', 'value', 3 )
             *    .trackPageview( '/submitted/' );
             * })
             */
            redirect: function (url, func) {
                window.onunload = func;
                if (/opera/.test(navigator.userAgent)) {
                    window.onunload();
                    var time_to_redirect = 500;
                }
                window.setTimeout(function () {
                    window.location.replace(url);
                }, time_to_redirect || 10);
            }

        }
    })();



    /**
     * @constructor
     * @param {string} id google profile
     * @param {string} siteName if set, used as domain name for analytics ( _setDomainName )
     * @param {object} _gaq
     *
     * initialize google analytics, by executing commands _setAccount, _setDomainName, _setAllowLinker, _setAllowHash;
     * loads native google code ( function sendAnalytics )
     * saves this.trackerName for further executing
     *
     * !important!
     * rewrites native google function trackPageview - for recording timeGAID, randGAID as GET parameters each time trackPageview is called
     * also on init records user unique id - userGAID, generated by its function _visitCode
     */
    window.GATracker = function (id, siteName, _gaq) {
        if (!id || !siteName)
            throw new Error('GA: id or siteName not defined');
        this.id = id;
        this.trackerName = (this.id ? this.id + '.' : '');
        this.domain = siteName;

        var _self = this, pos, url;

        this.userIdentityParams = {}; // saves attributes to send them to server
        this.userIdentityParams.ga_profileID = this.id;

        // add Organic sources, before initialize ga
        this.addOrganic();
        _gaq.push([this.trackerName + '_setAccount', this.id],
            [this.trackerName + '_setDomainName', this.domain],
    //        [this.trackerName+'_setAllowLinker', true],
    //        [this.trackerName+'_setAllowHash', false],
            // rewrite trackPageview
            function () {
                var tracker = _gat._getTrackerByName(_self.id),
                    track = tracker._trackPageview;

                tracker._setCustomVar(5, 'userID', tracker._visitCode(), 1);
                tracker._trackPageview = function (link) {
                    var url = link || document.location.href.split(document.location.hostname)[1];
                    track.call(tracker, url);
                };
            }
        );

        // get ga code
        this._sendAnalytics();
    };

    /**
     * _sendAnalytics
     * loads ga.js in asynchronous mode (<script ...)
     */
    GATracker.prototype._sendAnalytics = function () {
        if (_gaq instanceof Array) (function () {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    }


    /**
     * link
     * @param {string} link url
     * sends analytics data to different domain page with get parameters;
     * executes native google function _getLinkerUrl
     * '<a onclick="GAO.link(this);return false;" href="#"></a>'
     */
    GATracker.prototype.link = function (link) {
        var _self = this;
        _gaq.push(function () {
            var tracker = _gat._getTrackerByName(_self.id);
            window.open(tracker._getLinkerUrl(link.href), link.target);
        });
        return this;
    }


    /**
     * standartCommand
     * @param {string} name
     * @param {string} param
     * for outer google one parameter function executing
     * -> make it possible to use many parameters in param or in arguments
     */
    GATracker.prototype.standartCommand = function (name) {
        _gaq.push([this.trackerName + name].concat(Array.prototype.slice.call(arguments, 1)));
        return this;
    }


    /**
     * setCustomVar
     * @param {string} slot
     * @param {string} name
     * @param {string} value
     * @param {string} level
     * for outer google function _setCustomVar executing
     * 1 (visitor-level), 2 (session-level), or 3 (page-level)
     */
    GATracker.prototype.setCustomVar = function (slot, name, value, level) {
        _gaq.push([this.trackerName + '_setCustomVar', slot, name, value, level]);
        return this;
    }


    /**
     * setVar
     * @param {string} name
     * for outer google function _setVar executing
     */
    GATracker.prototype.setVar = function (name) {
        _gaq.push([this.trackerName + '_setVar', name]);
        return this;
    }


    /**
     * trackPageview
     * @param {string} url for record - executes GA class function
     **
     */
    GATracker.prototype.trackPageview = function (url) {
        _gaq.push([this.trackerName + '_trackPageview', url]);
        return this;
    }


    /**
     * addOrganic
     * for outer google function _addOrganic executing
     */
    GATracker.prototype.addOrganic = function () {
        var aO = this.trackerName + '_addOrganic';
        _gaq.push(
            [aO, 'google.ru', 'q'],
            [aO, 'images.google.ru', 'q'],
            [aO, 'google.ru/search', 'q'],
            [aO, 'google.com.ua', 'q'],
            [aO, 'images.google.com.ua', 'q'],
            [aO, 'images.google.com', 'q'],
            [aO, 'images.google.md', 'q'],
            [aO, 'images.google.com.by', 'q'],
            [aO, 'images.google.lv', 'q'],
            [aO, 'google.co.uk', 'q'],
            [aO, 'google.md', 'q'],
            [aO, 'images.google.de', 'q'],
            [aO, 'images.google.lt', 'q'],
            [aO, 'images.google.pl', 'q'],
            [aO, 'images.google.bg', 'q'],
            [aO, 'google.com', 'q'],
            [aO, 'google.co.il', 'q'],
            [aO, 'google.com.br', 'q'],
            [aO, 'google.com.by', 'q'],
            [aO, 'google.com.bz', 'q'],
            [aO, 'google.com.tr', 'q'],
            [aO, 'google.com.tw', 'q'],
            [aO, 'google.ge', 'q'],
            [aO, 'google.kz', 'q'],
            [aO, 'google.lt', 'q'],
            [aO, 'google.lv', 'q'],
            [aO, 'google.pl', 'q'],
            [aO, 'google.se', 'q'],
            [aO, 'images.google.at', 'q'],
            [aO, 'images.google.be', 'q'],
            [aO, 'images.google.co.uk', 'q'],
            [aO, 'images.google.fr', 'q'],
            [aO, 'images.google.ie', 'q'],
            [aO, 'images.google.nl', 'q'],
            // russian search systems
            [aO, 'nova.rambler.ru', 'query'],
            [aO, 'search.qip.ru/search', 'query'],
            [aO, 'rambler.ru/srch', 'query'],
            [aO, 'rambler.ru/search', 'query'],
            [aO, 'search.tut.by', 'query'],
            [aO, 'poisk.ru', 'text'],
            [aO, 'ru.search.yahoo.com', 'p'],
            [aO, 'search.list.mail.ru', 'q'],
            [aO, 'search.otvet.mail.ru', 'q'],
            [aO, 'go.mail.ru', 'q', true],
            [aO, 'go.mail.ru/search', 'q', true],
            [aO, 'gogo.ru', 'q'],
            [aO, 'torg.mail.ru', 'q'],
            [aO, 'search.icq.com', 'clid'],
            [aO, 'search.icq.com', 'q'],
            [aO, 'search.qip.ru', 'query'],
            [aO, 'tyndex.ru', 'pnam'],
            [aO, 'search.ukr.net', 'q'],
            [aO, 'nigma.ru', 's'],
            [aO, 'nigma.ru/index.php', 's'],
            [aO, 'yaca.yandex.ru/yca', 'text'],
            [aO, 'search.list.mail.ru', 'q'],
            [aO, 'sm.aport.ru', 'r'],
            [aO, 'search.list.mail.ru', 'q'],
            [aO, 'blogs.yandex.ru', 'text'],
            [aO, 'webalta.ru', 'q'],
            [aO, 'meta.ua', 'q'],
            [aO, 'liveinternet.ru', 'ask'],
            [aO, 'gde.ru', 'keywords'],
            [aO, 'memori.qip.ru', 'search'],
            [aO, 'magna.qip.ru', 'q'],
            [aO, 'video.qip.ru', 'q'],
            [aO, 'referats.qip.ru', 'query'],
            [aO, 'blogs.yandex.ru', 'text'],
            [aO, 'wap.go.mail.ru', 'q'],
            [aO, 'bing.com', 'q']
        );

        return this;
    }



    /**
     * addLinkerEvents
     * @param {bool} flag_not_loaded for ajax dom rewriting, in case of loading part of document
     * run all links
     *  in case of specific classes or parent classes add event handle functions
     *  in all cases executes GATracker trackPageview for virtual page tracking
     *
     *  @refactor forms in aop,
     *  find special events (ga-click, ga-change) on document bubbling and catch there
     */
    GATracker.prototype.addLinkerEvents = function (flag_not_loaded) {
        var _self = this,
            trackContextLink = function (context) {
                if (!context)
                    context = '/';

                return function () {
                    var url = $(this).attr('href'),
                        splitResult = url.split(_self.domain),
                        info = (splitResult[1] ? splitResult[1] : (/javascript|undefined/i.test(url) ? '' : url));

                    if (!context.length && info.charAt(0) != '/')
                        info = '/' + info;
                    else if (context.length && info.charAt(0) == '/')
                        info = info.substring(1);

                    _self.trackPageview(context + info);
                }
            },
            // bind ga-click when it's ready
            trackClick = function (element, func) {
                $(element).click(func)
            };

        var eventTracker = function () {
            var $as = $('a'),
                //downloads types
                doc_types = [
                    '\\.doc$',
                    '\\.docx$',
                    '\\.xls$',
                    '\\.xlsx$',
                    '\\.exe$',
                    '\\.zip$',
                    '\\.pdf$',
                    '\\.js$',
                    '\\.chm$',
                    '\\.cab$',
                    '\\.se$',
                    '\\.rar$',
                    '\\.mp3$'
                ],
                reg_docs = [],
                // mailto
                reg_mailto = new RegExp('^mailto', 'i'),
                // tabs
                reg_tabs = new RegExp('\\btabs(?![-\\w])', 'i'),
                trackTab = trackContextLink('/tab/'),
                trackMail = trackContextLink('/mailto/'),
                trackDoc = trackContextLink('/download/'),
                trackExt = trackContextLink('/ext/'),
                forms = document.forms;

            for (var i = 0; i < doc_types.length; i++) {
                reg_docs[i] = new RegExp(doc_types[i], 'i');
            }


            // linkers : *if docs not last
            for (var i = 0; i < $as.length; i++) {
                var href = $as[i].href;

                // mailto
                if (reg_mailto.test(href)) {
                    trackClick($as[i], trackMail);
                    continue;
                }
                
                // ext
                if (href.indexOf(document.location.hostname) == -1 && href.indexOf(_self.domain) == -1 && href.charAt(0) == 'h') {
                    var info = (/javascript/i.test(href) ? '' : href);
                    if (!info) {
                        var tmp = $as[i].getAttribute('onclick');
                        if (tmp && /window\.open/.test(tmp))
                            info = (tmp.split(',')[1] ? tmp.split(',')[1] : tmp);
                    }
                    if (info)
                        trackClick($as[i], trackContextLink('/ext/' + info));
                    else
                        trackClick($as[i], trackExt);

                    continue;
                }


                // docs
                for (var j = 0; j < reg_docs.length; j++) {
                    if (reg_docs[j].test(href)) {
                        trackClick($as[i], trackDoc);
                        // *if docs not last
                        // continue linkers;
                        break;
                    }
                }
            }
        };


        if (flag_not_loaded)
            eventTracker();
        else if (window.$)
            $(eventTracker);


        return this;
    }    
});

/**
 * google analytics includes GA lib for using in application
 * bind general application tracking rules
 *
 * extensions for other modules will be included in module.js as part of this file
 */

define('shared/general/GoogleAnalytics',['lib/cmw/ga', 'module/userModules'], function () {
    'use strict';
    ClassLoader.define('shared.general.GoogleAnalytics', {
        singleton: true,
        names : {
            userVarName: "userHostName",
            createdEvent: "taskCreated",            
            helpTopicEvent: "helpTopic",
            tutorialStartEvent: "startedTutorial",
            tutorialFinishEvent: "finishedTutorial",
            tutorialShowPreTrialFormEvent: "showPreTrialForm",
            tutorialClosePreTrialFormEvent: "closePreTrialForm"
        },

        ctor: function () {
            if (!window.GAConfig)
                throw ("Cannot receive params for tracking google analytics");

            if (!window.GA)
                throw ("Need GA lib");

            this._gaId = GAConfig.id;
            this._gaSiteName = GAConfig.siteName;
            this._gaTracker = GA.getTracker(this._gaId, /*'none'*/'.' + this._gaSiteName);

            if (!this._gaTracker)
                throw ("Cannot instantiate GATracker");

            this.addUserVar();
            this.addHavigationHandler();
            this.addCreateTaskHandler();
            this.addHelpNavigationHandler();
            this.addTutorialHandlers();
        },
        
        addUserVar: function () {
            var value = location.host.replace(/\..*/, "");
            this._gaTracker.setCustomVar(1, this.names.userVarName, value, 1);
        },

        addHavigationHandler: function () {
            if (!window.Viewport)
                return;

            var _self = this,
                moduleRegExp = /^url:/,
                moduleRootRegExp = /\/.*/,
                availableUrls = _.unique(_.filter(_.keys(js.modules), function (url) {
                    return moduleRegExp.test(url)
                }).map(function (url) {
                    return url.replace(moduleRegExp, "").replace(moduleRootRegExp, "");
                })),
                l = availableUrls && availableUrls.length;

            Viewport.on("route", function (routeName) {
                if (l && typeof routeName === "string") {
                    for (var i = 0; i < l; i++) {
                        if (availableUrls[i] && routeName.indexOf(availableUrls[i]) != -1) {
                            return _self.trackPage(routeName);
                        }
                    }
                }
            });

            this.trackPage(Backbone.history.getFragment());
        },
        
        addCreateTaskHandler: function () {
            if (!window.Viewport)
                return;

            var fnProjectCreateTask = _.getWindowPropIfHas("Ajax.ProjectTasks.CreateTask");
            if (typeof fnProjectCreateTask == "function") {
                var _self = this;
                Ajax.ProjectTasks.CreateTask = function () {
                    var res = fnProjectCreateTask.apply(this, arguments);
                    _self.trackPage(Viewport.getControllerRouter().basePath + "/" + _self.names.createdEvent);
                    return res;
                };
            }
            
            var fnCreateTask = _.getWindowPropIfHas("Ajax.MyWorkTasks.Create");
            if (typeof fnCreateTask == "function") {
                var _self = this;
                Ajax.MyWorkTasks.Create = function () {
                    var res = fnCreateTask.apply(this, arguments);
                    _self.trackPage(Viewport.getControllerRouter().basePath + "/" + _self.names.createdEvent);
                    return res;
                };
            }
        },

        _urlRegExp: /^https?:\/\/[^\/]+\//,
        addHelpNavigationHandler: function () {
            if (!window.Viewport || typeof Viewport.onHelpClick != "function")
                return;

            var _self = this;

            Viewport.on("helpClickTop",function () {
                if (this.currentModule) {
                    if (this.currentModule.getContextHelpLink) {
                        var topicUrl = this.currentModule.getContextHelpLink();
                    } else if (this.currentModule.helpTopicId) {
                        topicUrl = Localizer.get('PROJECT.CONTEXTHELP.' + this.currentModule.helpTopicId.toUpperCase());
                    }
                }
                if (!topicUrl) {
                    topicUrl = Localizer.get('PROJECT.CONTEXTHELP.ROOT');
                }
                topicUrl = (topicUrl + "").replace(_self._urlRegExp, "");
                _self.trackPage(Viewport.getControllerRouter().basePath + "/" + _self.names.helpTopicEvent + "/" + topicUrl);
            });
        },

        addTutorialHandlers: function () {
            if (!window.Viewport || !_.getWindowPropIfHas("window.application.currentUser"))
                return;

            var _self = this,
                userModel = _.getWindowPropIfHas("window.application.currentUser");
            
            Viewport.on("beforeModuleStarted", function moduleLoadHandler(moduleName) {
                if (moduleName == "url:GettingStarted/Tutorial") {
                    Viewport.un("beforeModuleStarted", moduleLoadHandler);

                    var proto = _.getWindowPropIfHas("classes.tutorial.controller.TutorialController.prototype"),
                        fnStartTutorial = proto && proto.startTutorial,
                        fnFinishTutorial = proto && proto.tutorialFinished,
                        fnShowPreTrialForm = proto && proto.showPreTrialModalDialog;

                    if (typeof fnStartTutorial == "function") {
                        proto.startTutorial = function(nomatter, model) {
                            var res = fnStartTutorial.apply(this, arguments);

                            var tutorialId = model && model.get && model.get('tutorialId');
                            if (tutorialId) {
                                _self.trackPage(_self.names.tutorialStartEvent + "/" + tutorialId);
                            }

                            return res;
                        };
                    }
                    
                    if(typeof fnFinishTutorial == "function") {
                        proto.tutorialFinished = function (tutorialId) {
                            var res = fnFinishTutorial.apply(this, arguments);
                            if (tutorialId) {
                                _self.trackPage(_self.names.tutorialFinishEvent + "/" + tutorialId);
                            }

                            return res;
                        };
                    }

                    if (typeof fnShowPreTrialForm == "function") {
                        proto.showPreTrialModalDialog = function () {
                            var res = fnShowPreTrialForm.apply(this, arguments);
                            _self.trackPage(_self.names.tutorialShowPreTrialFormEvent);
                            userModel.once("change:NeedTrialInfo", function (model, newValue) {
                                if (newValue === false) {
                                    _self.trackPage(_self.names.tutorialClosePreTrialFormEvent);
                                }
                            });

                            return res;
                        };
                        
                        
                    }
                }
            });
        },

        trackPage: function (url) {
            if (window.flag_debug) {
                console.log("ga:" + url);
            }

            this._gaTracker.trackPageview(url ? "-" + url : "");
        }
    });
});

/*
 * lib dependencies
 */
define([
    'shared/general/GoogleAnalytics'
]);

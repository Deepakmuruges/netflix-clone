! function() {
    "use strict";
    var e = 2;
    async function t(e, t) {}
    async function n(e, t) {}
    async function o(e, t) {
        const n = {
            name: e.type || null,
            message: e.message || null,
            stack: e.error && e.error.stack,
            filename: e.filename,
            line: e.lineno,
            col: e.colno
        };
        t.logEvent("ExceptionOccurred", {
            error: {
                debug: n,
                code: "WindowOnError"
            }
        })
    }
    async function i(t, n) {
        t.data && "handshake" === t.data.type && (n.logEvent("DebugEvent", {
            type: "swHandshake"
        }), t.ports && t.ports[0] && t.ports[0].postMessage(e))
    }
    async function a(e, t) {}
    var s = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

    function r(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
    }

    function d(e, t) {
        return e(t = {
            exports: {}
        }, t.exports), t.exports
    }
    var c = d(function(e, t) {
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = function(e, t) {
            var n, o = function() {
                n || (n = setTimeout(function() {
                    n = null, e()
                }, t))
            };
            return o.flush = function() {
                n && (clearTimeout(n), n = null, e())
            }, o
        }
    });
    r(c);
    var m = d(function(e, t) {
        var n = s && s.__assign || function() {
                return (n = Object.assign || function(e) {
                    for (var t, n = 1, o = arguments.length; n < o; n++)
                        for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                    return e
                }).apply(this, arguments)
            },
            o = s && s.__importDefault || function(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Logger = void 0;
        var i = o(c),
            a = "7.1.5",
            r = Math.pow(2, 28) - 1,
            d = Math.pow(2, 25),
            m = function() {
                function e(e) {
                    var t = this;
                    this._loggerOptions = {
                        batchInterval: 3e4,
                        batchSize: 50,
                        timeOffset: 0,
                        getClientTime: this._getClientTime,
                        schema: this._schema,
                        source: "",
                        requestSender: function() {}
                    }, this._listenerMap = {}, this._state = {
                        sequenceNumber: 0,
                        lastIncrementingBits: 0,
                        pending: {},
                        current: {},
                        snapshots: [],
                        currentDelta: []
                    }, this._logSessionId = null, this._scheduledFlushTimeoutId = null, this.addListener = function(e, n, o, i) {
                        var a = ["willStart", "didStart", "willEnd", "didEnd"];
                        if (-1 === a.indexOf(n)) throw new Error('addListener: valid lifecycle names are: "' + a.join('", "') + '", but "' + n + '" was passed.');
                        if (!i || !i.once) throw new Error("addListener: You must pass an opts object with {once: true}, but opts was: " + JSON.stringify(i, null, 2) + ". This API is minimal but @nth can expand it for you if you want to use it without the `once` functionality.");
                        var s = t._listenerMap[e] = t._listenerMap[e] || {},
                            r = null === s || void 0 === s ? void 0 : s[n];
                        r ? r.push(o) : s && (s[n] = [o])
                    }, this._fireListeners = function(e, n, o) {
                        var i = t._listenerMap[e],
                            a = null === i || void 0 === i ? void 0 : i[n];
                        i && a && (a.forEach(function(e) {
                            e.apply(void 0, o)
                        }), delete i[n], i.willStart || i.willEnd || i.didStart || i.didEnd || delete t._listenerMap[e])
                    }, this.addContext = function(e, n) {
                        var o = t._initContext([e], n);
                        return t._state.pending[o.id] = o, o.id
                    }, this.removeContext = function(e) {
                        return t._state.pending[e] ? (delete t._state.pending[e], e) : t._state.current[e] ? (t._state.currentDelta.push(t._state.current[e]), delete t._state.current[e], e) : null
                    }, this.logEvent = function(e, n) {
                        var o = t._initEventContext([e, "DiscreteEvent"], n);
                        return t._snapshot([o]), o.id
                    }, this.startSession = function(e, n) {
                        t._fireListeners(e, "willStart", [e, n]);
                        var o = t._initEventContext([e, "Session"], n);
                        return t._state.current[o.id] = o, t._snapshot(), t._fireListeners(e, "didStart", [e, n]), o.id
                    }, this.endSession = function(e, n) {
                        var o = t._state.current[e];
                        if (o && "time" in o) {
                            var i = (null === n || void 0 === n ? void 0 : n.type) && "SessionEnded" !== n.type ? [n.type, "SessionEnded"] : ["SessionEnded"];
                            t._fireListeners(o.type[0], "willEnd", [o.type[0], n]);
                            var a = t._initEventContext(i, n);
                            return a.duration = a.time - o.time, a.sessionId = e, delete t._state.current[e], t._snapshot([a, o]), t._fireListeners(o.type[0], "didEnd", [o.type[0], n]), e
                        }
                        return null
                    }, this.flush = function() {
                        t._throttledSendEnvelope(), t._throttledSendEnvelope.flush()
                    }, this.sendEnvelope = function() {
                        var e = t._state;
                        if (!e.ending && e.snapshots && e.snapshots.length) {
                            var n = {
                                currentState: e.current,
                                reverseDeltas: e.snapshots,
                                type: "CompactConsolidatedLoggingEnvelope",
                                version: 2,
                                clientSendTime: t._timestamp()
                            };
                            e.snapshots = [], t._loggerOptions.requestSender(JSON.stringify(n))
                        }
                    }, this.serialize = function() {
                        return JSON.stringify(t)
                    }, this.sever = function(e) {
                        t.end(e), t._init(t._loggerOptions)
                    }, this.end = function(e) {
                        e && t.addContext(e), t._state.ending = !0;
                        for (var n = Object.keys(t._state.current).sort(function(e, t) {
                                return parseInt(t, 10) - parseInt(e, 10)
                            }), o = n.pop() || "", i = 0; i < n.length; i++) {
                            var a = t._state.current[n[i]],
                                s = a.type;
                            "Session" === s[s.length - 1] && t.endSession(a.id, {
                                type: "SessionCanceled"
                            })
                        }
                        var r = parseInt(o, 10);
                        t.endSession(r, {
                            type: "SessionEnded"
                        }), t._scheduledFlushTimeoutId && (clearTimeout(t._scheduledFlushTimeoutId), t._scheduledFlushTimeoutId = null), t._state.ending = !1, t.flush(), t._logSessionId = null
                    }, this.getLogSessionId = function() {
                        return t._logSessionId
                    }, this._init = function(e) {
                        t._initOptions(e), t._throttledSendEnvelope = (0, i.default)(t.sendEnvelope.bind(t), t._loggerOptions.batchInterval), e.existingState || t._startLogSession(), t._logInitializedEvent()
                    }, this._initOptions = function(e) {
                        e.existingState ? t._restore(e.existingState) : t._initState(), t._initProperties(e)
                    }, this._initState = function() {
                        t._state = {
                            sequenceNumber: 0,
                            lastIncrementingBits: 0,
                            pending: {},
                            current: {},
                            snapshots: [],
                            currentDelta: []
                        }
                    }, this._startLogSession = function() {
                        t._logSessionId = t.startSession("Log", {
                            source: t._loggerOptions.source,
                            schema: {
                                name: t._loggerOptions.schema.name,
                                version: t._loggerOptions.schema.version
                            }
                        })
                    }, this._logInitializedEvent = function() {
                        t.logEvent("LoggerInitialized", {
                            version: a
                        })
                    }, this._restore = function(e) {
                        for (var n = JSON.parse(e), o = Object.keys(n), i = 0; i < o.length; i++) {
                            var a = o[i];
                            "_state" === a || "_loggerOptions" === a ? t[a] = n[a] : a in t._loggerOptions && (t._loggerOptions[a] = n[a])
                        }
                    }, this._initProperties = function(e) {
                        if (t._loggerOptions = n(n({}, t._loggerOptions), e), !e.schema) throw new Error("@netflix/cl-logger: Option `schema` is required, but was missing.")
                    }, this._initContext = function(e, o) {
                        return n(n({}, o), {
                            type: t._loggerOptions.schema.types[e[0]] || e,
                            id: t._getNextContextId()
                        })
                    }, this._initEventContext = function(e, o) {
                        var i = t._initContext(e, o);
                        return n(n({}, i), {
                            sequence: ++t._state.sequenceNumber,
                            time: void 0 === i.time ? t._timestamp() : i.time
                        })
                    }, this._timestamp = function() {
                        return (t._loggerOptions.getClientTime || t._getClientTime)() + t._loggerOptions.timeOffset
                    }, this._getNextContextId = function() {
                        var e = Math.floor(t._timestamp() / 1e3),
                            n = Math.floor(Math.random() * d),
                            o = e & r;
                        return o <= t._state.lastIncrementingBits && (o = t._state.lastIncrementingBits + 1), t._state.lastIncrementingBits = o, o * d + n
                    }, this._snapshot = function(e) {
                        for (var n, o = t._state.current, i = t._state.pending, a = Object.keys(i), s = a.length, r = 1 + s, d = 0; d < s; d++) {
                            var c = a[d];
                            o[c] = i[c]
                        }
                        t._state.pending = {}, t._state.currentDelta.push(r), t._state.currentDelta = [], t._state.snapshots.push(t._state.currentDelta), t._throttledSendEnvelope(), e && e.length && (n = t._state.currentDelta).push.apply(n, e), !t._scheduledFlushTimeoutId && t._state.snapshots.length >= t._loggerOptions.batchSize && (t._scheduledFlushTimeoutId = setTimeout(function() {
                            t.flush(), t._scheduledFlushTimeoutId = null
                        }))
                    }, this._init(e)
                }
                return e.prototype._getClientTime = function() {
                    return (new Date).getTime()
                }, e
            }();
        t.Logger = m
    });
    r(m);
    m.Logger;
    var l = r(d(function(e, t) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.default = function(e) {
                return new m.Logger(e || {})
            }
        })),
        u = {
            version: "1.399.0",
            name: "netflixApp",
            types: {
                AcceptTermsOfUse: ["AcceptTermsOfUse", "Action", "Session"],
                ActivatedBundle: ["ActivatedBundle", "DiscreteAction", "DiscreteEvent"],
                AdaptiveEcomFallbackExperience: ["AdaptiveEcomFallbackExperience", "FallbackExperience"],
                AddCachedVideo: ["AddCachedVideo", "Action", "Session"],
                AddCachedVideoCommand: ["AddCachedVideoCommand", "Command", "Session"],
                AddProfile: ["AddProfile", "Action", "Session"],
                AddToPlaylist: ["AddToPlaylist", "Action", "Session"],
                AddToPlaylistCommand: ["AddToPlaylistCommand", "Command", "Session"],
                AppColdStartToRenderTraceReported: ["AppColdStartToRenderTraceReported", "PerformanceTraceReported", "MeasurementReported", "DiscreteEvent"],
                AppTtr: ["AppTtr", "PerformanceTraceTtr", "PerformanceTraceReported", "MeasurementReported", "DiscreteEvent"],
                AssistantInput: ["AssistantInput", "UserInput"],
                AuthenticateMdxPin: ["AuthenticateMdxPin", "Action", "Session"],
                BackCommand: ["BackCommand", "Command", "Session"],
                CachedPlay: ["CachedPlay", "Play", "Action", "Session"],
                CancelCommand: ["CancelCommand", "Command", "Session"],
                CancelMembership: ["CancelMembership", "Action", "Session"],
                Canceled: ["Canceled", "DiscreteAction", "DiscreteEvent"],
                CastDevice: ["CastDevice", "Action", "Session"],
                CatalogFiltersTitleResults: ["CatalogFiltersTitleResults", "DataModel"],
                ChangePlanToWatchCommand: ["ChangePlanToWatchCommand", "Command", "Session"],
                ChangeValueCommand: ["ChangeValueCommand", "Command", "Session"],
                ChangedValue: ["ChangedValue", "DiscreteAction", "DiscreteEvent"],
                CloseApp: ["CloseApp", "Action", "Session"],
                CloseAppCommand: ["CloseAppCommand", "Command", "Session"],
                CloseCommand: ["CloseCommand", "Command", "Session"],
                Closed: ["Closed", "DiscreteAction", "DiscreteEvent"],
                ConfirmPlanUpgrade: ["ConfirmPlanUpgrade", "Action", "Session"],
                ConnectWithLineAccount: ["ConnectWithLineAccount", "Action", "Session"],
                CreateAccount: ["CreateAccount", "Action", "Session"],
                DataPerformanceTraceReported: ["DataPerformanceTraceReported", "PerformanceTraceReported", "MeasurementReported", "DiscreteEvent"],
                DeepLinkInput: ["DeepLinkInput", "UserInput"],
                DeleteProfile: ["DeleteProfile", "Action", "Session"],
                Deselected: ["Deselected", "DiscreteAction", "DiscreteEvent"],
                DetectApp: ["DetectApp", "Action", "Session"],
                DirectedGestureInput: ["DirectedGestureInput", "GestureInput", "UserInput"],
                DispatchInput: ["DispatchInput", "Action", "Session"],
                Download: ["Download", "Action", "Session"],
                EditContentRestrictionCommand: ["EditContentRestrictionCommand", "Command", "Session"],
                EditPaymentCommand: ["EditPaymentCommand", "Command", "Session"],
                EditPlanCommand: ["EditPlanCommand", "Command", "Session"],
                EditProfile: ["EditProfile", "Action", "Session"],
                EditRow: ["EditRow", "Action", "Session"],
                EnterAudioMode: ["EnterAudioMode", "Action", "Session"],
                EnterFullscreenCommand: ["EnterFullscreenCommand", "Command", "Session"],
                EnterKidsModeCommand: ["EnterKidsModeCommand", "Command", "Session"],
                EntitySearch: ["EntitySearch", "Action", "Session"],
                ExitFullscreenCommand: ["ExitFullscreenCommand", "Command", "Session"],
                ExitKidsModeCommand: ["ExitKidsModeCommand", "Command", "Session"],
                FastForwardCommand: ["FastForwardCommand", "TrickplayCommand", "Command", "Session"],
                FillVideoCommand: ["FillVideoCommand", "Command", "Session"],
                FitVideoCommand: ["FitVideoCommand", "Command", "Session"],
                FollowCommand: ["FollowCommand", "Command", "Session"],
                ForwardCommand: ["ForwardCommand", "Command", "Session"],
                GestureInput: ["GestureInput", "UserInput"],
                Hid: ["Hid", "DiscreteAction", "DiscreteEvent"],
                HistogramReported: ["HistogramReported", "MeasurementReported", "DiscreteEvent"],
                HomeCommand: ["HomeCommand", "Command", "Session"],
                KeyboardInput: ["KeyboardInput", "UserInput"],
                LearnMoreCommand: ["LearnMoreCommand", "Command", "Session"],
                Like: ["Like", "Action", "Session"],
                LockUiCommand: ["LockUiCommand", "Command", "Session"],
                LolomoDataModel: ["LolomoDataModel", "DataModel"],
                LolomoTtr: ["LolomoTtr", "PerformanceTraceTtr", "PerformanceTraceReported", "MeasurementReported", "DiscreteEvent"],
                LolomoTtrTraceReported: ["LolomoTtrTraceReported", "PerformanceTraceReported", "MeasurementReported", "DiscreteEvent"],
                LoopBenchmarkReported: ["LoopBenchmarkReported", "MeasurementReported", "DiscreteEvent"],
                MobileConnection: ["MobileConnection", "NetworkConnection"],
                MoveToProfile: ["MoveToProfile", "Action", "Session"],
                MuteCommand: ["MuteCommand", "Command", "Session"],
                Navigate: ["Navigate", "Action", "Session"],
                NetflixId: ["NetflixId", "ProfileIdentity", "Session"],
                NotifyUms: ["NotifyUms", "Action", "Session"],
                Pair: ["Pair", "Action", "Session"],
                PauseCommand: ["PauseCommand", "TrickplayCommand", "Command", "Session"],
                PauseDownloadCommand: ["PauseDownloadCommand", "Command", "Session"],
                PerformanceTraceReported: ["PerformanceTraceReported", "MeasurementReported", "DiscreteEvent"],
                PerformanceTraceTtr: ["PerformanceTraceTtr", "PerformanceTraceReported", "MeasurementReported", "DiscreteEvent"],
                Play: ["Play", "Action", "Session"],
                PlayCommand: ["PlayCommand", "Command", "Session"],
                PlayFromBeginningCommand: ["PlayFromBeginningCommand", "Command", "Session"],
                PlayNextCommand: ["PlayNextCommand", "Command", "Session"],
                PlayRandomCommand: ["PlayRandomCommand", "Command", "Session"],
                PlayTrailerCommand: ["PlayTrailerCommand", "Command", "Session"],
                PointerInput: ["PointerInput", "UserInput"],
                PrepareOnramp: ["PrepareOnramp", "Action", "Session"],
                PreparePlay: ["PreparePlay", "Action", "Session"],
                PrequerySearch: ["PrequerySearch", "Action", "Session"],
                ProcessStateTransition: ["ProcessStateTransition", "Action", "Session"],
                ProfileGuid: ["ProfileGuid", "ProfileIdentity", "Session"],
                PushNotificationAcknowledged: ["PushNotificationAcknowledged", "PushNotificationResolved", "DiscreteEvent"],
                PushNotificationDismissed: ["PushNotificationDismissed", "PushNotificationAcknowledged", "PushNotificationResolved", "DiscreteEvent"],
                PushNotificationIgnored: ["PushNotificationIgnored", "PushNotificationResolved", "DiscreteEvent"],
                RedeemGiftCard: ["RedeemGiftCard", "Action", "Session"],
                RedeemGiftCardCommand: ["RedeemGiftCardCommand", "Command", "Session"],
                ReferFriendsCommand: ["ReferFriendsCommand", "Command", "Session"],
                RefreshCommand: ["RefreshCommand", "Command", "Session"],
                RegisterForPushNotifications: ["RegisterForPushNotifications", "Action", "Session"],
                RemoveAllCachedVideosCommand: ["RemoveAllCachedVideosCommand", "Command", "Session"],
                RemoveCachedVideo: ["RemoveCachedVideo", "Action", "Session"],
                RemoveCachedVideoAndPlayNextCommand: ["RemoveCachedVideoAndPlayNextCommand", "Command", "Session"],
                RemoveCachedVideoCommand: ["RemoveCachedVideoCommand", "Command", "Session"],
                RemoveDownloadDevice: ["RemoveDownloadDevice", "Action", "Session"],
                RemoveFromPlaylist: ["RemoveFromPlaylist", "Action", "Session"],
                RemoveFromPlaylistCommand: ["RemoveFromPlaylistCommand", "Command", "Session"],
                RemoveFromRow: ["RemoveFromRow", "Action", "Session"],
                RemoveFromViewingActivity: ["RemoveFromViewingActivity", "Action", "Session"],
                RemoveReaction: ["RemoveReaction", "Action", "Session"],
                RenderNavigationLevel: ["RenderNavigationLevel", "Action", "Session"],
                RenewDownloadCommand: ["RenewDownloadCommand", "Command", "Session"],
                ReplaySceneCommand: ["ReplaySceneCommand", "Command", "Session"],
                RequestLegalTermsEmail: ["RequestLegalTermsEmail", "Action", "Session"],
                RequestLegalTermsEmailCommand: ["RequestLegalTermsEmailCommand", "Command", "Session"],
                RequestSharedCredentials: ["RequestSharedCredentials", "Action", "Session"],
                RestoreAppState: ["RestoreAppState", "Action", "Session"],
                ResumeDownloadCommand: ["ResumeDownloadCommand", "Command", "Session"],
                RetryCommand: ["RetryCommand", "Command", "Session"],
                RetryDownloadCommand: ["RetryDownloadCommand", "Command", "Session"],
                RewatchCommand: ["RewatchCommand", "Command", "Session"],
                RewindCommand: ["RewindCommand", "TrickplayCommand", "Command", "Session"],
                ScrollToTopCommand: ["ScrollToTopCommand", "Command", "Session"],
                Search: ["Search", "Action", "Session"],
                SearchAutofillSuggestionResults: ["SearchAutofillSuggestionResults", "DataModel"],
                SearchCommand: ["SearchCommand", "Command", "Session"],
                SearchPreQueryResults: ["SearchPreQueryResults", "DataModel"],
                SearchSuggestionResults: ["SearchSuggestionResults", "DataModel"],
                SearchSuggestionTitleResults: ["SearchSuggestionTitleResults", "DataModel"],
                SearchTitleResults: ["SearchTitleResults", "DataModel"],
                SeekCommand: ["SeekCommand", "TrickplayCommand", "Command", "Session"],
                SelectCommand: ["SelectCommand", "Command", "Session"],
                SelectPlan: ["SelectPlan", "Action", "Session"],
                SelectProfile: ["SelectProfile", "Action", "Session"],
                SelectProfileCommand: ["SelectProfileCommand", "Command", "Session"],
                Selected: ["Selected", "DiscreteAction", "DiscreteEvent"],
                SelectedProfileAvatarModel: ["SelectedProfileAvatarModel", "DataModel"],
                SetReaction: ["SetReaction", "Action", "Session"],
                SetStarRating: ["SetStarRating", "Action", "Session"],
                SetThumbRating: ["SetThumbRating", "Action", "Session"],
                SetThumbRatingCommand: ["SetThumbRatingCommand", "Command", "Session"],
                SeveredForDanglingLog: ["SeveredForDanglingLog", "Severed"],
                SeveredForVppa: ["SeveredForVppa", "Severed"],
                SeveredForWebpageUnload: ["SeveredForWebpageUnload", "Severed"],
                Share: ["Share", "Action", "Session"],
                ShareCommand: ["ShareCommand", "Command", "Session"],
                ShowAllCommand: ["ShowAllCommand", "Command", "Session"],
                ShowLessCommand: ["ShowLessCommand", "Command", "Session"],
                ShowMoreCommand: ["ShowMoreCommand", "Command", "Session"],
                ShowedAll: ["ShowedAll", "DiscreteAction", "DiscreteEvent"],
                ShowedLess: ["ShowedLess", "DiscreteAction", "DiscreteEvent"],
                ShowedMore: ["ShowedMore", "DiscreteAction", "DiscreteEvent"],
                SignIn: ["SignIn", "Action", "Session"],
                SignInCommand: ["SignInCommand", "Command", "Session"],
                SignInWithAutoLoginToken: ["SignInWithAutoLoginToken", "SignIn", "Action", "Session"],
                SignInWithFacebook: ["SignInWithFacebook", "SignIn", "Action", "Session"],
                SignInWithGoogleSmartLock: ["SignInWithGoogleSmartLock", "SignIn", "Action", "Session"],
                SignOut: ["SignOut", "Action", "Session"],
                SignOutCommand: ["SignOutCommand", "Command", "Session"],
                SignUpCommand: ["SignUpCommand", "Command", "Session"],
                SkipAheadCommand: ["SkipAheadCommand", "TrickplayCommand", "Command", "Session"],
                SkipBackCommand: ["SkipBackCommand", "TrickplayCommand", "Command", "Session"],
                SkipCommand: ["SkipCommand", "Command", "Session"],
                Skipped: ["Skipped", "DiscreteAction", "DiscreteEvent"],
                SleepTimer: ["SleepTimer", "Countdown", "Session"],
                StartMembership: ["StartMembership", "Action", "Session"],
                StartMembershipCommand: ["StartMembershipCommand", "Command", "Session"],
                StartPlay: ["StartPlay", "Action", "Session"],
                StoreSharedCredentials: ["StoreSharedCredentials", "Action", "Session"],
                SubmitCommand: ["SubmitCommand", "Command", "Session"],
                SubmitContentFilters: ["SubmitContentFilters", "Action", "Session"],
                SubmitDeviceSurveyResults: ["SubmitDeviceSurveyResults", "Action", "Session"],
                SubmitGenreCollectionsResults: ["SubmitGenreCollectionsResults", "Action", "Session"],
                SubmitOnrampResults: ["SubmitOnrampResults", "Action", "Session"],
                SubmitSecondaryLanguagesResults: ["SubmitSecondaryLanguagesResults", "Action", "Session"],
                Submitted: ["Submitted", "DiscreteAction", "DiscreteEvent"],
                SystemPerformanceTraceReported: ["SystemPerformanceTraceReported", "PerformanceTraceReported", "MeasurementReported", "DiscreteEvent"],
                ThrottleSearch: ["ThrottleSearch", "Action", "Session"],
                UnavailableContentCommand: ["UnavailableContentCommand", "Command", "Session"],
                Undo: ["Undo", "DiscreteAction", "DiscreteEvent"],
                UnfollowCommand: ["UnfollowCommand", "Command", "Session"],
                Unlike: ["Unlike", "Action", "Session"],
                UnlockUiCommand: ["UnlockUiCommand", "Command", "Session"],
                UnmuteCommand: ["UnmuteCommand", "Command", "Session"],
                UnpauseCommand: ["UnpauseCommand", "TrickplayCommand", "Command", "Session"],
                UpdateNavigationLevel: ["UpdateNavigationLevel", "Action", "Session"],
                UpdatePaymentInfo: ["UpdatePaymentInfo", "Action", "Session"],
                UpdateProfiles: ["UpdateProfiles", "Action", "Session"],
                UpdateTestParticipation: ["UpdateTestParticipation", "Action", "Session"],
                ValidateInput: ["ValidateInput", "Action", "Session"],
                ValidateMemberId: ["ValidateMemberId", "Action", "Session"],
                ValidatePin: ["ValidatePin", "Action", "Session"],
                ViewAccountMenuCommand: ["ViewAccountMenuCommand", "Command", "Session"],
                ViewAudioSubtitlesSelectorCommand: ["ViewAudioSubtitlesSelectorCommand", "Command", "Session"],
                ViewCachedVideosCommand: ["ViewCachedVideosCommand", "Command", "Session"],
                ViewCategoriesCommand: ["ViewCategoriesCommand", "Command", "Session"],
                ViewCategoryHubCommand: ["ViewCategoryHubCommand", "Command", "Session"],
                ViewDetailsCommand: ["ViewDetailsCommand", "Command", "Session"],
                ViewEpisodesSelectorCommand: ["ViewEpisodesSelectorCommand", "Command", "Session"],
                ViewHelpCommand: ["ViewHelpCommand", "Command", "Session"],
                ViewLanguageHubCommand: ["ViewLanguageHubCommand", "Command", "Session"],
                ViewLegalTermsCommand: ["ViewLegalTermsCommand", "Command", "Session"],
                ViewNewsFeedCommand: ["ViewNewsFeedCommand", "Command", "Session"],
                ViewNotificationsCommand: ["ViewNotificationsCommand", "Command", "Session"],
                ViewPreviewsCommand: ["ViewPreviewsCommand", "Command", "Session"],
                ViewProfilesCommand: ["ViewProfilesCommand", "Command", "Session"],
                ViewSettingsCommand: ["ViewSettingsCommand", "Command", "Session"],
                ViewSimilarsCommand: ["ViewSimilarsCommand", "Command", "Session"],
                ViewSpecialPromotionCommand: ["ViewSpecialPromotionCommand", "Command", "Session"],
                ViewTitlesCommand: ["ViewTitlesCommand", "Command", "Session"],
                VisitorDeviceId: ["VisitorDeviceId", "AccountIdentity", "Session"],
                VoiceInput: ["VoiceInput", "UserInput"],
                WatchCreditsCommand: ["WatchCreditsCommand", "Command", "Session"],
                WifiConnection: ["WifiConnection", "NetworkConnection"],
                WiredConnection: ["WiredConnection", "NetworkConnection"],
                "accessibility.ColorCorrectionContext": ["accessibility.ColorCorrectionContext", "accessibility.AccessibilityToolContext"],
                "accessibility.ScreenReaderContext": ["accessibility.ScreenReaderContext", "accessibility.AccessibilityToolContext"],
                "android.AmazonPushNotificationOptions": ["android.AmazonPushNotificationOptions", "android.PushNotificationOptions"],
                "android.AndroidPushNotificationOptions": ["android.AndroidPushNotificationOptions", "android.PushNotificationOptions"],
                "android.CachedMetadataRendered": ["android.CachedMetadataRendered", "MetadataRendered", "DiscreteEvent"],
                "android.MinusOneRequest": ["android.MinusOneRequest", "Action", "Session"],
                "android.PartnerInput": ["android.PartnerInput", "UserInput"],
                "android.RefreshLolomo": ["android.RefreshLolomo", "Action", "Session"],
                "android.RemoveCachedVideoWithFeature": ["android.RemoveCachedVideoWithFeature", "RemoveCachedVideo", "Action", "Session"],
                "android.SystemBackCommand": ["android.SystemBackCommand", "Command", "Session"],
                "ce.EmailAddress": ["ce.EmailAddress", "ce.UserIdentity"],
                "ce.search.FetchResults": ["ce.search.FetchResults", "Action", "Session"],
                "ce.search.FetchSuggestions": ["ce.search.FetchSuggestions", "Action", "Session"],
                "cs.Call": ["cs.Call", "Action", "Session"],
                "cs.CallCommand": ["cs.CallCommand", "Command", "Session"],
                "cs.ChatCommand": ["cs.ChatCommand", "Command", "Session"],
                "cs.EndCallCommand": ["cs.EndCallCommand", "Command", "Session"],
                "edx.AlertsOperation": ["edx.AlertsOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.AtlasOperation": ["edx.AtlasOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.ChronosOperation": ["edx.ChronosOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.CommandLineInterface": ["edx.CommandLineInterface", "Action", "Session"],
                "edx.DashboardsOperation": ["edx.DashboardsOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.ElasticSearchOperation": ["edx.ElasticSearchOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.GitOperation": ["edx.GitOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.HttpRequest": ["edx.HttpRequest", "Action", "Session"],
                "edx.KeymasterOperation": ["edx.KeymasterOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.MantisOperation": ["edx.MantisOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.MeechumUserIdentity": ["edx.MeechumUserIdentity", "edx.UserIdentity"],
                "edx.MetatronUserIdentity": ["edx.MetatronUserIdentity", "edx.UserIdentity"],
                "edx.NodeQuarkIndexOperation": ["edx.NodeQuarkIndexOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.PagerDutyOperation": ["edx.PagerDutyOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.PrimerIndexOperation": ["edx.PrimerIndexOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.PrimerOperation": ["edx.PrimerOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.RavenOperation": ["edx.RavenOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.SkipperOperation": ["edx.SkipperOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.SpinnakerOperation": ["edx.SpinnakerOperation", "edx.ApiOperation", "Action", "Session"],
                "edx.TitusOperation": ["edx.TitusOperation", "edx.ApiOperation", "Action", "Session"],
                "ftl.BackgroundSession": ["ftl.BackgroundSession", "ftl.Session", "Session"],
                "ftl.ColdStartSession": ["ftl.ColdStartSession", "ftl.Session", "Session"],
                "ftl.ConfigChangedSession": ["ftl.ConfigChangedSession", "ftl.Session", "Session"],
                "ftl.NetworkChangeSession": ["ftl.NetworkChangeSession", "ftl.Session", "Session"],
                "ftl.WarmStartSession": ["ftl.WarmStartSession", "ftl.Session", "Session"],
                "game.GameHeartbeat": ["game.GameHeartbeat", "game.GameplayEvent", "DiscreteEvent"],
                "game.GameplayStart": ["game.GameplayStart", "game.GameplayEvent", "DiscreteEvent"],
                "game.GameplayStop": ["game.GameplayStop", "game.GameplayEvent", "DiscreteEvent"],
                "game.PlayerStateEvent": ["game.PlayerStateEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.PlayerStateRequested": ["game.PlayerStateRequested", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.CloudGameplayEvent": ["game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.ControllerGameplayEvent": ["game.cloud.ControllerGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.DisplayGameplayEvent": ["game.cloud.DisplayGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.GameHeartbeat": ["game.cloud.GameHeartbeat", "game.cloud.OcgaGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.GameSessionStartFromOCGA": ["game.cloud.GameSessionStartFromOCGA", "game.cloud.OcgaGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.GameplayAttempt": ["game.cloud.GameplayAttempt", "game.cloud.DisplayGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.GameplayDebug": ["game.cloud.GameplayDebug", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.GameplayStart": ["game.cloud.GameplayStart", "game.cloud.OcgaGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.GameplayStatus": ["game.cloud.GameplayStatus", "game.cloud.OcgaGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.GameplayStopFromDisplay": ["game.cloud.GameplayStopFromDisplay", "game.cloud.DisplayGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.GameplayStopFromOCGA": ["game.cloud.GameplayStopFromOCGA", "game.cloud.OcgaGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.HardwareVideoEncodingQualityUpdate": ["game.cloud.HardwareVideoEncodingQualityUpdate", "game.cloud.OcgaGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.cloud.OcgaGameplayEvent": ["game.cloud.OcgaGameplayEvent", "game.cloud.CloudGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "game.mobile.GameHeartbeat": ["game.mobile.GameHeartbeat", "game.GameplayEvent", "DiscreteEvent"],
                "game.mobile.GameplayStart": ["game.mobile.GameplayStart", "game.GameplayEvent", "DiscreteEvent"],
                "game.mobile.GameplayStop": ["game.mobile.GameplayStop", "game.GameplayEvent", "DiscreteEvent"],
                "game.mobile.SignedInFailedWithErrors": ["game.mobile.SignedInFailedWithErrors", "game.mobile.SignInFailed", "DiscreteEvent"],
                "iko.EndCommand": ["iko.EndCommand", "Command", "Session"],
                "iko.EnterBattleCommand": ["iko.EnterBattleCommand", "Command", "Session"],
                "ios.LoadConfigurationService": ["ios.LoadConfigurationService", "Action", "Session"],
                "ios.LoadDownloadService": ["ios.LoadDownloadService", "Action", "Session"],
                "ios.LoadIdentityService": ["ios.LoadIdentityService", "Action", "Session"],
                "ios.LoadNrdService": ["ios.LoadNrdService", "Action", "Session"],
                "pft.RunTest": ["pft.RunTest", "Action", "Session"],
                "pulse.PulseDataModel": ["pulse.PulseDataModel", "DataModel"],
                "secondscreen.BeaconCreation": ["secondscreen.BeaconCreation", "game.cloud.ControllerGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "secondscreen.CancelModal": ["secondscreen.CancelModal", "game.cloud.ControllerGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "secondscreen.Connection": ["secondscreen.Connection", "game.cloud.ControllerGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "secondscreen.ConnectionTrigger": ["secondscreen.ConnectionTrigger", "game.cloud.ControllerGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "secondscreen.ControllersReady": ["secondscreen.ControllersReady", "game.cloud.ControllerGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "secondscreen.DisplayModal": ["secondscreen.DisplayModal", "game.cloud.ControllerGameplayEvent", "game.GameplayEvent", "DiscreteEvent"],
                "tvui.AppMemoryHistogramReported": ["tvui.AppMemoryHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.BoxshotLoadTimeHistogramReported": ["tvui.BoxshotLoadTimeHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.DecodeTimeMeasurementReported": ["tvui.DecodeTimeMeasurementReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.FrameTimeHistogramReported": ["tvui.FrameTimeHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.GcTimeMeasurementReported": ["tvui.GcTimeMeasurementReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.GraphicsMemoryHistogramReported": ["tvui.GraphicsMemoryHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.ImageLoadTimeHistogramReported": ["tvui.ImageLoadTimeHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.ImagePresentationTimeHistogramReported": ["tvui.ImagePresentationTimeHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.JankMeasurementReported": ["tvui.JankMeasurementReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.JsEventLoopDelayHistogramReported": ["tvui.JsEventLoopDelayHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.JsMemoryHistogramReported": ["tvui.JsMemoryHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.KeyResponseTimeHistogramReported": ["tvui.KeyResponseTimeHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.MetadataDownloadPlayDelay": ["tvui.MetadataDownloadPlayDelay", "tvui.PlayDelay", "Session"],
                "tvui.NonMemberTransited": ["tvui.NonMemberTransited", "DiscreteAction", "DiscreteEvent"],
                "tvui.NrdAuthorizeCredentials": ["tvui.NrdAuthorizeCredentials", "Action", "Session"],
                "tvui.NrdGetExternalUserToken": ["tvui.NrdGetExternalUserToken", "Action", "Session"],
                "tvui.NrdGetMopToken": ["tvui.NrdGetMopToken", "Action", "Session"],
                "tvui.NrdGetPaymentTokenAndPinRequirement": ["tvui.NrdGetPaymentTokenAndPinRequirement", "Action", "Session"],
                "tvui.NrdInitPayment": ["tvui.NrdInitPayment", "Action", "Session"],
                "tvui.NrdRequestExternalPaymentData": ["tvui.NrdRequestExternalPaymentData", "Action", "Session"],
                "tvui.OtpRequested": ["tvui.OtpRequested", "DiscreteAction", "DiscreteEvent"],
                "tvui.PlatformPlayDelay": ["tvui.PlatformPlayDelay", "tvui.PlayDelay", "Session"],
                "tvui.RequestImeCandidateList": ["tvui.RequestImeCandidateList", "Action", "Session"],
                "tvui.RetrieveCredential": ["tvui.RetrieveCredential", "Action", "Session"],
                "tvui.SignInWithDynecom": ["tvui.SignInWithDynecom", "SignIn", "Action", "Session"],
                "tvui.SignInWithMdx": ["tvui.SignInWithMdx", "SignIn", "Action", "Session"],
                "tvui.SurfaceCacheHistogramReported": ["tvui.SurfaceCacheHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.SwapMemoryHistogramReported": ["tvui.SwapMemoryHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "tvui.UiPlayDelay": ["tvui.UiPlayDelay", "tvui.PlayDelay", "Session"],
                "tvui.ValidateSignIn": ["tvui.ValidateSignIn", "Action", "Session"],
                "tvui.VideoPresentationPlayDelay": ["tvui.VideoPresentationPlayDelay", "tvui.PlayDelay", "Session"],
                "tvui.VisualInputLatencyHistogramReported": ["tvui.VisualInputLatencyHistogramReported", "HistogramReported", "MeasurementReported", "DiscreteEvent"],
                "web.worker.HandleActivate": ["web.worker.HandleActivate", "web.worker.HandleEvent", "Action", "Session"],
                "web.worker.HandleError": ["web.worker.HandleError", "web.worker.HandleEvent", "Action", "Session"],
                "web.worker.HandleFetch": ["web.worker.HandleFetch", "web.worker.HandleEvent", "Action", "Session"],
                "web.worker.HandleInstall": ["web.worker.HandleInstall", "web.worker.HandleEvent", "Action", "Session"],
                "web.worker.HandleMessage": ["web.worker.HandleMessage", "web.worker.HandleEvent", "Action", "Session"],
                "web.worker.HandleSync": ["web.worker.HandleSync", "web.worker.HandleEvent", "Action", "Session"],
                "www.DownloadAppCommand": ["www.DownloadAppCommand", "Command", "Session"],
                "www.ExtendedAreaFocus": ["www.ExtendedAreaFocus", "Focus", "Session"],
                "www.UpdateCommunicationPreferences": ["www.UpdateCommunicationPreferences", "Action", "Session"],
                "www.UpdateSubtitlePreferences": ["www.UpdateSubtitlePreferences", "Action", "Session"]
            }
        },
        p = d(function(e) {
            ! function() {
                var t;

                function n(e, n) {
                    return (t || (t = new Promise(function(e, t) {
                        var n = indexedDB.open("keyval-store", 1);
                        n.onerror = function() {
                            t(n.error)
                        }, n.onupgradeneeded = function() {
                            n.result.createObjectStore("keyval")
                        }, n.onsuccess = function() {
                            e(n.result)
                        }
                    })), t).then(function(t) {
                        return new Promise(function(o, i) {
                            var a = t.transaction("keyval", e);
                            a.oncomplete = function() {
                                o()
                            }, a.onabort = a.onerror = function() {
                                i(a.error)
                            }, n(a.objectStore("keyval"))
                        })
                    })
                }
                var o = {
                    get: function(e) {
                        var t;
                        return n("readonly", function(n) {
                            t = n.get(e)
                        }).then(function() {
                            return t.result
                        })
                    },
                    set: function(e, t) {
                        return n("readwrite", function(n) {
                            n.put(t, e)
                        })
                    },
                    delete: function(e) {
                        return n("readwrite", function(t) {
                            t.delete(e)
                        })
                    },
                    clear: function() {
                        return n("readwrite", function(e) {
                            e.clear()
                        })
                    },
                    keys: function() {
                        var e = [];
                        return n("readonly", function(t) {
                            (t.openKeyCursor || t.openCursor).call(t).onsuccess = function() {
                                this.result && (e.push(this.result.key), this.result.continue())
                            }
                        }).then(function() {
                            return e
                        })
                    }
                };
                e.exports ? e.exports = o : self.idbKeyval = o
            }()
        });
    const S = 3,
        g = 3e3;
    let h;

    function f(e) {
        const t = async (o, i = 1) => {
            try {
                const a = new Request("/personalization/cl2", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: o,
                    credentials: "include"
                });
                return await e(a)
            } catch (e) {
                if (i <= S) return await (n = g, new Promise(e => setTimeout(e, n))), t(o, i + 1);
                throw e
            }
        };
        var n;
        return t
    }
    async function C(e, t = 1) {
        return fetch("/personalization/cl2", {
            body: e,
            headers: {
                "content-type": "application/json"
            },
            credentials: "include",
            method: "POST"
        }).catch(o => {
            if (t <= S) return (n = g, new Promise(e => {
                setTimeout(() => {
                    e()
                }, n)
            })).then(() => C(e, t += 1));
            throw o
        });
        var n
    }
    var v = {
        getInstance: async () => new Promise(async (e, t) => {
            h || (h = await p.get("clId").catch(e => {}));
            const n = l({
                batchInterval: 1 / 0,
                batchSize: 1 / 0,
                requestSender: C,
                source: "www-sw",
                schema: u
            });
            h || (h = String(n._getNextContextId()), await p.set("clId", h).catch(e => {})), n.addContext("web.worker.WorkerId", {
                workerId: h
            }), e(n)
        }),
        flushInstance: async e => new Promise((t, n) => {
            e._loggerOptions.requestSender = (async e => {
                await C(e), t()
            }), e.end()
        })
    };
    const y = {
        fetch: "web.worker.HandleFetch",
        fetchshadowTraffic: "web.worker.HandleFetch",
        message: "web.worker.HandleMessage",
        install: "web.worker.HandleInstall",
        activate: "web.worker.HandleActivate",
        sync: "web.worker.HandleSync",
        error: "web.worker.HandleError",
        push: "web.worker.HandlePush",
        notificationclick: "web.worker.HandleNotificationClick",
        notificationclose: "web.worker.HandleNotificationClose"
    };
    async function w(t, n) {
        const o = await v.getInstance();
        o.addContext("web.worker.WorkerVersion", {
            version: String(e)
        });
        const i = o.startSession(y[n.type], {
            eventType: n.type
        });
        try {
            await t(n, o), o.endSession(i)
        } catch (e) {
            throw o.endSession(i, {
                type: "SessionCanceled"
            }), e
        }
        await v.flushInstance(o)
    }
    const E = e => new Promise((t, n) => {
            const o = indexedDB.open("akira", 2);
            o.onupgradeneeded = function(t) {
                t.target.result.createObjectStore(e, {
                    keyPath: "key"
                })
            }, o.onerror = function(e) {
                return n(e)
            }, o.onsuccess = function(e) {
                const n = e.target.result;
                return t(n)
            }
        }),
        A = ({
            objectStoreName: e,
            objectStoreKey: t,
            value: n
        }) => new Promise((o, i) => {
            E(e).then(a => {
                const s = a.transaction([e], "readwrite"),
                    r = s.objectStore(e).put(Object.assign({
                        key: t
                    }, n));
                r.onsuccess = function(e) {
                    return o()
                }, r.onerror = function(e) {
                    return i(e)
                }, s.oncomplete = function() {
                    a.close()
                }
            })
        });
    var R = r(d(function(e, t) {
            ! function(e, t) {
                for (var n in t) e[n] = t[n]
            }(t, function(e) {
                var t = {};

                function n(o) {
                    if (t[o]) return t[o].exports;
                    var i = t[o] = {
                        i: o,
                        l: !1,
                        exports: {}
                    };
                    return e[o].call(i.exports, i, i.exports, n), i.l = !0, i.exports
                }
                return n.m = e, n.c = t, n.d = function(e, t, o) {
                    n.o(e, t) || Object.defineProperty(e, t, {
                        enumerable: !0,
                        get: o
                    })
                }, n.r = function(e) {
                    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                        value: "Module"
                    }), Object.defineProperty(e, "__esModule", {
                        value: !0
                    })
                }, n.t = function(e, t) {
                    if (1 & t && (e = n(e)), 8 & t) return e;
                    if (4 & t && "object" == typeof e && e && e.__esModule) return e;
                    var o = Object.create(null);
                    if (n.r(o), Object.defineProperty(o, "default", {
                            enumerable: !0,
                            value: e
                        }), 2 & t && "string" != typeof e)
                        for (var i in e) n.d(o, i, function(t) {
                            return e[t]
                        }.bind(null, i));
                    return o
                }, n.n = function(e) {
                    var t = e && e.__esModule ? function() {
                        return e.default
                    } : function() {
                        return e
                    };
                    return n.d(t, "a", t), t
                }, n.o = function(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t)
                }, n.p = "", n(n.s = "./src/ftl/index.ts")
            }({
                "./src/ftl/config.ts": function(e, t, n) {
                    n.r(t), n.d(t, "FtlTarget", function() {
                        return i
                    }), n.d(t, "FtlConfig", function() {
                        return a
                    });
                    var o = function(e, t, n, o) {
                        return new(n || (n = Promise))(function(i, a) {
                            function s(e) {
                                try {
                                    d(o.next(e))
                                } catch (e) {
                                    a(e)
                                }
                            }

                            function r(e) {
                                try {
                                    d(o.throw(e))
                                } catch (e) {
                                    a(e)
                                }
                            }

                            function d(e) {
                                e.done ? i(e.value) : new n(function(t) {
                                    t(e.value)
                                }).then(s, r)
                            }
                            d((o = o.apply(e, t || [])).next())
                        })
                    };
                    class i {
                        constructor(e, t) {
                            this.name = e, this.host = t
                        }
                        equals(e) {
                            return e && this.name === e.name && this.host === e.host
                        }
                    }
                    class a {
                        constructor(e, t, n, o, i) {
                            this.cell = e, this.maxErrors = t, this.errorsThrottleLimit = n, this.hosts = o, this.targets = i
                        }
                        static parse(e) {
                            let t = 0,
                                n = -1,
                                o = 0,
                                s = [],
                                r = [];
                            for (let a in e) {
                                const d = e[a];
                                switch (a) {
                                    case "cell":
                                        if ("number" != typeof d) throw Error("Invalid cell type");
                                        t = d;
                                        break;
                                    case "maxErrors":
                                        if ("number" != typeof d) throw Error("Invalid maxErrors type");
                                        n = d;
                                        break;
                                    case "errorsThrottleLimit":
                                        if ("number" != typeof d) throw Error("Invalid errorsThrottleLimit type");
                                        o = d;
                                        break;
                                    case "hosts":
                                        if (!Array.isArray(d)) throw Error("Invalid hosts type");
                                        for (let e of d) {
                                            if ("string" != typeof e) throw Error("Invalid host type");
                                            s.push(e)
                                        }
                                        break;
                                    case "targets":
                                        if (!Array.isArray(d)) throw Error("Invalid targets type");
                                        for (let e of d) {
                                            if ("object" != typeof e || "string" != typeof e.name || "string" != typeof e.host) throw Error("Invalid target type");
                                            if (e.host && !e.host.endsWith(".netflix.com")) throw Error("Target host is not a netflix.com domain");
                                            r.push(new i(e.name, e.host))
                                        }
                                }
                            }
                            if (-1 === n) throw Error("Missing maxErrors");
                            if (0 === s.length) throw Error("Missing hosts");
                            if (0 === r.length) throw Error("Missing targets");
                            return new a(t, n, o, s, r)
                        }
                        static equals(e, t) {
                            if (e === t) return !0;
                            if (!e || !t || e.cell != t.cell || e.maxErrors != t.maxErrors || e.hosts != t.hosts || e.targets.length != t.targets.length) return !1;
                            for (let n = 0; n < e.targets.length; n++)
                                if (e.targets[n].name != t.targets[n].name || e.targets[n].host != t.targets[n].host) return !1;
                            return !0
                        }
                        static store(e) {
                            return o(this, void 0, void 0, function*() {
                                const t = yield caches.open(a.cacheName), n = new Request("/ftl/config"), o = new Response(JSON.stringify(e));
                                t.put(n, o)
                            })
                        }
                        static load() {
                            return o(this, void 0, void 0, function*() {
                                const e = yield caches.open(a.cacheName), t = new Request("/ftl/config"), n = yield e.match(t);
                                if (n) {
                                    const e = yield n.text();
                                    return a.parse(JSON.parse(e))
                                }
                                return null
                            })
                        }
                        targetNames() {
                            let e = [];
                            for (let t of this.targets) e.push(t.name);
                            return e
                        }
                        nextTarget(e) {
                            let t = 0;
                            for (t = 1; t < this.targets.length && this.targets[t - 1].name !== e.name; t++);
                            return t >= this.targets.length ? null : this.targets[t]
                        }
                        allowed(e) {
                            return -1 !== this.hosts.indexOf(e.host)
                        }
                    }
                    a.cacheName = "config-cache"
                },
                "./src/ftl/error.ts": function(e, t, n) {
                    n.r(t), n.d(t, "FtlError", function() {
                        return o
                    });
                    class o {
                        constructor(e, t) {
                            this.code = e, this.target = t.target.name, this.hostname = t.target.host, this.protocol = "https", this.duration = t.duration, t.error && (this.platformError = {
                                code: "0",
                                message: t.error.message
                            }), this.fallback = !1, this.tag = "unknown", this.counters = {
                                requests: t.stats.requests,
                                errors: t.stats.errors + 1,
                                consecutiveErrors: t.stats.consecutiveErrors + 1
                            }
                        }
                    }
                },
                "./src/ftl/ftl.ts": function(e, t, n) {
                    n.r(t), n.d(t, "Ftl", function() {
                        return r
                    });
                    var o = n("./src/ftl/config.ts"),
                        i = n("./src/ftl/error.ts"),
                        a = n("./src/ftl/stats.ts"),
                        s = function(e, t, n, o) {
                            return new(n || (n = Promise))(function(i, a) {
                                function s(e) {
                                    try {
                                        d(o.next(e))
                                    } catch (e) {
                                        a(e)
                                    }
                                }

                                function r(e) {
                                    try {
                                        d(o.throw(e))
                                    } catch (e) {
                                        a(e)
                                    }
                                }

                                function d(e) {
                                    e.done ? i(e.value) : new n(function(t) {
                                        t(e.value)
                                    }).then(s, r)
                                }
                                d((o = o.apply(e, t || [])).next())
                            })
                        };
                    class r {
                        constructor(e) {
                            this.inited = !1, this.disabled = !1, this.config = null, this.online = !0, this.clSession = null, this.clTarget = null, this.clVia = null, this.cl = e, this.fetch = ((e, t) => fetch(e, t)), "undefined" != typeof performance ? this.now = (() => performance.now()) : this.now = (() => (new Date).getTime())
                        }
                        updateConfig(e) {
                            this.inited && o.FtlConfig.equals(this.config, e) || (this.config = e, this.inited ? this.startSession("ftl.ConfigChangedSession") : (this.inited = !0, this.startSession("ftl.ColdStartSession")))
                        }
                        updateNetworkConfiguration(e) {
                            this.online = e, this.startSession("ftl.NetworkChangeSession")
                        }
                        canRoute(e) {
                            if ("true" === e.headers.get("X-Netflix-FTL-Bypass")) return !1;
                            const t = new URL(e.url);
                            return !!this.config && this.config.allowed(t) && !this.disabled
                        }
                        route(e) {
                            return s(this, void 0, void 0, function*() {
                                let t = new URL(e.url);
                                if (!this.config) throw new Error("FTL not enabled");
                                if (!this.config.allowed(t)) throw new Error("request not allowed");
                                if (this.disabled) return yield this.fetch(e);
                                this.stats.requests++;
                                const n = this.now(),
                                    o = {
                                        duration: 0,
                                        stats: this.stats,
                                        target: this.target,
                                        request: e
                                    };
                                try {
                                    this.target.host && (t.host = this.target.host, e = yield this.routeRequest(e, t)), o.response = yield this.fetch(e)
                                } catch (e) {
                                    o.error = e
                                }
                                if (o.duration = this.now() - n, this.handleResponse(o), o.error || !o.response) throw o.error;
                                return o.response
                            })
                        }
                        handleResponse(e) {
                            if (!this.config) return;
                            const t = this.ftlError(e);
                            if (e.response) {
                                const t = e.response.headers.get("Via");
                                t && this.updateVia(t)
                            }
                            if (t) {
                                if (this.stats.errors++, this.stats.consecutiveErrors++, this.config.targets.length > 1 && (418 === t.code || this.stats.consecutiveErrors >= this.config.maxErrors)) {
                                    const n = this.config.nextTarget(this.target);
                                    n && e.target.equals(this.target) && (t.fallback = !0, this.stats.consecutiveErrors = 0, this.updateTarget(n), this.updateVia(null))
                                }
                                this.config.errorsThrottleLimit && this.stats.consecutiveErrors >= this.config.errorsThrottleLimit && null === this.config.nextTarget(this.target) && (this.disabled = !0), this.cl.logEvent("ftl.ErrorOccurred", t)
                            } else this.stats.consecutiveErrors = 0
                        }
                        ftlError(e) {
                            if (e.response && e.response.status >= 400) {
                                const t = e.response.headers.get("X-Ftl-Error");
                                if (t) {
                                    const n = new i.FtlError(e.response.status, e);
                                    return n.ftlError = t, n
                                }
                            }
                            return this.online && (e.error || e.response && 0 === e.response.status) ? new i.FtlError(0, e) : null
                        }
                        routeRequest(e, t) {
                            return s(this, void 0, void 0, function*() {
                                let n;
                                return "GET" != e.method && "HEAD" != e.method && (n = e.blob ? yield e.blob(): yield e.text()), new Request(t.toString(), {
                                    method: e.method,
                                    headers: e.headers,
                                    body: n,
                                    cache: e.cache,
                                    mode: "cors",
                                    credentials: "include",
                                    redirect: "follow",
                                    integrity: e.integrity,
                                    keepalive: e.keepalive,
                                    referrer: e.referrer,
                                    referrerPolicy: e.referrerPolicy
                                })
                            })
                        }
                        startSession(e) {
                            null !== this.clSession && (this.cl.endSession(this.clSession), this.clSession = null), null !== this.clTarget && (this.cl.removeContext(this.clTarget), this.clTarget = null), this.updateVia(null), this.config && (this.disabled = !1, this.stats = new a.FtlStats, this.updateTarget(this.config.targets[0]), this.clSession = this.cl.startSession(e, {
                                targets: this.config.targetNames()
                            }))
                        }
                        updateTarget(e) {
                            this.target = e, null !== this.clTarget && this.cl.removeContext(this.clTarget), this.clTarget = this.cl.addContext("ftl.Target", {
                                target: e.name,
                                hostname: e.host
                            })
                        }
                        updateVia(e) {
                            this.via != e && (this.via = e, null !== this.clVia && (this.cl.removeContext(this.clVia), this.clVia = null), null != e && (this.clVia = this.cl.addContext("ftl.Via", {
                                via: e
                            })))
                        }
                    }
                },
                "./src/ftl/index.ts": function(e, t, n) {
                    n.r(t);
                    var o = n("./src/ftl/ftl.ts");
                    n.d(t, "Ftl", function() {
                        return o.Ftl
                    });
                    var i = n("./src/ftl/config.ts");
                    n.d(t, "FtlConfig", function() {
                        return i.FtlConfig
                    }), n.d(t, "FtlTarget", function() {
                        return i.FtlTarget
                    });
                    var a = n("./src/ftl/roundtrip.ts");
                    n.d(t, "FtlRoundTrip", function() {
                        return a.FtlRoundTrip
                    });
                    var s = n("./src/ftl/error.ts");
                    n.d(t, "FtlError", function() {
                        return s.FtlError
                    });
                    var r = n("./src/ftl/stats.ts");
                    n.d(t, "FtlStats", function() {
                        return r.FtlStats
                    })
                },
                "./src/ftl/roundtrip.ts": function(e, t, n) {
                    n.r(t), n.d(t, "FtlRoundTrip", function() {
                        return o
                    });
                    class o {}
                },
                "./src/ftl/stats.ts": function(e, t, n) {
                    n.r(t), n.d(t, "FtlStats", function() {
                        return o
                    });
                    class o {
                        constructor() {
                            this.requests = 0, this.errors = 0, this.consecutiveErrors = 0
                        }
                    }
                }
            }))
        })),
        P = d(function(e) {
            const t = e => e.pushManager.subscribe({
                userVisibleOnly: !0,
                applicationServerKey: function(e) {
                    const t = (e + "=".repeat((4 - e.length % 4) % 4)).replace(/\-/g, "+").replace(/_/g, "/"),
                        n = atob(t),
                        o = new Uint8Array(n.length);
                    for (let e = 0; e < n.length; e += 1) o[e] = n.charCodeAt(e);
                    return o
                }("BEFrC1Kg5ZtW7NdebwquU9HaqziMdmQhgGmFzoZBkd0VNRWroNSBw1pMg1I3XF56uQeQNa61thSYyk9bXze5crQ=")
            }).then(e => e.toJSON());
            e.exports = {
                requestAndSubscribeToPushNotifications: () => Notification.requestPermission().then(e => "granted" === e ? navigator.serviceWorker.getRegistration().then(e => t(e)) : Promise.reject()),
                parseActionsFromPushData: e => {
                    const t = {
                            actionText: "title",
                            actionPayload: "action",
                            actionKey: "icon"
                        },
                        n = Object.keys(e).filter(t => (t.includes("actionText.") || t.includes("actionPayload.") || t.includes("actionKey.") || t.includes("trackingInfo.")) && e[t]);
                    if (!n.length) return;
                    const o = [];
                    return n.forEach(n => {
                        const [i, a] = n.split("."), s = t[i] || i;
                        o[a] = o[a] ? o[a] : {}, o[a][s] = e[n]
                    }), o
                }
            }
        }),
        b = (P.requestAndSubscribeToPushNotifications, P.parseActionsFromPushData);
    const D = l({
            requestSender: f(fetch),
            source: "www-sw",
            schema: u
        }),
        T = new R.Ftl(D);
    self.addEventListener("install", function(e) {
        self.skipWaiting(), e.waitUntil(w(t, e))
    }), self.addEventListener("activate", function(e) {
        e.waitUntil(w(n, e))
    }), self.addEventListener("error", function(e) {
        w(o, e)
    }), self.addEventListener("message", function(e) {
        if ("enablePushNotifications" === e.data) e.waitUntil(A({
            objectStoreName: "serviceworker",
            objectStoreKey: "IS_PUSH_ENABLED_KEY",
            value: {
                isPushEnabled: !0
            }
        }));
        else if ("disablePushNotifications" === e.data) e.waitUntil(A({
            objectStoreName: "serviceworker",
            objectStoreKey: "IS_PUSH_ENABLED_KEY",
            value: {
                isPushEnabled: !1
            }
        }));
        else if ("ftlConfig" === e.data.type) {
            const o = R.FtlConfig.parse(e.data.config.configData);
            T.updateConfig(o), D.requestSender = f(T.route.bind(T)), e.waitUntil(Promise.all([(t = "ftlConfig", n = e.data.config, self[t] = n, void A({
                objectStoreName: "serviceworker",
                objectStoreKey: t,
                value: n
            })), A({
                objectStoreName: "serviceworker",
                objectStoreKey: "ftlConfig",
                value: e.data.config
            }), A({
                objectStoreName: "serviceworker",
                objectStoreKey: "routeDocRequestsThroughFTL",
                value: {
                    routeDocRequestsThroughFTL: e.data.routeDocRequestsThroughFTL
                }
            })]))
        } else e.waitUntil(w(i, e));
        var t, n
    }), self.addEventListener("sync", e => {
        e.waitUntil(w(a, e))
    }), self.addEventListener("push", e => {
        e.waitUntil(w((t, n) => (({
            objectStoreName: e,
            objectStoreKey: t
        }) => new Promise((n, o) => {
            E(e).then(i => {
                const a = i.transaction([e]).objectStore(e).get(t);
                a.onsuccess = function(e) {
                    return n(e.target.result)
                }, a.onerror = function(e) {
                    return o(e)
                }
            })
        }))({
            objectStoreName: "serviceworker",
            objectStoreKey: "IS_PUSH_ENABLED_KEY"
        }).then(t => {
            const {
                data: o
            } = e, i = o.json(), {
                title: a,
                text: s,
                largeIcon: r,
                trackingInfo: d,
                bigViewPicture: c
            } = i, m = JSON.parse(d);
            if (n.logEvent("PushNotificationReceived", {
                    receivedTime: Date.now(),
                    trackingInfo: m
                }), t && t.isPushEnabled) {
                const e = {
                    body: s,
                    icon: r,
                    image: c,
                    actions: b(i),
                    data: i,
                    requireInteraction: !0
                };
                return self.registration.showNotification(a, e).then(() => {
                    n.logEvent("PushNotificationPresented", {
                        presentedTime: Date.now(),
                        trackingInfo: m
                    })
                })
            }
        }), e))
    }), self.addEventListener("notificationclick", e => {
        e.waitUntil(w((t, n) => {
            const {
                notification: o,
                action: i
            } = e, a = b(o.data), {
                defaultActionPayload: s
            } = o.data, {
                trackingInfo: r
            } = a && i ? a.find(e => e.action === i) : o.data;
            return o.close(), n.logEvent("PushNotificationAcknowledged", {
                resolvedTime: Date.now(),
                trackingInfo: JSON.parse(r)
            }), self.clients.openWindow(i || s)
        }, e))
    }), self.addEventListener("notificationclose", e => {
        e.waitUntil(w((t, n) => {
            const {
                data: o
            } = e.notification, {
                trackingInfo: i
            } = o, a = JSON.parse(i);
            n.logEvent("PushNotificationDismissed", {
                resolvedTime: Date.now(),
                trackingInfo: a
            })
        }, e))
    })
}();
//# sourceMappingURL=service-worker.js.map
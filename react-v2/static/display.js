(function () {
    var e, t;
    e = function () {
        function e(e, t) {
            var n, r;
            this.options = {
                target: "ody",
                get: "popular",
                resolution: "thumbnail",
                sortBy: "none",
                links: !0,
                mock: !1,
                useHttp: !1
            };
            if (typeof e == "object") for (n in e) r = e[n], this.options[n] = r;
            this.context = t != null ? t : this, this.unique = this._genKey()
        }

        return e.prototype.hasNext = function () {
            return typeof this.context.nextUrl == "string" && this.context.nextUrl.length > 0
        }, e.prototype.next = function () {
            return this.hasNext() ? this.run(this.context.nextUrl) : !1
        }, e.prototype.run = function (t) {
            var n, r, i;
            if (typeof this.options.clientId != "string" && typeof this.options.accessToken != "string") throw new Error("Missing clientId or accessToken.");
            if (typeof this.options.accessToken != "string" && typeof this.options.clientId != "string") throw new Error("Missing clientId or accessToken.");
            return this.options.before != null && typeof this.options.before == "function" && this.options.before.call(this), typeof document != "undefined" && document !== null && (i = document.createElement("script"), i.id = "ody-fetcher", i.src = t || this._buildUrl(), n = document.getElementsByTagName("head"), n[0].appendChild(i), r = "odyCache" + this.unique, window[r] = new e(this.options, this), window[r].unique = this.unique), !0
        }, e.prototype.parse = function (e) {
            var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S;
            if (typeof e != "object") {
                if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, "Invalid JSON data"), !1;
                throw new Error("Invalid JSON response")
            }
            if (e.meta.code !== 200) {
                if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, e.meta.error_message), !1;
                throw new Error("Error from Instagram: " + e.meta.error_message)
            }
            if (e.data.length === 0) {
                if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, "No images were returned from Instagram"), !1;
                throw new Error("No images were returned from Instagram")
            }
            this.options.success != null && typeof this.options.success == "function" && this.options.success.call(this, e), this.context.nextUrl = "", e.pagination != null && (this.context.nextUrl = e.pagination.next_url);
            if (this.options.sortBy !== "none") {
                this.options.sortBy === "random" ? d = ["", "random"] : d = this.options.sortBy.split("-"), p = d[0] === "least" ? !0 : !1;
                switch (d[1]) {
                    case"random":
                        e.data.sort(function () {
                            return .5 - Math.random()
                        });
                        break;
                    case"recent":
                        e.data = this._sortBy(e.data, "created_time", p);
                        break;
                    case"liked":
                        e.data = this._sortBy(e.data, "likes.count", p);
                        break;
                    case"commented":
                        e.data = this._sortBy(e.data, "comments.count", p);
                        break;
                    default:
                        throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.")
                }
            }
            if (typeof document != "undefined" && document !== null && this.options.mock === !1) {
                a = e.data, this.options.limit != null && a.length > this.options.limit && (a = a.slice(0, this.options.limit + 1 || 9e9)), n = document.createDocumentFragment(), this.options.filter != null && typeof this.options.filter == "function" && (a = this._filter(a, this.options.filter));
                if (this.options.template != null && typeof this.options.template == "string") {
                    i = "", o = "", l = "", v = document.createElement("div");
                    for (m = 0, b = a.length; m < b; m++) s = a[m], u = s.images[this.options.resolution].url, this.options.useHttp || (u = u.replace("http://", "//")), o = this._makeTemplate(this.options.template, {
                        model: s,
                        id: s.id,
                        link: s.link,
                        image: u,
                        caption: this._getObjectProperty(s, "caption.text"),
                        likes: s.likes.count,
                        comments: s.comments.count,
                        location: this._getObjectProperty(s, "location.name")
                    }), i += o;
                    v.innerHTML = i, S = [].slice.call(v.childNodes);
                    for (g = 0, w = S.length; g < w; g++) h = S[g], n.appendChild(h)
                } else for (y = 0, E = a.length; y < E; y++) s = a[y], f = document.createElement("img"), u = s.images[this.options.resolution].url, this.options.useHttp || (u = u.replace("http://", "//")), f.src = u, this.options.links === !0 ? (t = document.createElement("a"), t.href = s.link, t.appendChild(f), n.appendChild(t)) : n.appendChild(f);
                document.getElementById(this.options.target).appendChild(n), r = document.getElementsByTagName("head")[0], r.removeChild(document.getElementById("ody-fetcher")), c = "odyCache" + this.unique, window[c] = void 0;
                try {
                    delete window[c]
                } catch (x) {
                }
            }
            return this.options.after != null && typeof this.options.after == "function" && this.options.after.call(this), !0
        }, e.prototype._buildUrl = function () {
            var e, t, n;
            e = "https://api.instagram.com/v1";
            switch (this.options.get) {
                case"popular":
                    t = "media/popular";
                    break;
                case"tagged":
                    if (typeof this.options.tagName != "string") throw new Error("No tag name specified. Use the 'tagName' option.");
                    t = "tags/" + this.options.tagName + "/media/recent";
                    break;
                case"location":
                    if (typeof this.options.locationId != "number") throw new Error("No location specified. Use the 'locationId' option.");
                    t = "locations/" + this.options.locationId + "/media/recent";
                    break;
                case"user":
                    if (typeof this.options.userId != "number") throw new Error("No user specified. Use the 'userId' option.");
                    if (typeof this.options.accessToken != "string") throw new Error("No access token. Use the 'accessToken' option.");
                    t = "users/" + this.options.userId + "/media/recent";
                    break;
                default:
                    throw new Error("Invalid option for get: '" + this.options.get + "'.")
            }
            console.log(n = "" + e + "/" + t, this.options.accessToken != null ? n += "?access_token=" + this.options.accessToken : n += "?client_id=" + this.options.clientId, this.options.limit != null && (n += "&count=" + this.options.limit), n += "&callback=odyCache" + this.unique + ".parse", n)
            return n = "" + e + "/" + t, this.options.accessToken != null ? n += "?access_token=" + this.options.accessToken : n += "?client_id=" + this.options.clientId, this.options.limit != null && (n += "&count=" + this.options.limit), n += "&callback=odyCache" + this.unique + ".parse", n
        }, e.prototype._genKey = function () {
            var e;
            return e = function () {
                return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1)
            }, "" + e() + e() + e() + e()
        }, e.prototype._makeTemplate = function (e, t) {
            var n, r, i, s, o;
            r = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, n = e;
            while (r.test(n)) i = n.match(r)[1], s = (o = this._getObjectProperty(t, i)) != null ? o : "", n = n.replace(r, "" + s);
            return n
        }, e.prototype._getObjectProperty = function (e, t) {
            var n, r;
            t = t.replace(/\[(\w+)\]/g, ".$1"), r = t.split(".");
            while (r.length) {
                n = r.shift();
                if (!(e != null && n in e)) return null;
                e = e[n]
            }
            return e
        }, e.prototype._sortBy = function (e, t, n) {
            var r;
            return r = function (e, r) {
                var i, s;
                return i = this._getObjectProperty(e, t), s = this._getObjectProperty(r, t), n ? i > s ? 1 : -1 : i < s ? 1 : -1
            }, e.sort(r.bind(this)), e
        }, e.prototype._filter = function (e, t) {
            var n, r, i, s, o;
            n = [], i = function (e) {
                if (t(e)) return n.push(e)
            };
            for (s = 0, o = e.length; s < o; s++) r = e[s], i(r);
            return n
        }, e
    }(), t = typeof exports != "undefined" && exports !== null ? exports : window, t.ody = e
}).call(this);
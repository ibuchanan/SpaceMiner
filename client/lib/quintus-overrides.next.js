this.QuintusOverrides = class {
  static override(Q) {

    Q.load = function (assets, callback, options) {
        var assetObj = {};

        /* Make sure we have an options hash to work with */
        if (!options) {
            options = {};
        }

        /* Get our progressCallback if we have one */
        var progressCallback = options.progressCallback;

        var errors = false,
            errorCallback = function (itm) {
                errors = true;
                (options.errorCallback ||
                    function (itm) {
                        throw ("Error Loading: " + itm);
                    })(itm);
            };

        /* Convert to an array if it's a string */
        if (Q._isString(assets)) {
            assets = Q._normalizeArg(assets);
        }

        /* If the user passed in an array, convert it */
        /* to a hash with lookups by filename */
        if (Q._isArray(assets)) {
            Q._each(assets, function (itm) {
                if (Q._isObject(itm)) {
                    Q._extend(assetObj, itm);
                } else {
                    assetObj[itm] = itm;
                }
            });
        } else {
            /* Otherwise just use the assets as is */
            assetObj = assets;
        }

        /* Find the # of assets we're loading */
        var assetsTotal = Q._keys(assetObj).length,
            assetsRemaining = assetsTotal;

        /* Closure'd per-asset callback gets called */
        /* each time an asset is successfully loaded */
        var loadedCallback = function (key, obj, force) {
            if (errors) {
                return;
            }

            // Prevent double callbacks (I'm looking at you Firefox, canplaythrough
            if (!Q.assets[key] || force) {

                /* Add the object to our asset list */
                Q.assets[key] = obj;

                /* We've got one less asset to load */
                assetsRemaining--;

                /* Update our progress if we have it */
                if (progressCallback) {
                    progressCallback(assetsTotal - assetsRemaining, assetsTotal);
                }
            }

            /* If we're out of assets, call our full callback */
            /* if there is one */
            if (assetsRemaining === 0 && callback) {
                /* if we haven't set up our canvas element yet, */
                /* assume we're using a canvas with id 'quintus' */
                callback.apply(Q);
            }
        };

        /* Now actually load each asset */
        Q._each(assetObj, function (itm, key) {
            /* Determine the type of the asset */
            var assetType = Q.assetType(itm);

            /* If we already have the asset loaded, */
            /* don't load it again */
            if (Q.assets[key] && !options.reload) {
                loadedCallback(key, Q.assets[key], true);
            } else {
                /* Call the appropriate loader function */
                /* passing in our per-asset callback */
                /* Dropping our asset by name into Q.assets */
                Q["loadAsset" + assetType](key, itm,
                    function (key, obj, force) {
                        force = force || options.reload;
                        loadedCallback(key, obj, force);
                    },
                    function () {
                        errorCallback(itm);
                    });
            }
        });
    };

    Q.TileLayer.prototype.load = function (dataAsset) {
       var fileParts = dataAsset.split("."),
         fileExt = fileParts[fileParts.length - 1].toLowerCase(),
         data;

       if (fileExt === "json" || fileExt == "lvl") {
         data = Q._isString(dataAsset) ? Q.asset(dataAsset) : dataAsset;
       } else {
         throw "file type not supported";
       }
       this.p.tiles = data;
     };

  }
}
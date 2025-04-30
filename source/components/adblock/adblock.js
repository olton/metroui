((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    let AdblockDefaultConfig = {
        adblockDeferred: 0,
        checkInterval: 1000,
        fireOnce: true,
        checkStop: 10,
        localhost: false,
        onAlert: Metro.noop,
        onFishingStart: Metro.noop,
        onFishingDone: Metro.noop
    };

    Metro.adblockSetup = (options) =>{
        AdblockDefaultConfig = $.extend({}, AdblockDefaultConfig, options);
    };

    if (typeof globalThis.metroAdblockSetup !== "undefined") {
        Metro.adblockSetup(globalThis.metroAdblockSetup);
    }

    const Adblock = {
        bite: () => {
            const classes = "adblock-bite adsense google-adsense dblclick advert topad top_ads topAds textads sponsoredtextlink_container show_ads right-banner rekl mpu module-ad mid_ad mediaget horizontal_ad headerAd contentAd brand-link bottombanner bottom_ad_block block_ad bannertop banner-right banner-body b-banner b-article-aside__banner b-advert adwrapper adverts advertisment advertisement:not(body) advertise advert_list adtable adsense adpic adlist adleft adinfo adi adholder adframe addiv ad_text ad_space ad_right ad_links ad_body ad_block ad_Right adTitle adText";
            $("<div>")
                .addClass(classes.split(" ").shuffle().join(" "))
                .css({
                    position: "fixed",
                    height: 1,
                    width: 1,
                    overflow: "hidden",
                    visibility: "visible",
                    top: 0,
                    left: 0
                })
                .append($("<a href='https://dblclick.net'>").html('dblclick.net'))
                .appendTo('body');

            if (Adblock.options.adblockDeferred) {
                setTimeout(() => {
                    Adblock.fishing();
                }, Adblock.options.adblockDeferred);
            } else Adblock.fishing();
        },

        fishing: () =>{
            const o = Adblock.options;
            let checks = typeof o.fireOnce === "number" ? o.fireOnce : 0;
            let checkStop = o.checkStop;
            let interval = false;
            const run = () =>{
                const a = $(".adsense.google-adsense.dblclick.advert.adblock-bite");
                const b = a.find("a");
                const done = () =>{
                    clearInterval(interval);

                    Metro.utils.exec(o.onFishingDone);
                    $(globalThis).fire("fishing-done");

                    a.remove();
                };

                if (!o.localhost && $.localhost) {
                    done();
                    return ;
                }

                if (   !a.length
                    || !b.length
                    || a.css("display").indexOf('none') > -1
                    || b.css("display").indexOf('none') > -1
                ) {

                    Metro.utils.exec(Adblock.options.onAlert);
                    $(globalThis).fire("adblock-alert");

                    if (Adblock.options.fireOnce === true) {
                        done();
                    } else {
                        checks--;
                        if (checks === 0) {
                            done();
                        }
                    }
                } else {
                    if (checkStop !== false) {
                        checkStop--;
                        if (checkStop === 0) {
                            done();
                        }
                    }
                }
            };

            Metro.utils.exec(o.onFishingStart);
            $(globalThis).fire("fishing-start");

            interval = setInterval(() =>{
                run();
            }, Adblock.options.checkInterval);

            run();
        }
    };

    Metro.Adblock = Adblock;

    $(() =>{
        Adblock.options = $.extend({}, AdblockDefaultConfig);
        $(globalThis).on("metro-initiated", () =>{
            Adblock.bite();
        });
    });
})(Metro, Dom);
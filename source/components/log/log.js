((Metro) => {
    const DEBUG_LABEL_INFO = "INFO";
    const DEBUG_LABEL_ERROR = "ERROR";
    const DEBUG_LABEL_WARNING = "WARN";

    function showLog(type, ...rest) {
        const time = new Date().toLocaleString();
        const [m, ...others] = rest;
        if (window.DEBUG_PAGE) {
            switch (type) {
                case "info":
                    console.log.apply(null, [`[${DEBUG_LABEL_INFO}] (${time}) ${m}`, ...others]);
                    break;
                case "warn":
                    console.log.apply(null, [`%c[${DEBUG_LABEL_WARNING}] (${time}) ${m}`, ...others, "color: orange;"]);
                    break;
                case "error":
                    console.log.apply(null, [`%c[${DEBUG_LABEL_ERROR}] (${time}) ${m}`, ...others, "color: red;"]);
                    break;
            }
        }
    }

    function log(...rest) {
        showLog.apply(null, ["info", ...rest]);
    }

    function warn(...rest) {
        showLog.apply(null, ["warn", ...rest]);
    }

    function error(...rest) {
        showLog.apply(null, ["error", ...rest]);
    }

    Metro.log = log;
    Metro.warn = warn;
    Metro.error = error;
})(Metro);

((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    const Export = {

        init: function () {
            return this;
        },

        options: {
            csvDelimiter: "\t",
            csvNewLine: "\r\n",
            includeHeader: true
        },

        setup: function (options) {
            this.options = $.extend({}, this.options, options);
            return this;
        },

        base64: (data) => globalThis.btoa(unescape(encodeURIComponent(data))),

        b64toBlob: (b64Data, contentType = '', sliceSize = 512) => {

            const byteCharacters = globalThis.atob(b64Data);
            const byteArrays = [];

            let offset;
            
            for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i = i + 1) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new globalThis.Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            return new Blob(byteArrays, {
                type: contentType
            });
        },

        tableToCSV: function (table, filename, options) {
            let o;
            let body;
            let head;
            let data = "";
            let row;
            let cell;

            o = $.extend({}, this.options, options);

            const _table = $(table)[0];

            if (Metro.utils.bool(o.includeHeader)) {

                head = _table.querySelectorAll("thead")[0];

                for (let i = 0; i < head.rows.length; i++) {
                    row = head.rows[i];
                    for (let j = 0; j < row.cells.length; j++) {
                        cell = row.cells[j];
                        data += (j ? o.csvDelimiter : '') + cell.textContent.trim();
                    }
                    data += o.csvNewLine;
                }
            }

            body = _table.querySelectorAll("tbody")[0];

            for (let i = 0; i < body.rows.length; i++) {
                row = body.rows[i];
                for (let j = 0; j < row.cells.length; j++) {
                    cell = row.cells[j];
                    data += (j ? o.csvDelimiter : '') + cell.textContent.trim();
                }
                data += o.csvNewLine;
            }

            if (Metro.utils.isValue(filename)) {
                return this.createDownload(this.base64(`\uFEFF${data}`), 'application/csv', filename);
            }

            return data;
        },

        createDownload: function (data, contentType, filename) {

            const anchor = document.createElement('a')
            anchor.style.display = "none";
            document.body.appendChild(anchor);

            const blob = this.b64toBlob(data, contentType)
            const url = globalThis.URL.createObjectURL(blob)
            anchor.href = url;
            anchor.download = filename || Metro.utils.elementId("download");
            anchor.click();
            globalThis.URL.revokeObjectURL(url);
            document.body.removeChild(anchor);
            return true;
        },

        arrayToCsv: function(array, filename, options){
            let o;
            let data = "";
            let i;
            let row;

            o = $.extend({}, this.options, options);

            for (i = 0; i < array.length; i++) {
                row = array[i];

                if (typeof row !== "object") {
                    data += row + o.csvNewLine;
                } else {
                    $.each(row, (key, val)=> {
                        data += (key ? o.csvDelimiter : '') + val.toString();
                    });
                    data += o.csvNewLine;
                }
            }

            if (Metro.utils.isValue(filename)) {
                return this.createDownload(this.base64(`\uFEFF${data}`), 'application/csv', filename);
            }

            return data;
        }
    };

    Metro.export = Export.init();

    if (globalThis.METRO_GLOBAL_COMMON === true) {
        globalThis.Export = Metro.export;
    }
})(Metro, Dom);

// TODO: Add export from any data types
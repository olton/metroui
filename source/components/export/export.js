/* global Metro */
(function (Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var Export = {

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

        base64: function (data) {
            return globalThis.btoa(unescape(encodeURIComponent(data)));
        },

        b64toBlob: function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = globalThis.atob(b64Data);
            var byteArrays = [];

            var offset;
            for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                var i;
                for (i = 0; i < slice.length; i = i + 1) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new globalThis.Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            return new Blob(byteArrays, {
                type: contentType
            });
        },

        tableToCSV: function (table, filename, options) {
            var o;
            var body, head, data = "";
            var i, j, row, cell;

            o = $.extend({}, this.options, options);

            table = $(table)[0];

            if (Utils.bool(o.includeHeader)) {

                head = table.querySelectorAll("thead")[0];

                for (i = 0; i < head.rows.length; i++) {
                    row = head.rows[i];
                    for (j = 0; j < row.cells.length; j++) {
                        cell = row.cells[j];
                        data += (j ? o.csvDelimiter : '') + cell.textContent.trim();
                    }
                    data += o.csvNewLine;
                }
            }

            body = table.querySelectorAll("tbody")[0];

            for (i = 0; i < body.rows.length; i++) {
                row = body.rows[i];
                for (j = 0; j < row.cells.length; j++) {
                    cell = row.cells[j];
                    data += (j ? o.csvDelimiter : '') + cell.textContent.trim();
                }
                data += o.csvNewLine;
            }

            if (Utils.isValue(filename)) {
                return this.createDownload(this.base64("\uFEFF" + data), 'application/csv', filename);
            }

            return data;
        },

        createDownload: function (data, contentType, filename) {
            var blob, anchor, url;

            anchor = document.createElement('a');
            anchor.style.display = "none";
            document.body.appendChild(anchor);

            blob = this.b64toBlob(data, contentType);

            url = globalThis.URL.createObjectURL(blob);
            anchor.href = url;
            anchor.download = filename || Utils.elementId("download");
            anchor.click();
            globalThis.URL.revokeObjectURL(url);
            document.body.removeChild(anchor);
            return true;
        },

        arrayToCsv: function(array, filename, options){
            var o, data = "", i, row;

            o = $.extend({}, this.options, options);

            for (i = 0; i < array.length; i++) {
                row = array[i];

                if (typeof row !== "object") {
                    data += row + o.csvNewLine;
                } else {
                    $.each(row, function(key, val){
                        data += (key ? o.csvDelimiter : '') + val.toString();
                    });
                    data += o.csvNewLine;
                }
            }

            if (Utils.isValue(filename)) {
                return this.createDownload(this.base64("\uFEFF" + data), 'application/csv', filename);
            }

            return data;
        }
    };

    Metro.export = Export.init();

    if (globalThis.METRO_GLOBAL_COMMON === true) {
        globalThis.Export = Metro.export;
    }
}(Metro, Dom));
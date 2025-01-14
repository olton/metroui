/** @format */

(function (Metro, $) {
    "use strict";
    var Utils = Metro.utils;
    var ChatDefaultConfig = {
        chatDeferred: 0,
        inputTimeFormat: null,
        timeFormat: "D MMM hh:mm A",
        name: "John Doe",
        avatar: "<span>👦</span>",
        welcome: null,
        welcomeAvatar: "<span>👽</span>",
        title: null,
        width: "100%",
        height: "auto",
        messages: null,
        sendButtonTitle: "",
        sendButtonIcon: "",
        readonly: false,

        clsChat: "",
        clsName: "",
        clsTime: "",
        clsInput: "",
        clsSendButton: "",
        clsMessageLeft: "default",
        clsMessageRight: "default",

        onMessage: Metro.noop,
        onSend: Metro.noop,
        onSendButtonClick: Metro.noop,
        onChatCreate: Metro.noop,
    };

    Metro.chatSetup = function (options) {
        ChatDefaultConfig = $.extend({}, ChatDefaultConfig, options);
    };

    if (typeof globalThis["metroChatSetup"] !== undefined) {
        Metro.chatSetup(globalThis["metroChatSetup"]);
    }

    Metro.Component("chat", {
        init: function (options, elem) {
            this._super(elem, options, ChatDefaultConfig, {
                input: null,
                classes: "primary secondary success alert warning yellow info dark light".split(" "),
                lastMessage: null,
            });

            return this;
        },

        _create: function () {
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("chat-create", {
                element: element,
            });
        },

        _createStructure: function () {
            var that = this,
                element = this.element,
                o = this.options;
            var messages, messageInput, input;
            var customButtons = [
                {
                    html: `${o.sendButtonTitle || this.strings.label_send}${o.sendButtonIcon}`,
                    cls: o.clsSendButton + " js-chat-send-button",
                    onclick: o.onSendButtonClick,
                },
            ];

            element.addClass("chat").addClass(o.clsChat);

            element.css({
                width: o.width,
                height: o.height,
            });

            if (Utils.isValue(o.title)) {
                $("<div>").addClass("title").html(o.title).appendTo(element);
            }

            messages = $("<div>").addClass("messages");
            messages.appendTo(element);
            messageInput = $("<div>").addClass("message-input").appendTo(element);
            input = $("<input type='text'>").addClass("chat-input");
            input.appendTo(messageInput);
            setTimeout(() => {
                Metro.makePlugin(input[0], "input", {
                    customButtons: customButtons,
                    clsInput: o.clsInput,
                });
            });

            if (o.welcome) {
                this.add({
                    text: o.welcome,
                    time: datetime(),
                    position: "left",
                    name: "Chat Bot",
                    avatar: o.welcomeAvatar,
                });
            }

            if (Utils.isValue(o.messages) && typeof o.messages === "string") {
                o.messages = Utils.isObject(o.messages);
            }

            if (!Utils.isNull(o.messages) && typeof o.messages === "object" && Utils.objectLength(o.messages) > 0) {
                $.each(o.messages, function () {
                    that.add(this);
                });
            }

            element.find(".message-input")[o.readonly ? "addClass" : "removeClass"]("disabled");
        },

        _createEvents: function () {
            var that = this,
                element = this.element,
                o = this.options;
            

            var send = function () {
                var input = element.find(".chat-input input");
                var msg = "" + input.val(), m;
                if (msg.trim() === "") {
                    return false;
                }
                m = {
                    id: Utils.elementId("chat-message"),
                    name: o.name,
                    avatar: o.avatar,
                    text: msg,
                    position: "right",
                    time: datetime(),
                };
                that.add(m);
                input.val("");
                that._fireEvent("send", {
                    msg: m,
                });
                input.focus();
            };

            element.on(Metro.events.click, ".js-chat-send-button", function () {
                send();
            });

            element.on(Metro.events.keyup, ".chat-input > input", function (e) {
                if (e.keyCode === Metro.keyCode.ENTER) {
                    send();
                }
            });
        },

        add: function (msg) {
            var that = this,
                element = this.element,
                o = this.options,
                locale = this.locale;
            var message, sender, time, item, avatar, text;
            var messages = element.find(".messages");
            var messageDate;

            messageDate = o.inputTimeFormat ? Datetime.from(msg.time, o.inputTimeFormat, locale) : datetime(msg.time);

            message = $("<div>").addClass("message").addClass(msg.position).appendTo(messages);
            item = $("<div>").addClass("message-item").appendTo(message);
            
            if (Metro.utils.isUrl(msg.avatar) || msg.avatar.includes("data:image")) {
                avatar = $("<img>").attr("src", msg.avatar).attr("alt", msg.avatar).addClass("message-avatar").appendTo(item);
            } else if (msg.avatar) {
                const _el = $(msg.avatar)
                if (_el.length ) {
                    avatar = _el.addClass("message-avatar").appendTo(item);
                } else {
                    avatar = $("<span>").addClass("message-avatar").html(msg.avatar).appendTo(item);
                }                
            }
            
            text = $("<div>")
                .addClass("message-text")
                .append($("<div>").addClass("message-text-inner").html(Str.escapeHtml(msg.text)))
                .appendTo(item);
            time = $("<div>").addClass("message-time").addClass(o.clsTime).text(messageDate.format(o.timeFormat)).appendTo(text);
            sender = $("<div>").addClass("message-sender").addClass(o.clsName).text(msg.name).appendTo(text);

            if (Utils.isValue(msg.id)) {
                message.attr("id", msg.id);
            }

            if (msg.position === "left" && Utils.isValue(o.clsMessageLeft)) {
                text.addClass(o.clsMessageLeft);
            }
            if (msg.position === "right" && Utils.isValue(o.clsMessageRight)) {
                text.addClass(o.clsMessageRight);
            }

            if (this.lastMessage && this.lastMessage.position === msg.position) {
                text.addClass("--next");
                avatar.visible(false);
                sender.hide();
            }

            that._fireEvent("message", {
                msg: msg,
                el: {
                    message: message,
                    sender: sender,
                    time: time,
                    item: item,
                    avatar: avatar,
                    text: text,
                },
            });

            messages.animate({
                draw: {
                    scrollTop: messages[0].scrollHeight,
                },
                dur: 1000,
            });

            this.lastMessage = msg;

            return this;
        },

        addMessages: function (messages) {
            var that = this;

            if (Utils.isValue(messages) && typeof messages === "string") {
                messages = Utils.isObject(messages);
            }

            if (typeof messages === "object" && Utils.objectLength(messages) > 0) {
                $.each(messages, function () {
                    that.add(this);
                });
            }

            return this;
        },

        delMessage: function (id) {
            var element = this.element;

            element
                .find(".messages")
                .find("#" + id)
                .remove();

            return this;
        },

        updMessage: function (msg) {
            var element = this.element;
            var message = element.find(".messages").find("#" + msg.id);
            const o = this.options,
                locale = this.locale;

            if (message.length === 0) return this;

            let messageDate = o.inputTimeFormat ? Datetime.from(msg.time, o.inputTimeFormat, locale) : datetime(msg.time);

            message.find(".message-text-inner").html(msg.text);
            message.find(".message-time").html(messageDate.format(o.timeFormat));

            return this;
        },

        clear: function () {
            var element = this.element;
            var messages = element.find(".messages");
            messages.html("");
            this.lastMessage = null;
        },

        toggleReadonly: function (readonly) {
            var element = this.element,
                o = this.options;
            o.readonly = typeof readonly === "undefined" ? !o.readonly : readonly;
            element.find(".message-input")[o.readonly ? "addClass" : "removeClass"]("disabled");
        },

        changeAttribute: function (attributeName) {
            switch (attributeName) {
                case "data-readonly":
                    this.toggleReadonly();
                    break;
            }
        },

        destroy: function () {
            var element = this.element;
            var sendButton = element.find(".js-chat-send-button");
            var input = element.find("input[type=text]");

            sendButton.off(Metro.events.click);
            input.off(Metro.events.keyup);

            return element;
        },
    });

    Metro.defaults.Chat = ChatDefaultConfig;
})(Metro, Dom);

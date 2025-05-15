((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    let ChatDefaultConfig = {
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

    Metro.chatSetup = (options) => {
        ChatDefaultConfig = $.extend({}, ChatDefaultConfig, options);
    };

    if (typeof globalThis.metroChatSetup !== "undefined") {
        Metro.chatSetup(globalThis.metroChatSetup);
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
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("chat-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const customButtons = [
                {
                    html: `${o.sendButtonTitle || this.strings.label_send}${o.sendButtonIcon}`,
                    cls: `${o.clsSendButton} js-chat-send-button`,
                    onclick: o.onSendButtonClick,
                },
            ];

            element.addClass("chat").addClass(o.clsChat);

            element.css({
                width: o.width,
                height: o.height,
            });

            if (Metro.utils.isValue(o.title)) {
                $("<div>").addClass("title").html(o.title).appendTo(element);
            }

            const messages = $("<div>").addClass("messages");
            messages.appendTo(element);
            const messageInput = $("<div>").addClass("message-input").appendTo(element);
            const input = $("<input type='text'>").addClass("chat-input");
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

            if (Metro.utils.isValue(o.messages) && typeof o.messages === "string") {
                o.messages = Metro.utils.isObject(o.messages);
            }

            if (
                !Metro.utils.isNull(o.messages) &&
                typeof o.messages === "object" &&
                Metro.utils.objectLength(o.messages) > 0
            ) {
                $.each(o.messages, function () {
                    that.add(this);
                });
            }

            element.find(".message-input")[o.readonly ? "addClass" : "removeClass"]("disabled");
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;

            const send = () => {
                const input = element.find(".chat-input input");
                const msg = `${input.val()}`;
                if (msg.trim() === "") {
                    return false;
                }
                const m = {
                    id: Metro.utils.elementId("chat-message"),
                    name: o.name,
                    avatar: o.avatar,
                    text: msg,
                    position: "right",
                    time: datetime(),
                };
                this.add(m);
                input.val("");
                this._fireEvent("send", {
                    msg: m,
                });
                input.focus();
            };

            element.on(Metro.events.click, ".js-chat-send-button", () => {
                send();
            });

            element.on(Metro.events.keyup, ".chat-input > input", (e) => {
                if (e.keyCode === Metro.keyCode.ENTER) {
                    send();
                }
            });
        },

        add: function (msg) {
            const element = this.element;
            const o = this.options;
            const locale = this.locale;
            let message;
            let sender;
            let item;
            let avatar;
            let text;
            const messages = element.find(".messages");

            const messageDate = o.inputTimeFormat
                ? Datetime.from(msg.time, o.inputTimeFormat, locale)
                : datetime(msg.time);
            message = $("<div>").addClass("message").addClass(msg.position).appendTo(messages);
            item = $("<div>").addClass("message-item").appendTo(message);

            if (Metro.utils.isUrl(msg.avatar) || msg.avatar.includes("data:image")) {
                avatar = $("<img>")
                    .attr("src", msg.avatar)
                    .attr("alt", msg.avatar)
                    .addClass("message-avatar")
                    .appendTo(item);
            } else if (msg.avatar) {
                const _el = $(msg.avatar);
                if (_el.length) {
                    avatar = _el.addClass("message-avatar").appendTo(item);
                } else {
                    avatar = $("<span>").addClass("message-avatar").html(msg.avatar).appendTo(item);
                }
            }

            text = $("<div>")
                .addClass("message-text")
                .append($("<div>").addClass("message-text-inner").html(Str.escapeHtml(msg.text)))
                .appendTo(item);
            const time = $("<div>")
                .addClass("message-time")
                .addClass(o.clsTime)
                .text(messageDate.format(o.timeFormat))
                .appendTo(text);
            sender = $("<div>").addClass("message-sender").addClass(o.clsName).text(msg.name).appendTo(text);

            if (Metro.utils.isValue(msg.id)) {
                message.attr("id", msg.id);
            }

            if (msg.position === "left" && Metro.utils.isValue(o.clsMessageLeft)) {
                text.addClass(o.clsMessageLeft);
            }
            if (msg.position === "right" && Metro.utils.isValue(o.clsMessageRight)) {
                text.addClass(o.clsMessageRight);
            }

            if (this.lastMessage && this.lastMessage.position === msg.position) {
                text.addClass("--next");
                avatar.visible(false);
                sender.hide();
            }

            this._fireEvent("message", {
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
            const that = this;
            let _messages = messages;

            if (Metro.utils.isValue(_messages) && typeof _messages === "string") {
                _messages = Metro.utils.isObject(_messages);
            }

            if (typeof _messages === "object" && Metro.utils.objectLength(_messages) > 0) {
                $.each(_messages, function () {
                    that.add(this);
                });
            }

            return this;
        },

        delMessage: function (id) {
            const element = this.element;

            element.find(".messages").find(`#${id}`).remove();

            return this;
        },

        updMessage: function (msg) {
            const element = this.element;
            const message = element.find(".messages").find(`#${msg.id}`);
            const o = this.options;
            const locale = this.locale;

            if (message.length === 0) return this;

            const messageDate = o.inputTimeFormat
                ? Datetime.from(msg.time, o.inputTimeFormat, locale)
                : datetime(msg.time);

            message.find(".message-text-inner").html(msg.text);
            message.find(".message-time").html(messageDate.format(o.timeFormat));

            return this;
        },

        clear: function () {
            const element = this.element;
            const messages = element.find(".messages");
            messages.html("");
            this.lastMessage = null;
        },

        toggleReadonly: function (readonly) {
            const element = this.element;
            const o = this.options;
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
            const element = this.element;
            const sendButton = element.find(".js-chat-send-button");
            const input = element.find("input[type=text]");

            sendButton.off(Metro.events.click);
            input.off(Metro.events.keyup);

            return element;
        },
    });

    Metro.defaults.Chat = ChatDefaultConfig;
})(Metro, Dom);

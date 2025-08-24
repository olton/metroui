import { emojiMap } from "./emoji.js";

((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    const attachIcon = `
	<?xml version="1.0" encoding="utf-8"?>
	<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M16.617 14.496a1 1 0 0 1 1.414 1.414l-3.182 3.182a7 7 0 1 1-9.9-9.9l5.658-5.656a5 5 0 1 1 7.07 7.07l-5.656 5.658a3 3 0 0 1-4.243-4.243l4.596-4.596a1 1 0 1 1 1.415 1.414l-4.597 4.596a1 1 0 1 0 1.415 1.414l5.656-5.657a3 3 0 1 0-4.242-4.242l-5.657 5.657a5 5 0 1 0 7.071 7.07l3.182-3.181z"/>
	</svg>
	`;
    const sendIcon = `
	<?xml version="1.0" encoding="utf-8"?>
	<svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<g>
			<path fill="none" d="M0 0h24v24H0z"/>
			<path d="M3 13h6v-2H3V1.846a.5.5 0 0 1 .741-.438l18.462 10.154a.5.5 0 0 1 0 .876L3.741 22.592A.5.5 0 0 1 3 22.154V13z"/>
		</g>
	</svg>
	`;
    const smileIcon = `
	<?xml version="1.0" encoding="utf-8"?>
	<svg width="800px" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
		<path fill-rule="evenodd" clip-rule="evenodd" d="M4.111 2.18a7 7 0 1 1 7.778 11.64A7 7 0 0 1 4.11 2.18zm.556 10.809a6 6 0 1 0 6.666-9.978 6 6 0 0 0-6.666 9.978zM6.5 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM8 11a3 3 0 0 1-2.65-1.58l-.87.48a4 4 0 0 0 7.12-.16l-.9-.43A3 3 0 0 1 8 11z"/>
	</svg>
	`;

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
        readonly: false,
        attachAccept: "*",
        scrollSpeed: 200,
        sendMode: "enter", // "button" or "enter" or "control+enter"
        buttons: "attach send",

        useEmoji: true,
        useCode: true,
        useLink: true,

        clsChat: "",
        clsName: "",
        clsTime: "",
        clsInput: "",
        clsSendButton: "",
        clsAttachButton: "",
        clsSmileButton: "",
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
                attach: null,
                file: null,
                locale: null,
                buttons: [],
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this.locale = element.closest("[lang]").attr("lang") || "en";
            this.buttons = this.options.buttons.toArray(" ");

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

            element.addClass("chat").addClass(o.clsChat);

            this.file = $("<input type='file'>").appendTo(element);
            this.file.attr("accept", o.attachAccept);
            this.file.css({
                display: "none",
            });

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

            const input = $("<textarea>").attr("placeholder", "Write a message...");
            input.appendTo(messageInput);
            Metro.makePlugin(input[0], "textarea", {
                clsInput: o.clsInput,
                initialHeight: 34,
                clearButton: false,
            });
            input.addClass("chat-input");

            const buttons = $("<div>").addClass("buttons").appendTo(messageInput);

            if (this.buttons.includes("attach")) {
                const attachBtn = $("<span>")
                    .addClass(`flat js-chat-attach-button ${o.clsAttachButton}`)
                    .html(attachIcon);
                attachBtn.appendTo(buttons);
            }

            if (this.buttons.includes("send")) {
                const sendBtn = $("<span>").addClass(`flat js-chat-send-button ${o.clsSendButton}`).html(sendIcon);
                sendBtn.appendTo(buttons);
            }

            if (o.welcome) {
                this.add({
                    text: o.welcome,
                    time: datetime(),
                    position: "left",
                    name: "Chat Bot",
                    avatar: o.welcomeAvatar,
                });
            }

            if (typeof o.messages === "string" && o.messages) {
                o.messages = Metro.utils.isObject(o.messages);
            }

            if (o.messages && typeof o.messages === "object" && Metro.utils.objectLength(o.messages) > 0) {
                $.each(o.messages, function () {
                    that.add(this);
                });
            }

            element.find(".message-input")[o.readonly ? "addClass" : "removeClass"]("disabled");
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const input = element.find("textarea");

            const send = () => {
                const msg = `${input.val()}`;
                if (msg.trim() === "" && !this.attach) {
                    return false;
                }
                const m = {
                    id: Metro.utils.elementId("chat-message"),
                    name: o.name,
                    avatar: o.avatar,
                    text: msg,
                    position: "right",
                    time: datetime(),
                    attach: this.attach
                        ? new File([this.attach], this.attach.name, {
                              type: this.attach.type,
                              lastModified: this.attach.lastModified,
                          })
                        : null,
                };
                this.add(m);
                input.val("").trigger("change");
                this.attach = null;
                this._fireEvent("send", {
                    msg: m,
                });
                input.focus();
            };

            element.on(Metro.events.click, ".js-chat-send-button", () => {
                send();
            });

            element.on(Metro.events.keyup, "textarea", (e) => {
                if (o.sendMode === "button") {
                    return;
                }
                if (e.keyCode === Metro.keyCode.ENTER) {
                    if (
                        (o.sendMode === "control+enter" && (e.ctrlKey || e.metaKey)) ||
                        (o.sendMode === "enter" && !e.shiftKey)
                    ) {
                        send();
                    }
                }
            });

            element.on(Metro.events.click, ".js-chat-attach-button", () => {
                this.file[0].click();
            });

            this.file.on("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.attach = file;
                    send();
                }
            });
        },

        add: function (msg) {
            const element = this.element;
            const o = this.options;
            let avatar;
            let text;
            const messages = element.find(".messages");

            const addLink = (url, attach) => {
                return `<div class="attach-link"><a class="attach" href="${url}" target="_blank" download="${attach.name}">${attach.name} <span class="reduce-2">(Size: ${Math.round(attach.size / 1024 ** 2)} MB)</span></a></div>`;
            };

            const includeAttach = (attach) => {
                if (attach === null) {
                    return "";
                }
                const file = URL.createObjectURL(attach);

                let attachHtml = `<div class="message-attach">`;
                if (attach.type.startsWith("image/")) {
                    attachHtml += `<img class="attach" src="${file}" alt="${attach.name}">`;
                    attachHtml += addLink(file, attach);
                } else if (attach.type.startsWith("video/")) {
                    attachHtml += `<video class="attach" controls><source src="${file}" type="${attach.type}"></video>`;
                    attachHtml += addLink(file, attach);
                } else if (attach.type.startsWith("audio/")) {
                    attachHtml += `<audio class="attach" controls><source src="${file}" type="${attach.type}"></audio>`;
                    attachHtml += addLink(file, attach);
                } else {
                    attachHtml += addLink(file, attach);
                }
                attachHtml += `</div>`;
                return attachHtml;
            };

            const messageDate = o.inputTimeFormat
                ? Datetime.from(msg.time, o.inputTimeFormat, this.locale)
                : datetime(msg.time);

            const message = $("<div>").addClass("message").addClass(msg.position).appendTo(messages);

            const item = $("<div>").addClass("message-item").appendTo(message);

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

            let _msg = Str.stripTags(msg.text);

            if (o.useEmoji) {
                const words = _msg.split(" ");
                const newWords = [];

                for (let word of words) {
                    if (!word) continue;
                    if (word in emojiMap) {
                        word = emojiMap[word];
                    }
                    newWords.push(word);
                }
                _msg = newWords.join(" ");
            }

            if (o.useCode) {
                _msg = _msg.replace(/```(\w+)?\n?([\s\S]*?)```/g, "<pre><code class='$1'>$2</code></pre>");
                _msg = _msg.replace(/`([^`]+)`/g, "<code>$1</code>");
            }

            if (o.useLink && _msg.startsWith("http")) {
                _msg = `<a href="${_msg}" target="_blank">${_msg}</a>`;
            }

            text = $("<div>")
                .addClass("message-text")
                .append(
                    $("<div>")
                        .addClass("message-text-inner")
                        .html(msg.attach ? includeAttach(msg.attach) : _msg),
                )
                .appendTo(item);

            const time = $("<div>")
                .addClass("message-time")
                .addClass(o.clsTime)
                .text(messageDate.format(o.timeFormat))
                .appendTo(text);

            const sender = $("<div>").addClass("message-sender").addClass(o.clsName).text(msg.name).appendTo(text);

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
                dur: o.scrollSpeed,
            });

            this.lastMessage = msg;

            return this;
        },

        addMessages: function (messages) {
            const that = this;
            let _messages = messages;

            if (typeof _messages === "string" && _messages) {
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
            const o = this.options;
            const msgId = typeof msg === "string" ? msg : msg.id;
            const message = element.find(".messages").find(`#${msgId}`);

            if (message.length === 0) return this;

            const messageDate = o.inputTimeFormat
                ? Datetime.from(msg.time, o.inputTimeFormat, this.locale)
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

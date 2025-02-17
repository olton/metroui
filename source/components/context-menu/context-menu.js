(function (Metro, $) {
    Metro["contextMenu"] = function (options = [], element = document) {
        function buildMenu() {
            const menu = $('<ul>').addClass('d-menu context-menu').css("display", "none")
            for (const item of options) {
                if (item.type === "divider") {
                    menu.append($('<li>').addClass('divider'))
                } else {
                    const li = $('<li>').appendTo(menu)
                    const an = $('<a>').appendTo(li)
                    if (item.icon) {
                        an.append($("<span>").addClass("icon").html(item.icon))
                    }
                    an.append($("<span>").addClass("caption").html(item.text))
                    an.href(item.href || "#")
                    if (item.onclick) {
                        an.on("click", (e)=>{
                            Metro.utils.exec(item.onclick, [e, item])
                        })
                    }
                    if (item.attributes) {
                        for (const [key, value] of Object.entries(item.attributes)) {
                            an.attr(key, value)
                        }
                    }
                    if (item.disabled) {
                        an.prop("disabled", true)
                    }
                }
            }
            return menu[0]
        }

        element.context_menu = buildMenu()
        if (element.nodeType === 1) {
            element.append(element.context_menu)
        } else {
            $("body").append(element.context_menu)
        }
        
        element.oncontextmenu = function(e) {
            e.preventDefault()
            e.stopPropagation()
            $(".context-menu").hide()
            this.context_menu.style.left = e.pageX + "px"
            this.context_menu.style.top = e.pageY + "px"
            this.context_menu.style.display = "block"
        }
    }
    
    $(document).on("click", function(e) {
        $(".context-menu").hide()
    })    
})(Metro, Dom);

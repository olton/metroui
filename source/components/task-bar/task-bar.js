(function(Metro, $) {
    'use strict';

    let TaskBarDefaultConfig = {
        onTaskClick: Metro.noop,
        onMyObjectCreate: Metro.noop
    };

    Metro.taskBarSetup = function (options) {
        TaskBarDefaultConfig = $.extend({}, TaskBarDefaultConfig, options);
    };

    if (typeof window["metroTaskBarSetup"] !== undefined) {
        Metro.taskBarSetup(window["metroTaskBarSetup"]);
    }

    Metro.Component('task-bar', {
        init: function( options, elem ) {
            this._super(elem, options, TaskBarDefaultConfig, {
                // define instance vars here
                tasks: [],
                systemTray: [],
                widgets: [],
            });
            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent('task-bar-create');
        },

        _createStructure: function(){
            const that = this, element = this.element, o = this.options;

            element.addClass("task-bar");
            element.append($("<div>").addClass("widgets"));
            element.append($("<div>").addClass("tasks"));
            element.append($("<div>").addClass("system-tray"));
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;

            element.on(Metro.events.click, ".task", function(){
                const task = that.tasks[$(this).index()];
                for (const t of that.tasks) {
                    t.active = false;
                }
                task.active = true;
                that._renderTasks();
                that._fireEvent("task-click", {
                    task: task,
                    element: task.ref
                })
            });

            element.on(Metro.events.click, ".system-tray-item", function(){
                const item = that.systemTray[$(this).index()];
                that._fireEvent("system-tray-click", {
                    item,
                })
            });

            element.on(Metro.events.click, ".widget", function(){
                const item = that.widgets[$(this).index()];
                that._fireEvent("widget-click", {
                    item,
                })
            });
        },

        _renderTasks: function (){
            const that = this, element = this.element, o = this.options;
            const tasks = element.find(".tasks").clear();
            
            for (const task of this.tasks) {
                const taskItem = $("<div>").addClass("task").attr("title", task.title).html(task.icon);
                if (task.active) {
                    taskItem.addClass("active");
                }
                tasks.append(taskItem);
            }
        },
        
        _renderSystemTray: function (){
            const that = this, element = this.element, o = this.options;
            const systemTray = element.find(".system-tray").clear();
            
            for (const item of this.systemTray) {
                systemTray.append($(item).addClass("system-tray-item"));
            }
        },
        
        _renderWidgets: function (){
            const that = this, element = this.element, o = this.options;
            const widgets = element.find(".widgets").clear();
            
            for (const widget of this.widgets) {
                widgets.append($(widget).addClass("widget"));
            }
        },
        
        /*
        * task = {
        *   title: "Task title",
        *   description: "Task description",
        *   icon: "<span class='mif-cogs'></span>",
        *   ref: null, // Reference to the element in the DOM
        * }
        * */
        addTask: function(task, active = false){
            if (active) {
                for (const t of this.tasks) {
                    t.active = false;
                }
            }
            this.tasks.push({...task, active});
            this._renderTasks();
        },
        
        removeTask: function(task){
            this.tasks = this.tasks.filter(t => t.ref !== task);
            this._renderTasks();
        },
        
        activateTask: function(ref){
            const tasks = this.tasks.filter(t => t.ref === ref);
            if (tasks.length === 0) {
                return
            }
            const task = tasks[0];
            for (const t of this.tasks) {
                t.active = false;
            }
            task.active = true;            
            this._renderTasks();
        },
        
        /*
        * item = HTMLElement
        * */
        addToSystemTray: function(item){
            this.systemTray.push(item);
            this._renderSystemTray();
        },
        
        /*
        * widget = HTMLElement
        * */
        addWidget: function(widget){
            this.widgets.push(widget);
            this._renderWidgets();
        },
        
        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));
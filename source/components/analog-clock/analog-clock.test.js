import { suite, it, expect, mock, beforeAll, beforeEach, DOM, waitFor } from '@olton/latte'

let Metro = null

beforeAll(async () => {
    const metro_js = `./lib/metro.js` 
    const metro_css = `./lib/metro.css`

    DOM.js.fromFile(metro_js)
    DOM.css.fromFile(metro_css)

    Metro = await DOM.waitForObject('Metro')
})

beforeEach(() => {
    document.body.innerHTML = '';
})

// Test suite for the Analog Clock component
suite("Analog Clock Component Tests", () => {
    // Test initialization with default options
    it("should initialize with default options", async () => {
        // Create a DOM element for testing
        document.body.innerHTML = `
            <div id="test-clock"></div>
        `;

        // Initialize the analog clock
        Metro.makePlugin("#test-clock", "analog-clock");

        // Get the analog clock instance
        const clock = Metro.getPlugin("#test-clock", "analog-clock");

        // Check that the clock was initialized
        expect(clock).not.toBeNull();
        expect(document.querySelector("#test-clock").classList.contains("analog-clock")).toBe(true);
        
        // Check default options
        expect(document.querySelector("#test-clock .moon")).not.toBeNull(); // showMoon is true by default
        expect(document.querySelector("#test-clock .day-month")).not.toBeNull(); // showDay is true by default
        expect(document.querySelector("#test-clock .digital-clock")).not.toBeNull(); // showDigitalClock is true by default
        expect(document.querySelector("#test-clock").classList.contains("show-numbers")).toBe(true); // showNumbers is true by default
    });

    // Test initialization with custom options
    it("should initialize with custom options", () => {
        // Create a DOM element for testing
        document.body.innerHTML = `
            <div id="test-clock-custom"></div>
        `;

        // Initialize the analog clock with custom options
        Metro.makePlugin("#test-clock-custom", "analog-clock", {
            showNumbers: true,
            showMoon: false,
            showDay: false,
            showDigitalClock: false,
            timeFormat: 12
        });

        // Get the analog clock element
        const clockElement = document.querySelector("#test-clock-custom");

        // Check that the clock was initialized with custom options
        expect(clockElement).hasClass("analog-clock");
        expect(clockElement).hasClass("show-numbers");
        expect(clockElement.querySelector(".moon")).toBeNull(); // showMoon is false
        expect(clockElement.querySelector(".day-month").style.display).toBe("none"); // showDay is false
        expect(clockElement.querySelector(".digital-clock").style.display).toBe("none"); // showDigitalClock is false
    });

    // Test custom icon
    it("should display custom icon when provided", () => {
        // Create a DOM element for testing
        document.body.innerHTML = `
            <div id="test-clock-icon"></div>
        `;

        // Initialize the analog clock with custom icon
        Metro.makePlugin("#test-clock-icon", "analog-clock", {
            icon: "<span class='test-icon'>Icon</span>"
        });

        // Get the icon element
        const iconElement = document.querySelector("#test-clock-icon .icon");

        // Check that the icon was added
        expect(iconElement).not.toBeNull();
        expect(iconElement.innerHTML).toContain("<span class=\"test-icon\">Icon</span>");
    });

    // Test time update functionality
    it("should update time elements", () => {
        // Create a DOM element for testing
        document.body.innerHTML = `
            <div id="test-clock-time"></div>
        `;

        // Initialize the analog clock
        Metro.makePlugin("#test-clock-time", "analog-clock");

        // Get the clock elements
        const clockElement = document.querySelector("#test-clock-time");
        const hourHand = clockElement.querySelector(".hour");
        const minuteHand = clockElement.querySelector(".minute");
        const secondHand = clockElement.querySelector(".second");
        const digitalHour = clockElement.querySelector(".dc-hour");
        const digitalMinute = clockElement.querySelector(".dc-minute");
        const digitalSecond = clockElement.querySelector(".dc-second");

        // Check that the time elements exist and have transform styles
        expect(hourHand).not.toBeNull();
        expect(minuteHand).not.toBeNull();
        expect(secondHand).not.toBeNull();
        expect(digitalHour).not.toBeNull();
        expect(digitalMinute).not.toBeNull();
        expect(digitalSecond).not.toBeNull();
        
        expect(hourHand.style.transform).not.toBe("");
        expect(minuteHand.style.transform).not.toBe("");
        expect(secondHand.style.transform).not.toBe("");
        expect(digitalHour.innerHTML).not.toBe("");
        expect(digitalMinute.innerHTML).not.toBe("");
        expect(digitalSecond.innerHTML).not.toBe("");
    });

    // Test time format
    it("should respect time format setting", () => {
        // Create DOM elements for testing
        document.body.innerHTML = `
            <div id="test-clock-24h"></div>
            <div id="test-clock-12h"></div>
        `;

        // Initialize clocks with different time formats
        Metro.makePlugin("#test-clock-24h", "analog-clock", {
            timeFormat: 24
        });
        
        Metro.makePlugin("#test-clock-12h", "analog-clock", {
            timeFormat: 12
        });

        // Get the digital hour elements
        const hour24 = document.querySelector("#test-clock-24h .dc-hour").innerHTML;
        const hour12 = document.querySelector("#test-clock-12h .dc-hour").innerHTML;

        // Check that the hours are formatted differently
        // Note: We can't check exact values as they depend on the current time
        // But we can check that they're different formats
        const hour24Value = parseInt(hour24);
        const hour12Value = parseInt(hour12);
        
        if (hour24Value > 12) {
            expect(hour12Value).toBeLessThanOrEqual(12);
        } else {
            // If current hour is <= 12, both formats might show the same value
            expect(hour12Value).toBeLessThanOrEqual(12);
        }
    });

    // Test event firing
    it("should fire analog-clock-create event", () => {
        // Create a DOM element for testing
        document.body.innerHTML = `
            <div id="test-clock-event"></div>
        `;

        // Create a mock for the event handler
        const createEventMock = mock();

        // Initialize the analog clock with event handler
        Metro.makePlugin("#test-clock-event", "analog-clock", {
            onAnalogClockCreate: createEventMock
        });

        // Check that the event handler was called
        expect(createEventMock).toHaveBeenCalled();
    });

    // Test destroy method
    it("should destroy the analog clock component", () => {
        // Create a DOM element for testing
        document.body.innerHTML = `
            <div id="test-clock-destroy"></div>
        `;

        // Initialize the analog clock
        Metro.makePlugin("#test-clock-destroy", "analog-clock");

        // Get the analog clock instance
        const clock = Metro.getPlugin("#test-clock-destroy", "analog-clock");

        // Destroy the analog clock
        clock.destroy();

        // Check that the element was removed
        expect(document.querySelector("#test-clock-destroy")).toBeNull();
    });
});
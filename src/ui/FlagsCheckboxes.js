WGL.ui.FlagsCheckboxes = function(m, div_id, filterId, flags_list, flags_names, params) {

    let that = this;

    let h;

    if (typeof params === "undefined") {
        h = 150;
    } else {
        h = (params.h ? params.h : 180);
    }

    this.getDivId = function () {
        return div_id;
    };

    this.init = function () {

        let new_div = $("<div id='checkboxes-parent' style='height: " + h + "px'></div>");
        $("#" + div_id).append(new_div);

        let inner_div = $("<div style='padding-top: 20px; margin: 0 auto; width: 95%;'></div>");

        new_div.append(inner_div);

        for (let i = 0; i < flags_names.length; i++) {

            let count = numberWithSpaces(WGL._dimensions[m.name].getCounts()[flags_list[i]]['selected'] + WGL._dimensions[m.name].getCounts()[flags_list[i]]['unselected']);

            if (i % 2 === 0) {
                let new_checkbox = $("<div class='flag_checkbox' style='cursor: pointer; width: 48%; float: left;' ><span data-flag='" + i + "' id='flag_" + i + "' class='left' ><i style='font-size: 31px' class='material-icons'>check_box_outline_blank</i></span><label style='line-height: 28px; font-size: 12pt; cursor: pointer; vertical-align: top' for='flag_" + i + "'>" + flags_names[i] + "</label><span class='count flag_" + i + "' style='line-height: 28px; font-size: 12pt; cursor: pointer; vertical-align: top'> (" + count + ")</span></span></div>");
                inner_div.append(new_checkbox);
            } else {
                let new_checkbox = $("<div class='flag_checkbox' style='cursor: pointer; width: 48%; float: right;' ><span data-flag='" + i + "' id='flag_" + i + "' class='right' ><i style='font-size: 31px' class='material-icons'>check_box_outline_blank</i></span><label style='line-height: 28px; font-size: 12pt; cursor: pointer; vertical-align: top' for='flag_" + i + "'>" + flags_names[i] + "</label><span class='count flag_" + i + "' style='line-height: 28px; font-size: 12pt; cursor: pointer; vertical-align: top'> (" + count + ")</span></div>");
                inner_div.append(new_checkbox);
            }

        }

        $(".flag_checkbox").on("click", checkboxOnClick);

        const filter_clean = $("#chd-container-" + div_id + " .chart-filters-clean");
        filter_clean.off("click");
        filter_clean.on("click", function (e) {
            e.stopPropagation();
            that.clearSelection();
        });

    };

    this.update = function () {
        if ($("#checkboxes-parent").length === 0) {
            this.init();
        }

        let count;
        let icon;
        let flag_element;
        for (let i = 0; i < flags_list.length; i++) {
            count = numberWithSpaces(WGL._dimensions[m.name].getCounts()[flags_list[i]]['selected'] + WGL._dimensions[m.name].getCounts()[flags_list[i]]['unselected']);

            flag_element = $("span.count.flag_" + i);

            flag_element.text(" (" + count + ")");

            if (count === 0) {
                flag_element.closest(".flag_checkbox").off("click");
                flag_element.closest(".flag_checkbox").css("color", "lightgray").css("cursor", "default").find("i").css("color", "lightgray");
            } else {
                flag_element.closest(".flag_checkbox").off("click");
                flag_element.closest(".flag_checkbox").on("click", checkboxOnClick);
                icon = flag_element.closest(".flag_checkbox").css("color", "black").css("cursor", "pointer").find("i");
                if ($(icon).text() === "check_box") {
                    $(icon).css("color", "#ffa91b");
                } else {
                    $(icon).css("color", "black");
                }
            }
        }
    };

    this.clean = function () {
        this.clearSelection();
    };

    this.clearSelection = function () {

        let icons = $(".flag_checkbox i");

        for (let i = 0; i < icons.length; i++) {
            if ($(icons[i]).text() === "check_box") {
                $(icons[i]).text("check_box_outline_blank").css("color", "black");
            }
        }

        WGL.filterDim(m.name, filterId, []);
        updateFiltersHeader(0);
    };

    const checkboxOnClick = function () {
        if ($(this).find("i").text() === "check_box") {
            $(this).find("i").text("check_box_outline_blank").css("color", "black");
        } else {
            $(this).find("i").text("check_box").css("color", "#ffa91b");
        }

        let filter_active = [];
        let flags = $(".flag_checkbox span");

        for (let i = 0; i < flags.length; i++) {
            if ($(flags[i]).text() === "check_box") {
                filter_active.push(parseInt($(flags[i]).data("flag")));
            }
        }

        WGL.filterDim(m.name, filterId, filter_active);

        updateFiltersHeader(filter_active.length);

        if (typeof onMove !== "undefined") {
            onMove();
        }
    };

    const updateFiltersHeader = function (selected) {

        $("#chd-container-" + div_id + " .chart-filters-selected").html(selected);
        if (selected > 0) {
            $("#chd-container-footer-" + div_id + " .chart-filters-selected").html(selected);
            $("#chd-container-footer-" + div_id).removeClass("hide");
        } else {
            $("#chd-container-footer-" + div_id).addClass("hide");
        }

        if ($(".active-filters-container [id^=chd-container-footer]:not(.hide)").length > 0) {
            $(".close-item-filters").removeClass("hide");
            $("#active-filters-placeholder").addClass("hide");
            $(".active-filters-item .bar-item").addClass("bar-item-active");
            $(".active-filters-container").slideDown();
        } else {
            /*$(".close-item-filters").addClass("hide");
            $(".active-filters-item .bar-item").removeClass("bar-item-active");*/
            $("#active-filters-placeholder").removeClass("hide");
            $(".close-item-filters").removeClass("hide");
        }

    };

};
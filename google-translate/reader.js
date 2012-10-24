$(function () {
    $('body').addClass('page_mode_' + reader.page_mode);
    $('#notes').width($(window).width() - 20 - (mobile ? 20 : 40));
    $(window).resize(function () {
        if (reader.startReadResize) return;
        reader.startReadResize = 1;
        document.resized = 1;
        document.mustProccessImage = 1;
        if (mobile && !apple) setTimeout('pageView()', 100); else pageView();
        reader.startReadResize = 0;
    });
    document.mustProccessImage = 1;
    document.resized = 1;
    if (mobile) window.scrollTo(0, 1);
    buffer[chapter] = $('.content_col:first').html();
    reader.current_chapter = new Array();
    reader.current_chapter[0] = chapter;
    reader.current_chapter[1] = -1;
    if (mobile) {
        $.ajax({url:'/get_position.php', async:false, dataType:'json', data:{'nid':nid, 'time':new Date().getTime()}, success:function (data) {
            if (data.chapter != -1) {
                chapter = data.chapter;
                position = data.position;
                reader.current_chapter[0] = -1;
            }
        }});
    }
    pageView();
    document.resized = 0;
    bindButtons();
    $('#contents_menu li').click(function (event) {
        hideForm($('#contents_menu'));
        showContent(parseInt($(this).html()) - 1, 0);
        return false;
    });
});
function lockHeight(i) {
    if (!document.resized && !document.mustProccessImage) return;
    var el = $('#viewport');
    if (iPad) $('body').css('padding-top', 0);
    var raw_height = $(window).height() - el.offset().top - $('.bottom_main').height();
    if (iPhone) raw_height += 60;
    if (image_conversion) {
        width = el.width();
        var image = $('img', el).eq(i);
        aspect = width / image.width();
        image.attr('width', width).attr('height', parseInt(aspect * image.height())).attr("vspace", 0).css('margin', '0 auto').css('display', 'block');
        el.height(image.height());
    } else {
        var height = raw_height - (raw_height % reader.line_height_px);
        el.css("overflow", "hidden");
        el.height(height);
        var bottom_margin = raw_height - height - 1;
        var half_margin = parseInt(bottom_margin / 2);
        if (iPad) {
            $('.bottom_main').css("margin-bottom", half_margin);
            $('body').css('padding-top', bottom_margin - half_margin);
        }
        if (mobile) {
            $('.content_main').css("padding-bottom", bottom_margin);
        } else $('.bottom_main').css("margin-bottom", bottom_margin);
        imagesProccess(i);
    }
}
function releaseHeight() {
    var el = $('#viewport');
    el.height("auto");
    el.css("overflow", "visible");
}
function pageView(i) {
    i = i || 0;
    var content = $('.content_col').eq(i);
    var main = $('#viewport');
    if (position < 0) {
        chapter--;
        position = 1;
    } else if (position >= 1) {
        chapter++;
        position = 0;
    }
    if (i == 0) {
        chapter = Math.min(chapter, parts - 1);
        chapter = Math.max(0, chapter);
    }
    if (chapter >= parts) content.html("");
    if (reader.current_chapter[i] != chapter) {
        if (chapter >= 0 && chapter < parts) {
            if (!buffer[chapter]) {
                if (window.localStorage && window.localStorage.getItem(nid + '_' + chapter)) {
                    buffer[chapter] = window.localStorage.getItem(nid + '_' + chapter);
                    document.mustProccessImage = 1;
                    content.html(buffer[chapter]);
                } else {
                    centerBox($('#throbber'), $('#main'));
                    $('#throbber').show();
                    $.ajax({  url:'/get_content.php', data:{'nid':nid, 'chapter':chapter}, async:false, success:function (data) {
                        content.html(data);
                        buffer[chapter] = data;
                        document.mustProccessImage = 1;
                        if (data.indexOf('<error />') == -1) {
                            if (window.localStorage) window.localStorage.setItem(nid + '_' + chapter, data);
                        }
                    }, error:function () {
                        chapter = reader.current_chapter[i];
                        position = reader.previous_position || 0;
                        showMessage(scriptTexts[1]);
                    }});
                    $('#throbber').fadeOut('normal');
                }
            } else {
                document.mustProccessImage = 1;
                content.html(buffer[chapter]);
            }
        }
        reader.current_chapter[i] = chapter;
    }
    lockHeight(i);
    main_height = main.height();
    content_height = content.height() || main_height;
    pages_count = Math.ceil(content_height / main_height);
    current_page = Math.min(Math.round(position * content_height / main_height), pages_count - 1);
    current_page = Math.max(0, current_page);
    position = current_page * main_height / content_height;
    if (reader.page_mode == 2 && i == 0) {
        var t_chapter = chapter;
        var t_position = position;
        var t_current_page = current_page;
        var t_pages_count = pages_count;
        var t_content_height = content_height;
        if (current_page == pages_count - 1) {
            chapter++;
            position = 0;
        } else {
            position = (current_page + 1) * main_height / content_height;
        }
        pageView(1);
        chapter = t_chapter;
        position = t_position;
        current_page = t_current_page;
        pages_count = t_pages_count;
        content_height = t_content_height;
    }
    if (reader.page_mode == 2 && i == 1) {
        reader.chapter_right = chapter;
        reader.position_right = position;
        reader.content_height_right = content_height;
    }
    if (current_page == (pages_count - 1)) content.css("padding-bottom", pages_count * main_height - content_height); else content.css("padding-bottom", 0);
    $('#page_' + i).css('top', -current_page * main_height).fadeIn('fast');
    if (!reader.hide_numbers) {
        if (i > 0) {
            if (chapter >= parts) $('#pager_current').html(''); else $('#pager_current').html('<div style="float:right;padding-right:' + (parseInt(main.width() / 4) - (iPad ? 130 : 70)) + 'px">' + (chapter + 1) + '<span style="font-size:0.9em;">-' + (current_page + 1) + '</span>&nbsp;' + '<span>(' + parts + ')</span></div>');
        }
    }
    if (i > 0) return;
    if (!(mobile || soft_mobile || iPad)) bindSlider();
    if (!reader.hide_numbers) {
        if (reader.page_mode == 1) $('#pager_current').html((chapter + 1) + (image_conversion ? '' : '<span style="font-size:0.9em;">-' + (current_page + 1) + '</span>&nbsp;' + '<span>(' + parts + ')</span>')); else {
            var pager_2 = $('#pager_current').html();
            $('#pager_current').html('<div style="float:left;padding-left:' + (parseInt(main.width() / 4) - (iPad ? 130 : 70)) + 'px">' + (chapter + 1) + '<span style="font-size:0.9em;">-' + (current_page + 1) + '</span>&nbsp;' + '<span>(' + parts + ')</span></div>' + pager_2);
        }
    }
    pagersGeometry();
    $('#pager_left').unbind('click');
    $('#pager_left').click(function () {
        $(this).blur();
        if (position == 0 && chapter == 0) return;
        position = position - main_height / content_height;
        if (reader.page_mode == 2) {
            $('#page_1').fadeOut('fast', function () {
                pageView(1);
                if (position <= 0) {
                    chapter--;
                    position = 0.999;
                } else position = reader.position_right - main_height / reader.content_height_right;
            });
        }
        $('#page_0').fadeOut('fast', function () {
            pageView();
        });
    });
    $('#pager_right').unbind('click');
    $('#pager_right').click(function () {
        $(this).blur();
        if (reader.page_mode == 1) {
            if (position + main_height / content_height >= 1 && chapter >= (parts - 1)) return;
            position = position + main_height / content_height;
            $('#page_0').fadeOut('fast', function () {
                pageView();
            });
        } else {
            if (reader.position_right + main_height / reader.content_height_right >= 1 && reader.chapter_right >= (parts - 1)) return;
            position = reader.position_right + main_height / reader.content_height_right;
            chapter = reader.chapter_right;
            $('#page_0').add('#page_1').fadeOut('fast', function () {
                pageView();
            });
        }
    });
    if (mobile)setTimeout('window.scrollTo(0,1)', 100);
    settingsButton();
    var time = new Date().getTime();
    document.scrollTime = time;
    setTimeout('updateposition(' + time + ')', 2000);
    setTimeout('fillBuffer(' + time + ')', 1000);
    document.resized = 0;
    reader.last_read[0] = reader.last_read[1];
    reader.last_read[1] = [chapter, position];
    reader.previous_position = position;
}
function updateposition(time) {
    if (time == document.scrollTime) {
        $.get('/update_position.php', {'nid':nid, 'position':position, 'chapter':chapter});
    }
}
function bindButtons() {
    $(document).keydown(function (event) {
        if ($('#fader:visible').size()) return true;
        if (event.which == 37) {
            $("#pager_left").trigger("click");
            $(window).scrollTop(0);
            return false;
        }
        if (event.which == 114) {
            if ($('#edit-search-key').val()) {
                searchFormSubmit();
                return false;
            }
        }
        if (event.which == 39 || event.which == 32) {
            $("#pager_right").trigger("click");
            $(window).scrollTop(0);
            return false;
        }
        if (event.which == 17) {
            document.ctrl_down = true;
            return true;
        }
        if (event.which == 70 && document.ctrl_down == true) {
            showForm($('#reader-search-form'));
            return false;
        }
    });
    $(document).keyup(function (event) {
        if (event.which == 17) {
            document.ctrl_down = false;
            return true;
        }
    });
    if (reader.wheel_page_turn && !mobile && !iPad && !image_conversion) {
        if ($.browser.mozilla) document.addEventListener('DOMMouseScroll', wheelTurnHandler, false); else if (document.attachEvent) document.attachEvent('onmousewheel', wheelTurnHandler); else document.addEventListener('mousewheel', wheelTurnHandler, false);
    }
    if ((mobile || iPad) && reader.touch_page_turn) {
        var viewport = document.getElementById('viewport');
        viewport.addEventListener('touchstart', turnPageHandler, false);
        viewport.addEventListener('touchmove', turnPageHandler, false);
        viewport.addEventListener('touchend', turnPageHandler, false);
    }
}
function scrollTurnHandler(event) {
    $("#pager_right").trigger("click");
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;
    return false;
}
function wheelTurnHandler(event) {
    if ($('#fader:visible').size()) return true;
    var wDelta = 0;
    if (event.wheelDelta) {
        wDelta = event.wheelDelta / 120;
    } else if (event.detail) {
        wDelta = -event.detail / 3;
    }
    if (wDelta > 0) $("#pager_left").trigger("click"); else $("#pager_right").trigger("click");
    $(window).scrollTop(0);
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;
    return false;
}
function bindSlider() {
    if (mobile || soft_mobile) {
        var renderTo = $("#slider_mobile");
        var slider = document.slider_mobile;
    } else {
        var renderTo = $("#slider");
        var slider = document.slider;
    }
    var slider_step = 1;
    var slider_value = chapter;
    var slider_max = parts - 1;
    var rel_step = slider_step / slider_max;
    var rel_value = slider_value / slider_max;
    var rel_max = 1;
    if (slider) {
        slider.setSliderMax(slider_max);
        slider.setSliderValue(rel_value);
        $('#slider_page').css('left', slider.position().left).html(scriptTexts[2] + ' ' + (chapter + 1));
        return;
    }
    slider = $.fn.jSlider({renderTo:renderTo, size:{ barWidth:'auto'}, initposition:rel_value, slider_max:slider_max, onChanged:function (percentage, e, slider) {
        var value = percentage * slider.slider_max;
        chapter = parseInt(value);
        position = 0;
        pageView();
    }, onChanging:function (percentage, e, slider) {
        $('#slider_page').css('left', slider.position().left).html(scriptTexts[2] + ' ' + parseInt(percentage * slider.slider_max + 1));
    }});
    slider.setSliderValue(rel_value);
    $('#slider_page').css('left', slider.position().left).html(scriptTexts[2] + ' ' + (chapter + 1));
    if (mobile || soft_mobile) document.slider_mobile = slider; else document.slider = slider;
}
function turnPageHandler(event) {
    var touches = event.changedTouches, first = touches[0], left = $('#pager_left'), right = $('#pager_right');
    var width = $(window).width();
    var main = $('#main');
    switch (event.type) {
        case 'touchstart':
            main.css('position', 'absolute').width(main.width());
            document.startTouchX = first.pageX;
            document.startTouchY = first.pageY;
            event.preventDefault();
            break;
        case 'touchend':
            document.endTouchX = first.pageX;
            document.endTouchY = first.pageY;
            shiftY = Math.abs(document.endTouchY - document.startTouchY);
            if (document.endTouchX - document.startTouchX > 60) {
                main.animate({left:width + 'px'}, 100, 'swing', function () {
                    left.click();
                    main.css('left', -width + 'px');
                    main.animate({left:0}, 100, 'swing', function () {
                        main.css('position', 'static').width('auto');
                    });
                });
            } else if (document.startTouchX - document.endTouchX > 60) {
                main.animate({left:-width + 'px'}, 100, 'swing', function () {
                    right.click();
                    main.css('left', width + 'px');
                    main.animate({left:0}, 100, 'swing', function () {
                        main.css('position', 'static').width('auto');
                    });
                });
            } else main.animate({left:0}, 100, 'swing', function () {
                main.css('position', 'static').width('auto');
            });
            event.preventDefault();
            break;
        case 'touchmove':
            main.css('left', first.pageX - document.startTouchX + 'px');
            event.preventDefault();
            break;
        default:
            return;
    }
}
function showBookmarks() {
    var bookmarks = $('#bookmarks-wrapper');
    if (reader.last_read[0]) {
        var t_chapter = reader.last_read[0][0], t_position = reader.last_read[0][1];
        var bookmark = $('<div class="last"><a onclick="hideForm($(\'#bookmarks-form\'));showContent(' + t_chapter + ',' + t_position + ');$(this).parent().remove();">' + scriptTexts[3] + ' ' + (t_chapter + 1) + '</a>' + '</div><div class="clear"></div>');
        bookmarks.append(bookmark);
    }
    if ($('a', bookmarks).size() == 0) bookmarks.append($('<div class="last"><a>' + scriptTexts[4] + '</s></div>'));
    placeCloseCross(0, $('#bookmarks-form .close_cross'));
    showForm($('#bookmarks-form'));
}
function bookmarksAdd(e) {
    $('#bookmark_' + e.chapter).remove();
    var bookmarks = $('#bookmarks-wrapper');
    var bookmark = $('<div id="bookmark_' + e.chapter + '"><a onclick="hideForm($(\'#bookmarks-form\'));showContent(' + e.chapter + ',' + e.position + ');">' + e.title + '</a>' + '<img class="bookmark_delete" src="/themes/default/images/ico22.gif" onclick="$.get(\'/read/' + nid + '/bookmarks/delete\', {chapter:' + e.chapter + '});$(this).parent().remove();" alt="' + scriptTexts[5] + '" title="' + scriptTexts[5] + '" />' + '<br /><span class="bookmark_page">' + scriptTexts[6] + ' ' + (parseInt(e.chapter) + 1) + '</span>' + (e.memo ? '<br /><span class="bookmark_memo">' + e.memo + '</span>' : '') + '</div><div class="clear"></div>');
    bookmarks.prepend(bookmark);
}
function showBookmarkAdd() {
    var form = $('#bookmarks-add-form');
    $('#edit-title', form).val(scriptTexts[6] + ' ' + (chapter + 1));
    $('#edit-chapter', form).val(chapter);
    $('#edit-position', form).val(position);
    showForm($('#bookmarks-add-form'));
}
function tablesProccess() {
    var content = $('#inner_main .content').eq(0);
    var tables = $('table', content);
    if (tables.size() == 0) return;
    if (!document.mustProccessImage) return;
    $('td').add($('th')).css('padding', Math.floor((reader.line_height_px - 1) / 4) + 'px ' + Math.floor((reader.line_height_px - 1) / 4) + 'px ' + Math.ceil((reader.line_height_px - 1) / 4) + 'px ' + Math.floor((reader.line_height_px - 1) / 4) + 'px');
    for (var i = 0; i < tables.size(); i++) {
        $('tr:last td', tables.eq(i)).css('padding', Math.floor((reader.line_height_px - 1) / 4) + 'px ' + Math.floor((reader.line_height_px - 1) / 4) + 'px ' + (Math.ceil((reader.line_height_px - 1) / 4) - 1) + 'px ' + Math.floor((reader.line_height_px - 1) / 4) + 'px');
        tables.eq(i).css("margin-bottom", (reader.line_height_px - tables.eq(i).height() - 1) % reader.line_height_px);
    }
}
function imagesProccess(i) {
    var content = $('#viewport .content_col').eq(i);
    if ($('img', content).size() == 0) return;
    if (!document.mustProccessImage) return;
    var el = $('#viewport'), width = content.width(), height = el.height(), lineHeight = parseInt(el.css("line-height"));
    $('img', content).attr("vspace", 0).css('margin', '0 auto').css('display', 'block').each(function () {
        var img = $(this);
        if (img.data("width")) {
            var o_w = img.data("width");
            var o_h = img.data("height");
        } else {
            var o_w = img.width();
            var o_h = img.height();
            img.data("width", o_w);
            img.data("height", o_h);
        }
        var img_aspect = o_h / o_w;
        var win_aspect = height / width;
        if (win_aspect < img_aspect) {
            var aspect = height / o_h;
            if (aspect < 1) {
                img.height(height);
                img.width(Math.floor(aspect * o_w));
            } else img.width(o_w).height(o_h);
        } else {
            var aspect = width / o_w;
            if (aspect < 1) {
                img.width(width);
                img.height(Math.floor(aspect * o_h));
            } else img.width(o_w).height(o_h);
        }
        var position = img.position();
        var ostatok = position.top % el.height();
        if (ostatok + img.height() > el.height()) {
            if (ostatok + img.height() * 0.7 < el.height()) {
                var scale = (ostatok + img.height()) - el.height();
                scale = (img.height() - scale) / img.height();
                img.height(img.height() * scale).width(img.width() * scale);
            } else img.css("margin-top", el.height() - ostatok);
        }
        if (img.height() % lineHeight) img.css("padding-bottom", lineHeight - img.height() % lineHeight); else img.css("padding-bottom", 0);
    });
    if ((reader.page_mode == 2 && i == 1) || (reader.page_mode == 1)) document.mustProccessImage = 0;
}
function fillBuffer(timestamp) {
    if (timestamp != document.scrollTime) return;
    document.fillBufferTimestamp = document.fillBufferTimestamp || timestamp;
    if (timestamp < document.fillBufferTimestamp) return;
    document.fillBufferTimestamp = timestamp;
    ajax_status = 0;
    var b_lower = Math.max(0, chapter - 1), b_max = Math.max(0, Math.min(parts - 1, chapter + (buffer_size - 1))), i, next = Math.min(chapter + 1, b_max), previous = b_lower;
    if (!buffer[chapter]) buffer[chapter] = $('#inner_main .content').eq(0).html();
    for (i = next; i <= b_max; i++) {
        if (!buffer[i]) {
            next = i;
            break;
        }
    }
    if (next != chapter && !buffer[next]) {
        loadToBuffer(next, timestamp);
        return;
    }
    if (previous != chapter && !buffer[previous]) {
        loadToBuffer(previous, timestamp);
        return;
    }
}
function loadToBuffer(t_chapter, timestamp) {
    if (window.localStorage && window.localStorage.getItem(nid + '_' + t_chapter)) {
        buffer[t_chapter] = window.localStorage.getItem(nid + '_' + t_chapter);
        fillBuffer(timestamp);
    } else {
        if (ajax_status == 0 || ajax_status + 1000 * 120 < new Date().getTime()) {
            ajax_status = new Date().getTime();
            $.get('/get_content.php', {'nid':nid, 'chapter':t_chapter}, function (data, textStatus, XMLHttpRequest) {
                buffer[t_chapter] = data;
                if (data.indexOf('<error />') == -1) {
                    if (window.localStorage) window.localStorage.setItem(nid + '_' + t_chapter, data);
                }
                ajax_status = 0;
                if (image_conversion) {
                    var src = data.match(/src="(.*)"/);
                    if (src && src[1]) $.cacheImage(src[1]);
                }
                fillBuffer(timestamp);
            });
        }
    }
}
function sidebarClose(noResize) {
    document.sidebar = "closed";
    $('#sidebar-right').add($('#sidebar_close')).hide();
    $('#sidebar_open').show();
    if (!noResize) {
        document.mustProccessImage = 1;
        $(window).resize();
    }
}
function sidebarOpen(noResize) {
    document.sidebar = "open";
    $('#sidebar_open').hide();
    $('#sidebar-right').add($('#sidebar_close')).show();
    if (!noResize) {
        viewportCollapse(1);
        document.mustProccessImage = 1;
        $(window).resize();
    }
}
function viewportCollapse(noResize) {
    document.viewport = "collapsed";
    $('#viewport_collapse').hide();
    $('#viewport_expand').show();
    if (!noResize) {
        sidebarOpen(1);
        document.mustProccessImage = 1;
        $(window).resize();
    }
}
function viewportExpand() {
    sidebarClose(1);
    document.viewport = "expanded";
    $('#viewport_expand').hide();
    $('#viewport_collapse').show();
    document.mustProccessImage = 1;
    $(window).resize();
}
function showContent(t_chapter, t_position) {
    chapter = t_chapter;
    position = t_position;
    pageView();
}
function pagersGeometry() {
    if (!document.resized) return;
    if ((mobile || iPad) && reader.touch_page_turn) {
        $('#pager_left').add($('#pager_right')).hide(0);
        return;
    }
    var main = $('#main');
    if (mobile)var middle = $('#main .content_main').eq(0); else var middle = $('#main .content_main .middle').eq(0);
    if (Kindle) $('#pager_left').width(30).height(30).css("top", 8).css("left", main.offset().left + main.width() - 85); else if (mobile || soft_mobile || iPad)$('#pager_left').width(parseInt(middle.css('padding-left'))).height(main.height()).css("top", main.offset().top).css("left", main.offset().left); else $('#pager_left').width(main.width() / 2).height($('.bottom_main').height()).css("top", $('.bottom_main').offset().top).css("left", main.offset().left);
    if (Kindle) $('#pager_right').width(30).height(30).css("top", 8).css("left", main.offset().left + main.width() - 50); else if (mobile || soft_mobile || iPad) $('#pager_right').width(parseInt(middle.css('padding-right'))).height(main.height()).css("top", main.offset().top).css("left", main.offset().left + main.width() - parseInt(middle.css('padding-right'))); else $('#pager_right').width(main.width() / 2).height($('.bottom_main').height()).css("top", $('.bottom_main').offset().top).css("left", main.offset().left + main.width() / 2);
    if (Kindle) {
        $('#bottom_left img').add($('#bottom_right img')).css("position", "absolute").css('margin', 0).css("top", 10).each(function (index, e) {
            $(this).css('left', main.width() - 220 + index * 35);
        });
    } else if (!reader.hide_page_arrows && (mobile || soft_mobile || iPad)) $('#pager_left').add('#pager_right').addClass('arrows'); else $('#pager_left').add('#pager_right').removeClass('arrows');
}
function changePageMode(page_mode) {
    if (reader.page_mode == page_mode || image_conversion) return;
    if (page_mode == 1) {
        $('body').removeClass('page_mode_2').addClass('page_mode_1');
        $('#page_1').hide();
        $('#page_1').width(0);
        $('#page_0').width('100%');
    }
    if (page_mode == 2) {
        $('#page_0').width('44%');
        $('#page_1').width('44%');
        $('#page_1').show();
        $('body').removeClass('page_mode_1').addClass('page_mode_2');
    }
    reader.page_mode = page_mode;
}
function setPageMode(page_mode, width) {
    $('#page_mode_' + page_mode).hide();
    $('#page_mode_' + (page_mode == 1 ? 2 : 1)).show();
    changePageMode(page_mode);
    main_width = width;
    document.mustProccessImage = 1;
    $(window).resize();
    $.get('/update_settings.php', {'page_mode':page_mode});
    $('input:radio[name="pc[page_mode]"]').val([(page_mode == 1 ? "1" : "2")]);
}
function setFont(direction) {
    reader.font_size = reader.font_size + 2 * direction;
    if (reader.font_size > 20) reader.font_size = reader.font_size + 2 * direction;
    reader.font_size = Math.max(12, reader.font_size);
    reader.line_height_px = Math.ceil(reader.line_height * reader.font_size);
    $('#viewport').css('line-height', reader.line_height_px + 'px').css('font-size', reader.font_size);
    document.mustProccessImage = 1;
    $(window).resize();
    $.get('/update_settings.php', {'font_size':reader.font_size});
    $('input:text[name="pc[font_size]"]').val(reader.font_size);
}
function searchFormSubmit() {
    var form = $('#reader-search-form');
    var direction = $('input:radio[name=direction]', form).val();
    $('#edit-chapter', form).val(direction == 0 ? chapter : chapter - 1);
    ajax_form_submit('reader-search-form', '/reader/ajax_search');
}
function searchFormResult(data) {
    var form = $('#reader-search-form');
    var search_key = $('#edit-search-key', form).val();
    var direction = $('input:radio[name=direction]:checked', form).val();
    chapter = data.chapter;
    pageView();
    var content = buffer[chapter];
    if (direction == 0) {
        reader.search_offset = reader.search_offset || 0;
        search_content = content.substr(reader.search_offset).toLowerCase();
        var index = search_content.indexOf(search_key.toLowerCase());
    } else {
        reader.search_offset = reader.search_offset || content.length;
        if (reader.search_offset != content.length) reader.search_offset -= search_key.length;
        search_content = content.substr(0, reader.search_offset).toLowerCase();
        var index = search_content.lastIndexOf(search_key.toLowerCase());
    }
    if (index != -1) {
        if (direction == 0) reader.search_offset += index; else reader.search_offset = index;
        content = content.substr(0, reader.search_offset) + '<span id="search_result">' + content.substr(reader.search_offset, search_key.length) + '</span>' + content.substr(reader.search_offset + search_key.length);
        reader.search_offset += search_key.length;
        $('.content_col').eq(0).html(content);
        var search_result = $('#search_result');
        var top = search_result.position().top;
        var page = Math.floor(top / main_height);
        position = page * main_height / content_height;
        pageView();
    } else {
        reader.search_offset = 0;
        $('#edit-chapter', form).val(direction == 0 ? chapter + 1 : chapter - 2);
        ajax_form_submit('reader-search-form', '/reader/ajax_search');
    }
}
function showNote(id) {
    var note = $(id);
    if (note.size()) {
        showMessage(note.html());
    }
}
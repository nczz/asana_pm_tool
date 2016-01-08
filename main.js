/**
 * 
 * @authors Mxp (im@mxp.tw)
 * @date    2016-01-05 11:15:36
 * @version V0.9
 */
var userToken = ''; //Login in Asana.com > My Profile Settings > Apps
var workspace = ''; //Your workspace.

function debug(d) {
    console.log('DEBUG:', d);
}

function showStatus(info) {
    $('#showInfo').html(info + '<br/>' + $('#showInfo').html());
}

function getMembers() {
    $('.members').html('');
    $.ajax({
        method: 'GET',
        url: 'https://app.asana.com/api/1.0/workspaces/' + workspace + '/users',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + userToken
        },
        data: {

        },
        success: function(res) {
            debug(res.data);
            var members = res.data;
            var str = '<option value="null">請選擇指派成員</option>';
            for (var i = 0; i < members.length; ++i) {
                debug(members[i].id, members[i].name);
                str += '<option value="' + members[i].id + '">' + members[i].name + '</option>';
            }
            $('.members').html(str);
        }
    });
}

function getAsanaProject() {
    $('.projects').html('');
    $.ajax({
        method: 'GET',
        url: 'https://app.asana.com/api/1.0/projects',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + userToken
        },
        data: {

        },
        success: function(res) {
            debug(res.data);
            var projs = res.data;
            var str = '<option value="null">請選擇專案</option>';
            for (var i = 0; i < projs.length; ++i) {
                debug(projs[i].id, projs[i].name);
                str += '<option value="' + projs[i].id + '">' + projs[i].name + '</option>';
            }
            $('.projects').html(str);
        }
    });
}

function getCaseStatus() {
    $('.status').html('');
    var statusArr = ["洽談中", "待報價", "待簽約", "收款（頭款）", "資料確認（客戶規格）", "資料確認（功能流程）", "製作規格書", "製作前端甘特圖", "製作後端甘特圖", "頁面設計", "企業識別設計", "資料確認（頁面設計）", "開發（前端）", "開發（後端）", "製作驗收單", "驗收（功能）", "驗收（設計）", "網站上線", "收款（尾款）", "結案", "新增頁面修正/擴充案", "新增功能修正/擴充案", "特殊需求案"];
    var str = '<option value="null">請選擇狀態</option>';
    for (var i = 0; i < statusArr.length; ++i) {
        str += '<option value="' + statusArr[i] + '">' + statusArr[i] + '</option>';
    }
    $('.status').html(str);
}

function getTeams() {
    $('.teams').html('');
    $.ajax({
        method: 'GET',
        url: 'https://app.asana.com/api/1.0/organizations/' + workspace + '/teams',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + userToken
        },
        data: {

        },
        success: function(res) {
            debug(res.data);
            var teams = res.data;
            var str = '';
            for (var i = 0; i < teams.length; ++i) {
                debug(teams[i].id, teams[i].name);
                str += '<option value="' + teams[i].id + '">' + teams[i].name + '</option>';
            }
            $('.teams').html(str);
        }
    });
}

function init() {
    getAsanaProject();
    getMembers();
    getCaseStatus();
    getTeams();
}

function createTaskClick() {
    $('#createTask').click(function() {
        var project = $('#projects').val();
        var due_on = $('#due_on').val();
        var member = $('#members').val();
        var status = $('#status').val();
        var name = $('#name').val();
        var note = $('#note').val();
        debug(project, due_on, member, status, name, note);
        $.ajax({
            method: 'POST',
            url: "https://app.asana.com/api/1.0/tasks",
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer ' + userToken
            },
            data: due_on == '' ? {
                assignee: member,
                name: '專案階段：' +
                    status + ' > ' + name,
                'projects[0]': project,
                notes: note,
                workspace: workspace
            } : {
                assignee: member,
                name: '專案階段：' +
                    status + ' > ' + name,
                'projects[0]': project,
                notes: note,
                workspace: workspace,
                due_on: due_on
            },
            success: function(res) {
                debug(res);
                showStatus('建立成功：' + res.data.name);
            }
        });

    });
}

function createProjectClick() {
    $('#createProject').click(function() {
        var projectChtName = $('#projectChtName').val();
        var projectEngName = $('#projectEngName').val();
        var due_date = $('#due_date').val();
        var owner = $('#owner').val();
        var projectLD = $('#projectLD').val();
        var team = $('#teams').val();
        debug(projectChtName, projectEngName, due_date, owner, projectLD, team);
        $.ajax({
            method: 'POST',
            url: 'https://app.asana.com/api/1.0/projects',
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer ' + userToken
            },
            data: due_date == '' ? {
                owner: owner,
                name: projectChtName + '_' + projectEngName,
                notes: projectLD,
                workspace: workspace,
                team: team
            } : {
                owner: owner,
                name: projectChtName + '_' + projectEngName,
                notes: projectLD,
                workspace: workspace,
                due_date: due_date,
                team: team
            },
            success: function(res) {
                debug(res);
                showStatus('建立成功：' + res.data.name);
                init();
            }
        });

    });
}

function clearLogClick() {
    $('#showInfo').html('');
}

function eventBinding() {
    clearLogClick();
    createTaskClick();
    createProjectClick();
}

function getAuth(cb) {
    var urlparam = location.search.replace('?', '').split('&').reduce(function(s, c) {
        var t = c.split('=');
        s[t[0] == '' ? 'empty' : t[0]] = t[1] === undefined ? 'empty' : t[1];
        return s;
    }, {});
    if (urlparam.auth === undefined || urlparam.auth == 'empty' || urlparam.workspace === undefined || urlparam.workspace == 'empty') {
        alert('Please fill up "Personal Access Tokens" in auth parameter to use this tool.');
        return;
    } else {
        userToken = urlparam.auth;
        workspace = urlparam.workspace;
        cb();
    }
}

function main() {
    init();
    eventBinding();
}

$(document).ready(getAuth(main));
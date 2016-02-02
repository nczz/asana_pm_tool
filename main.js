/**
 * 
 * @authors Mxp (im@mxp.tw)
 * @date    2016-01-05 11:15:36
 * @version V1.0
 */
var userToken = ''; //Login in Asana.com > My Profile Settings > Apps
var workspace = ''; //Your workspace.
var hsMembers = null;
var hsProjects = null;

function debug(d) {
    console.log('DEBUG:', d);
}

function waitme(status) {
    if (!status) {
        console.log(1);
        $('body').waitMe({
            effect: 'facebook',
            text: '請稍候哦哦哦哦哦哦哦～',
            bg: 'rgba(255,255,255,0.7)',
            color: '#000',
            sizeW: '',
            sizeH: '',
            source: ''
        });
    } else {
        console.log(2);
        $('body').waitMe('hide');
    }
}


function showStatus(id, info) {
    $('#showInfo_' + id).html(info + '<br/>' + $('#showInfo_' + id).html());
    waitme('off');
}

function getMembers() {
    waitme();
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
            hsMembers = res.data;
            var members = res.data;
            var str = '<option value="null">請選擇指派成員</option>';
            for (var i = 0; i < members.length; ++i) {
                debug(members[i].id, members[i].name);
                if (members[i].name != 'Private User')
                    str += '<option value="' + members[i].id + '">' + members[i].name + '</option>';
            }
            $('.members').html(str);
            waitme('off');
        }
    });
}

function getAsanaProject() {
    waitme();
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
            hsProjects = res.data;
            var projs = res.data;
            var str = '<option value="null">請選擇專案</option>';
            for (var i = 0; i < projs.length; ++i) {
                debug(projs[i].id, projs[i].name);
                str += '<option value="' + projs[i].id + '">' + projs[i].name + '</option>';
            }
            $('.projects').html(str);
            waitme('off');
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
    waitme();
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
            waitme('off');
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
        waitme();
        var project = $('#projects').val();
        var due_on = $('#due_on').val();
        var member = $('#members').val();
        var status = $('#status').val();
        var name = $('#name').val();
        var note = $('#note').val();
        debug(project, due_on, member, status, name, note);
        $.ajax({
            method: 'POST',
            url: 'https://app.asana.com/api/1.0/tasks',
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
                showStatus(1, '建立成功：' + res.data.name);
            }
        });

    });
}

function createProjectClick() {
    $('#createProject').click(function() {
        waitme();
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
                showStatus(1, '建立成功：' + res.data.name);
                init();
            }
        });

    });
}

function clearLogClick() {
    $('#showInfo').html('');
}

function buildMemberSelect(members, classname, selected) {
    var s = '<select id="' + classname + '_' + selected + '" class="' + classname + ' selected form-control">';
    s += '<option value="null">移除指派</option>';
    for (var i = 0; i < members.length; ++i) {
        if (members[i].id == selected) {
            s += '<option selected="selected" value="' + members[i].id + '">' + members[i].name + '</option>';
        } else {
            if (members[i].name != 'Private User')
                s += '<option value="' + members[i].id + '">' + members[i].name + '</option>';
        }
    }
    return s += '</select>';
}

function getProjectName(proj, id) {
    var ans = '';
    for (var i = 0; i < proj.length; ++i) {
        if (proj[i].id == id) {
            return ans = proj[i].name;
        } else {
            ans = 'Project Not Found.';
        }
    }
    return ans;
}

function taskReassign(tid, uid, date, completed) {
    //waitme();
    var data = {};
    if (uid != '')
        data['assignee'] = uid;
    if (date != '')
        data['due_on'] = date;
    if (completed) {
        data['completed'] = true;
    } else {
        data['completed'] = false;
    }
    $.ajax({
        method: 'PUT',
        url: 'https://app.asana.com/api/1.0/tasks/' + tid,
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + userToken
        },
        data: data,
        success: function(res) {
            debug(res);
            showStatus(2, '更新成功：' + res.data.name);
        }
    });
}

function memberTasksSelect() {
    $('#memberTasks').change(function() {
        if ($('#memberTasks').val() == 'null')
            return;
        waitme();
        debug($('#memberTasks').val());
        $('#taskList').html('');
        $.ajax({
            method: 'GET',
            url: 'https://app.asana.com/api/1.0/tasks?opt_fields=completed,name,due_on,due_at,assignee,notes,projects&workspace=10885786790172&assignee=' + $('#memberTasks').val(),
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer ' + userToken
            },
            data: {},
            success: function(res) {
                debug(res);
                var head = '<table class="table table-striped"><thead><tr><th>編號</th><th>完成</th><th>專案</th><th>任務</th><th>細節</th><th>指派</th><th>死線</th></tr></thead><tbody>';
                var body = '';
                var foot = '</tbody></table>';
                var tr = '<tr>',
                    td = '<td>',
                    tre = '</tr>',
                    tde = '</td>';
                var data = res.data;
                for (var i = 0; i < data.length; ++i) {
                    body += tr +
                        td + (i + 1) + tde +
                        td + (data[i].completed == true ? '<input id="completed_t_' + data[i].id + '" class="completed" type="checkbox" name="completed" value="false" checked="checked"/>' : '<input id="completed_f_' + data[i].id + '" class="completed" type="checkbox" name="completed" value="true"/>') + tde +
                        td + (data[i].projects.length == 0 ? 'NO' : getProjectName(hsProjects, data[i].projects[0].id)) + tde +
                        td + data[i].name + tde +
                        td + data[i].notes + tde +
                        td + (buildMemberSelect(hsMembers, 'hs_' + data[i].id, data[i].assignee.id)) + tde +
                        td + '<input id="due_on_' + data[i].id + '" type="date" class="select-date form-control" value="' + (data[i].due_on == null ? '' : data[i].due_on) + '"/>' + tde +
                        tre;
                }
                $('#taskList').html(head + body + foot);
                $('.selected').change(function() {
                    var tid = $(this).attr('id').split('_')[1];
                    taskReassign(tid, $('#' + $(this).attr('id')).val());
                    $('#completed_f_' + tid + ',#completed_t_' + tid).attr('checked', false);
                });
                $('.select-date').change(function() {
                    var tid = $(this).attr('id').split('_')[2];
                    taskReassign(tid, '', $('#' + $(this).attr('id')).val());
                    $('#completed_f_' + tid + ',#completed_t_' + tid).attr('checked', false);
                });
                $('.completed').click(function() {
                    taskReassign($(this).attr('id').split('_')[2], '', '', $(this).val() == 'true' ? true : false);
                    $(this).val() == 'true' ? $(this).val('false') : $(this).val('true');
                });
                waitme('off');
            }
        });
    });
}

function eventBinding() {
    clearLogClick();
    createTaskClick();
    createProjectClick();
    memberTasksSelect();
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
    waitme();
    init();
    eventBinding();
}

$(document).ready(getAuth(main));

const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
var JiraClient = require("jira-connector");

app = express();

var jiraClient = new JiraClient({
    host: 'nxcore.atlassian.net',
    basic_auth: {
        base64: 'ZUBueC5jcjpFdnIxOTM0NSE='
    }
});

/*
jiraClient.issue.getIssue({
    issueKey: 'MOB-5'
}, function(error, issue) {
    console.log(issue.fields.summary);
});
*/

/*
jiraClient.project.getAllProjects({}, function(error, projects) {
    projects.forEach(project => {
        console.log(project.key);
    });
});
*/

jiraClient.project.getAllProjects({}).then(
    function(projects) {
        projects.forEach(project => {
            //console.log(project.key);
            jiraClient.search.search({"jql":"project = " + project.key + " AND updated >= -1w order by updated DESC"}).then(
                function(result) {
                    //console.log(result);
                    console.log("PROJECT: " + project.name);

                    if(result && result.total > 0) {
                        console.log("Issues updated last week: " + result.total);
                        console.log("------------------------------------");
                        result.issues.forEach(issue => {
                            console.log(issue.key + " - " + issue.fields.summary);
                        });
                        console.log("------------------------------------");
                        console.log("");
                    }
                    else {
                        console.log("NO UPDATES LAST WEEK");
                        console.log("------------------------------------");
                    }
                },
                function(error) {

                });
        });
    },
    function(error) {

    }
);


// schedule tasks to be run on the server
//cron.schedule("* * * * *", function() {
//    console.log("running a task every minute");
//});

//app.listen("3128");
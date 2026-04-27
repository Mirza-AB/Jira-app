package com.adnan.jiraclone.model;

public enum ProjectRole {
    ADMIN,    // manage workflow, users
    MANAGER,  // assign tickets, move to DONE
    DEVELOPER,// move to IN_PROGRESS
    REPORTER  // create & comment
}

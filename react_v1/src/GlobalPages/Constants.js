export const IS_MOCK = false;
export const LOCAL_ROOT = 'http://127.0.0.1:5000/';
export const TEST_ROOT = 'TODO';
export const PROD_ROOT = 'TODO';

const DeploymentTypeCode = {
    Test:0,
    Prod:1,
    Local:2
}

const DEPLOYMENT_TYPE = DeploymentTypeCode.Local;

export function getRoot(){
    switch(DEPLOYMENT_TYPE)
    {
        case DeploymentTypeCode.Test:
            return TEST_ROOT;
        case DeploymentTypeCode.Prod:
            return PROD_ROOT;
        case DeploymentTypeCode.Local:
            return LOCAL_ROOT;
        default:
            return;
    }
}

// ERRORS
export const getNot200 = 'GET Response status is not 200';
export const postNot200 = 'POST Response status is not 200';

// API'S
export const login          = 'api/login/';
export const changeEmail    = 'api/general/updateEmail';

// ADMIN API'S
export const adminFetch     = 'api/admin/fetch/';
export const addDate        = 'api/admin/addDate';
export const updateDeposit  = 'api/admin/updateDeposit';
export const deleteDates    = 'api/admin/deleteDates';
export const addUser        = 'api/admin/addUser';

// USER API'S
export const userFetch      = 'api/user/fetch/';

export const MOCK_ADMIN_OBJ = 
{
    "groupname" : "MGM",
    "users" :
    [
        {
            "username" : "u0",
            "dates":
            [
             "2018-07-03 16:10:31",
             "2018-07-04 10:20:30",
             "2018-07-05 11:11:20"
            ],
            "deposit": "50",
            "name": "Koray Yurtseven",
            "email": "koray.yurtseven@asd.com",
            "usertype": "admin"
        },
        {
            "username" : "u1",
            "dates":
            [
            "2018-07-06 12:00:00",
            "2018-07-07 13:00:00",
            "2018-07-08 14:00:00"
            ],
            "deposit": "40",
            "name": "Egemen",
            "email": "egemen@asd.com",
            "usertype": "admin"
        },
    ]
}

export const MOCK_USER_OBJ =
{
    "username": "anilaydin",
    "dates": [
        "2000-01-01",
        "2001-01-01"
    ],
    "deposit": 25,
    "email": "u1@u1.com",
    "name": "Anıl Aydın",
    "usertype": "user"
}

export const MOCK_LOGIN_RESPONSE =
{
    "username" : "user",
    "usertype" : "admin",
    "groupid" : "1"
}
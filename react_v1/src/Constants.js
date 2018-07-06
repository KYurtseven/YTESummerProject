export const IS_MOCK = true;
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

export const exampleURL = 'api/cassandraExample/';

export const MOCK_USER_OBJ = 
[
    {
        "id" : "1",
        "name": "Koray Yurtseven",
        "balance": "50",
        "entry_dates":
        [
         "2018-07-03 16:10:31",
         "2018-07-04 10:20:30",
         "2018-07-05 11:11:20"
        ]
    },
    {
        "id" : "2",
        "name": "Egemen",
        "balance": "30",
        "entry_dates":
        [
         "2018-07-06 12:00:00",
         "2018-07-07 13:00:00",
         "2018-07-08 14:00:00"
        ]
    },
    
];
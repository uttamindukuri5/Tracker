import 'dotenv/config.js'

import { GET, POST, PUT, DELETE } from './requestType';
import { setToken, getToken } from '../config/token';

const buildReqHeader = (type, data) => {
    return {
        method: type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '',
            'Authorization': `Bearer ${ getToken() }`
        },
        body: JSON.stringify(data)
    };
};

const buildResponse = (status, data) => {
    return { status, data };
 };

const callBackend = async (requestType, endpoint, data) => {
    let request;
    if (requestType === GET || requestType === DELETE)
        request = buildReqHeader(requestType);
    else
        request = buildReqHeader(requestType, data);
    console.log(process.env.REACT_APP_BACKEND_URL);
    const rawResponse = await fetch(process.env.REACT_APP_BACKEND_URL + endpoint, request);
    const response = await rawResponse.json();
    return buildResponse(rawResponse.status, response);
}

export const login = async data => {
    const response = await callBackend(POST, `/user/login`, data);
    setToken(response.data.token);
    return response;
}

export const register = async data => await callBackend(POST, `/user/create`, data);
export const getUser = async userId => await callBackend(GET, `/user/${ userId }`);
export const getAllUser = async () => await callBackend(GET, `/user`);

export const registerTrack = async data => await callBackend(POST, `/track/create`, data);

export const getTeamStat = async () => await callBackend(GET, `/stat/teams`);
export const getUserHistory = async () => await callBackend(GET, `/stat/history`);

export const getConfig = async () => await callBackend(GET, `/config/detroit`);
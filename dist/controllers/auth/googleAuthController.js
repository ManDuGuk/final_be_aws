"use strict";
/**
 * googleAuth.controller.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/27
 * 설명: 구글(Google) 소셜 로그인 및 회원가입 유도를 관리하는 컨트롤러 모듈입니다.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleAuthCallback = exports.getGoogleAuth = void 0;
const url = __importStar(require("url"));
const googleapis_1 = require("googleapis");
const crypto_1 = __importDefault(require("crypto"));
const auth_1 = require("../../util/auth");
const apiEndpoints_1 = __importDefault(require("../../config/apiEndpoints"));
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'DEFAULT_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'DEFAULT_GOOGLE_CLIENT_SECRET';
// const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL || 'DEFAULT_GOOGLE_REDIRECT_URL';
const FRONTEND_URL = process.env.FRONTEND_URL || `DEFAULT_FRONTEND_URL`;
const GOOGLE_REDIRECT_URL = apiEndpoints_1.default.auth.googleRedirect;
console.log(GOOGLE_CLIENT_ID);
console.log(GOOGLE_CLIENT_SECRET);
console.log(GOOGLE_REDIRECT_URL);
/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const oauth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL);
/**
 * Google OAuth 인증을 시작하는 컨트롤러
 *
 * 사용자를 Google 로그인 페이지로 리다이렉트합니다.
 *
 * @param {Request} req - 클라이언트 요청 객체
 * @param {Response} res - 서버 응답 객체
 * @returns {void} Google 로그인 페이지로 리다이렉트
 *
 * @example
 * // 라우터에서 사용
 * router.get('/auth/google', getGoogleAuth);
 */
const getGoogleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Access scopes for two non-Sign-In scopes: Read-only Drive activity and Google Calendar.
    const scopes = [
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/calendar.readonly'
    ];
    // Generate a secure random state value.
    const state = crypto_1.default.randomBytes(32).toString('hex');
    // Store state in the session
    req.session.state = state;
    // Generate a url that asks permissions for the Drive activity and Google Calendar scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        /** Pass in the scopes array defined above.
          * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true,
        // Include the state parameter to reduce the risk of CSRF attacks.
        state: state
    });
    res.redirect(authorizationUrl);
});
exports.getGoogleAuth = getGoogleAuth;
let userCredential = null;
/**
 * Google OAuth 인증 콜백 처리 컨트롤러
 *
 * Google에서 받은 인증 코드를 사용하여 액세스 토큰을 가져오고, 사용자 정보를 처리합니다.
 *
 * @param {Request} req - 클라이언트 요청 객체 (Google 인증 코드 포함)
 * @param {Response} res - 서버 응답 객체
 * @returns {void} 인증 성공 시 세션 생성 후 클라이언트로 리다이렉트
 *
 * @throws {Error} Google 인증 실패 또는 액세스 토큰 요청 실패
 *
 * @example
 * // 라우터에서 사용
 * router.get('/auth/google/callback', getGoogleAuthCallback);
 */
const getGoogleAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let q = url.parse(req.url, true).query;
    console.log(q);
    if (q.error) { // An error response e.g. error=access_denied
        console.log('Error:' + q.error);
    }
    else if (q.state !== req.session.state) { //check state value
        console.log('State mismatch. Possible CSRF attack');
        res.end('State mismatch. Possible CSRF attack');
    }
    else { // Get access and refresh tokens (if access_type is offline)
        // let tokens: Credentials;
        let { tokens } = yield oauth2Client.getToken(q.code);
        console.log(`tokens: `, tokens);
        oauth2Client.setCredentials(tokens);
        /* Save credential to the global variable in case access token was refreshed.
           ACTION ITEM: In a production app, you likely want to save the refresh token
           in a secure persistent database instead. */
        userCredential = tokens;
        // User authorized the request. Now, check which scopes were granted.
        if (tokens.scope && tokens.scope.includes('https://www.googleapis.com/auth/drive.metadata.readonly')) {
            // User authorized read-only Drive activity permission.
            // Example of using Google Drive API to list filenames in user's Drive.
            const drive = googleapis_1.google.drive('v3');
            drive.files.list({
                auth: oauth2Client,
                pageSize: 10,
                fields: 'nextPageToken, files(id, name)',
            }, (err1, res1) => {
                var _a;
                if (err1)
                    return console.log('The API returned an error: ' + err1);
                // `res1?.data?.files`에서 안전하게 추출
                const files = (_a = res1 === null || res1 === void 0 ? void 0 : res1.data) === null || _a === void 0 ? void 0 : _a.files;
                if (files && files.length > 0) {
                    console.log('Files:');
                    files.map((file) => {
                        console.log(`${file.name} (${file.id})`);
                    });
                }
                else {
                    console.log('No files found.');
                }
            });
        }
        else {
            // User didn't authorize read-only Drive activity permission.
            // Update UX and application accordingly
        }
        // Check if user authorized Calendar read permission.
        if (tokens.scope && tokens.scope.includes('https://www.googleapis.com/auth/calendar.readonly')) {
            // User authorized Calendar read permission.
            // Calling the APIs, etc.
        }
        else {
            // User didn't authorize Calendar read permission.
            // Update UX and application accordingly
        }
    }
    // 사용자 정보 가져오기
    const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = yield oauth2.userinfo.get(); // 이 메서드는 OAuth2 API에만 존재합니다.
    const email = userInfo.data.email;
    if (!email) {
        res.status(400).send({
            message: "이메일 정보가 없습니다.",
            status: 400,
        });
        return;
    }
    const { user, influencer } = yield (0, auth_1.getUserInfluencerInfo)(email);
    if (user) {
        const accessToken = (0, auth_1.handleIssueToken)(req, res, user, influencer);
        const result = accessToken;
        // 사용자 정보 쿼리 문자열로 포함
        const queryString = new URLSearchParams(result).toString();
        const redirectUrl = `${FRONTEND_URL}/login/callback?${queryString}`;
        res.redirect(redirectUrl);
    }
    else {
        // 4. 이메일이 없음 -> 회원가입 페이지로 연동
        // 회원가입 페이지로 리다이렉트
        const redirectUrl = `${FRONTEND_URL}/register?email=${encodeURIComponent(email)}`;
        res.redirect(redirectUrl);
    }
});
exports.getGoogleAuthCallback = getGoogleAuthCallback;

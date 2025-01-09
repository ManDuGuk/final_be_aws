"use strict";
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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config_1 = require("./swagger/config");
const database_1 = __importDefault(require("./util/database"));
require("./models/index");
const socket_be_1 = require("./util/socket_be");
const consumer_1 = require("./services/consumer");
const feed_1 = require("./router/feed");
const user_1 = require("./router/user");
const influencer_1 = require("./router/influencer");
const membershipProduct_1 = require("./router/membershipProduct");
const payments_1 = require("./router/payments");
const auth_1 = require("./router/auth");
const room_1 = require("./router/room");
const message_1 = require("./router/message");
const access_1 = require("./router/access");
const notification_1 = require("./router/notification");
const comment_1 = require("./router/comment");
const homeFeed_1 = require("./router/homeFeed");
const admin_1 = require("./router/admin");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const port = 4000;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use((0, cookie_parser_1.default)());
app.set('trust proxy', 1);
if (process.env.MORGAN === 'true') {
    app.use((0, morgan_1.default)('dev'));
}
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
const swaggerDocs = (0, swagger_jsdoc_1.default)(config_1.swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use('/auth', auth_1.router);
app.use('/access', access_1.router);
app.use('/feed', feed_1.router);
app.use('/user', user_1.router);
app.use('/influencer', influencer_1.router);
app.use('/membership', membershipProduct_1.router);
app.use('/room', room_1.router);
app.use('/message', message_1.router);
app.use('/payments', payments_1.router);
app.use('/noti', notification_1.router);
app.use('/comment', comment_1.router);
app.use('/homefeed', homeFeed_1.router);
app.use('/admin', admin_1.router);
(0, socket_be_1.initializeSocket)(server);
database_1.default
    .authenticate()
    .then(() => console.log('Database connection has been established successfully.'))
    .catch((err) => console.error('Unable to connect to the database:', err));
database_1.default
    .sync({ alter: false, logging: false })
    .then(() => console.log('All models were synchronized successfully.'))
    .catch((err) => console.error('Model synchronization failed:', err));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`http://localhost:${port}`);
    yield (0, consumer_1.startConsumer)();
}));

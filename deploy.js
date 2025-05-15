import FtpDeploy from "ftp-deploy"
import auth from "./ftpauth.json" with {type: "json"}
import pkg from "./package.json" with {type: "json"}
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ftp = new FtpDeploy();

const configVer = {
    user: auth.keycdn.username,
    password: auth.keycdn.password,
    host: auth.keycdn.host,
    port: auth.keycdn.port,
    localRoot: __dirname + "/lib",
    remoteRoot: `/${pkg.version}/`,
    include: ["*.*"],
    exclude: [],
    deleteRemote: true,
    forcePasv: true,
    sftp: false,
};

const configCurrent = {
    user: auth.keycdn.username,
    password: auth.keycdn.password,
    host: auth.keycdn.host,
    port: auth.keycdn.port,
    localRoot: __dirname + "/lib",
    remoteRoot: `/current/`,
    include: ["*.*"],
    exclude: [],
    deleteRemote: true,
    forcePasv: true,
    sftp: false,
};

const run = async () => {
    let result

    result = await ftp.deploy(configVer)
    console.log(result)
    result = await ftp.deploy(configCurrent)
    console.log(result)
}

run()

